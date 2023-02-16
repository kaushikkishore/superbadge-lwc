import { api, LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

// APPLICATION CONSTANTS
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {

    @api
    selectedBoatId;

    columns = [
        { label: 'Name', fieldName: 'Name', editable: true },
        { label: 'Length', fieldName: 'Length__c', type: 'number' },
        { label: 'Price', fieldName: 'Price__c', type: 'currency' },
        { label: 'Description', fieldName: 'Description__c' },
    ];

    boatTypeId = '';
    boats;
    isLoading = false;
    draftValues = [];

    @wire(MessageContext)
    messageContext;

    @wire(getBoats, { boatTypeId: '$boatTypeId' })
    wiredBoats({ data, error }) {
        if (data) {
            console.log(`Get boats by filter id`);
            console.log(data);

            this.boats = data;
        }

        if (error) {
            console.log(`Error while getting boats by filter id`);
            console.log(error);
        }
    }

    notifyLoading(isLoading) {
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }

    @api
    searchBoats(boatTypeId) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.boatTypeId = boatTypeId;
    }

    @api
    async refresh() {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        await refreshApex(this.boats);
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile(event) {
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
        console.log(`This is update selected tile information ${JSON.stringify(event.detail)}`);
    }

    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) {
        // Publish the message
        publish(this.messageContext, BOATMC, { recordId: boatId });
    }

    // The handleSave method must save the changes in the Boat Editor
    // passing the updated fields from draftValues to the 
    // Apex method updateBoatList(Object data).
    // Show a toast message with the title
    // clear lightning-datatable draft values
    handleSave(event) {
        // notify loading
        const updatedFields = event.detail.draftValues;
        // Update the records via Apex
        updateBoatList({ data: updatedFields })
            .then(() => {
                const toast = new ShowToastEvent({
                    title: SUCCESS_TITLE,
                    message: MESSAGE_SHIP_IT,
                    variant: SUCCESS_VARIANT,
                });
                this.dispatchEvent(toast);
                this.draftValues = [];
                return this.refresh();
            })
            .catch(error => {
                const toast = new ShowToastEvent({
                    title: ERROR_TITLE,
                    message: error.message,
                    variant: ERROR_VARIANT,
                });
                this.dispatchEvent(toast);
            })
            .finally(() => { });
    }
}
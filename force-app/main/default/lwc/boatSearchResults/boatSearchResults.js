import { api, LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvents';
import { refreshApex } from '@salesforce/apex';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';


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


    connectedCallback() {
        const loading = new CustomEvent('loading');
        this.dispatchEvent(loading);
    }

    @wire(getBoats, { boatTypeId: '$boatTypeId' })
    wireBoats({ data, error }) {
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

    updateSelectedTile(event) {
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
    }

    // Publish the selected boat ID 
    sendMessageService(boatId) {
        // Publish the message
        publish(this.messageContext, BOATMC, { recordId: boatId });
    }

    // Save the information 
    async handleSave(event) {
        const draftFieldValues = event.detail.draftValues;

        try {
            const result = await updateBoatList({ data: draftFieldValues });
            if (result === 'Success: Boats updated successfully') {
                // Show success toast event 
                const toast = new ShowToastEvent({
                    title: SUCCESS_TITLE,
                    message: MESSAGE_SHIP_IT,
                    variant: SUCCESS_VARIANT,
                });
                this.dispatchEvent(toast);
                this.draftValues = [];
                return this.refresh();
            } else {
                // show error toast event 
                const toast = new ShowToastEvent({
                    title: ERROR_TITLE,
                    message: error.message,
                    variant: ERROR_VARIANT,
                });
                this.dispatchEvent(toast);
            }
        } catch (e) {
            // show error toast event here also. 
            const toast = new ShowToastEvent({
                title: ERROR_TITLE,
                message: error.message,
                variant: ERROR_VARIANT,
            });
            this.dispatchEvent(toast);
        }
    }
}
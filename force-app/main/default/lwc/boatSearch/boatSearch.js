import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;

    handleLoading() {

        this.isLoading = true;
        console.log(`Handle loading...`);
    }

    handleDoneLoading() {
        this.isLoading = false;
        console.log(`Handle done loading`);
    }

    searchBoats(event) {
        const boatTypeId = event.detail.boatTypeId;
        this.template.querySelector('c-boat-search-results').searchBoats(boatTypeId);
        this.handleDoneLoading();
        console.log(`Invoked search boats`);
    }

    createNewBoat() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new'
            }
        });
        console.log(`Create new boat called`)
    }
}
import { LightningElement, wire } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {
    selectedBoatTypeId = 'AllTypes';

    // Used in the combobox
    searchOptions = [];
    //
    error;

    @wire(getBoatTypes)
    boatTypes({ data, error }) {
        if (data) {
            console.log(`Got boat types result`, data);
            this.searchOptions = data.map(item => {
                return { label: item.Name, value: item.Id };
            });
            this.searchOptions.unshift({ label: 'All Types', value: this.boatType });
            this.error = undefined;
        }

        if (error) {
            console.log(`Error in getting boat types`, error);
            this.searchOptions = undefined;
            this.error = error;
        }
    }

    handleSearchOptionChange(event) {
        const { value } = event.target;
        console.log(`Invoke boat type change value is ${value}`);
        this.selectedBoatTypeId = value;

        // Fire a custom event here 
        // name = search
        // boatTypeId: selectedBoatTypeId;
        // 
        // Create a search event 

        const searchEvent = new CustomEvent('search', {
            detail: {
                boatTypeId: this.selectedBoatTypeId
            }
        });

        // Fire the search event
        this.dispatchEvent(searchEvent);
    }
}
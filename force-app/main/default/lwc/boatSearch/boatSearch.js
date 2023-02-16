import { LightningElement } from 'lwc';


export default class BoatSearch extends LightningElement {
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
        console.log(`Invoked search boats`);
    }

    createNewBoat() {
        console.log(`Create new boat called`)
    }
}
import { LightningElement } from 'lwc';

export default class BoatSearch extends LightningElement {
    isLoading = false;

    handleLoading() {
        console.log(`Handle loading`);
        this.isLoading = true;
    }

    handleDoneLoading() {
        console.log(`Handle done loading`);
        this.isLoading = false;
    }

    searchBoats(event) {
        console.log(`Invoked search boats`);
    }

    createNewBoat() {
        console.log(`Create new boat called`)
    }
}
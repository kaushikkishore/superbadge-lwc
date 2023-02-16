import { LightningElement, api } from 'lwc';

// imports
// import BOAT_REVIEW_OBJECT from schema - BoatReview__c
// import NAME_FIELD from schema - BoatReview__c.Name
// import COMMENT_FIELD from schema - BoatReview__c.Comment__c
import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name';
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const SUCCESS_TITLE = 'Review Created!';
const SUCCESS_VARIANT = 'success';

export default class BoatAddReviewForm extends LightningElement {
    // Private
    boatId;
    rating;
    boatReviewObject = BOAT_REVIEW_OBJECT;
    nameField = NAME_FIELD;
    commentField = COMMENT_FIELD;
    labelSubject = 'Review Subject';
    labelRating = 'Rating';

    // Public Getter and Setter to allow for logic to run on recordId change
    get recordId() {
        return this.boatId;
    }

    set recordId(value) {
        //sets boatId attribute
        this.setAttribute('boatId', value);
        //sets boatId assignment
        this.boatId = value;

    }

    // Gets user rating input from stars component
    handleRatingChanged(event) {
        this.rating = event.detail.rating;
    }

    // Custom submission handler to properly set Rating
    // This function must prevent the anchor element from navigating to a URL.
    // form to be submitted: lightning-record-edit-form
    handleSubmit(event) {
        event.precentDefault();
        // Prepare the fields additional input like rating and boat ID 
        const fields = event.detail.fields;
        fields.Rating__c = this.rating;
        fields.Boat__c = this.boatId;
        // Submit the form
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    handleSuccess() {
        // TODO: dispatch the custom event and show the success message
        const toast = new ShowToastEvent({
            title: SUCCESS_TITLE,
            variant: SUCCESS_VARIANT,
        });
        this.dispatchEvent(toast);

        this.handleReset();

        const createReviewEvent = new CustomEvent('createreview');
        this.dispatchEvent(createReviewEvent);

    }

    // Clears form data upon submission
    // TODO: it must reset each lightning-input-field
    handleReset() {
        const inputFields = this.template.querySelector('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(f => { f.reset(); });
        }
    }
}
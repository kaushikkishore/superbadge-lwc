import { LightningElement, wire, api } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// imports
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';

export default class BoatsNearMe extends LightningElement {
    @api
    boatTypeId;

    mapMarkers = [];
    isLoading = true;
    isRendered;
    latitude;
    longitude;

    // Add the wired method from the Apex Class
    // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
    // Handle the result and calls createMapMarkers
    @wire(getBoatsByLocation, { latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId' })
    wiredBoatsJSON({ error, data }) {
        if (error) {
            console.error(`Error while getting boats by location`, error);
            const toast = new ShowToastEvent({
                title: ERROR_TITLE,
                message: error.message,
                variant: ERROR_VARIANT,
            });
            this.dispatchEvent(toast);
        }

        if (data) {
            // create map markers
            console.log(`Got boats near me `, data);
            this.createMapMarkers(data);
        }
        this.isLoading = false;
    }

    // Controls the isRendered property
    // Calls getLocationFromBrowser()
    renderedCallback() {
        if (isRendered === true) {
            return;
        }
        this.getLocationFromBrowser();
    }

    // Gets the location from the Browser
    // position => {latitude and longitude}
    getLocationFromBrowser() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
            });
            this.isRendered = true;
        }

    }

    // Creates the map markers
    createMapMarkers(boatData) {
        // Geolocation__Latitude__s, Geolocation__Longitude__s
        const newMarkers = JSON.parse(boatData).map(boat => {
            return {
                location: {
                    Latitude: boat.Geolocation__Latitude__s,
                    Longitude: boat.Geolocation__Longitude__s,
                },
                title: boat.Name,
            }
        });
        newMarkers.unshift({
            location: {
                Latitude: this.latitude,
                Longitude: this.longitude,
            },
            title: LABEL_YOU_ARE_HERE,
            icon: ICON_STANDARD_USER
        });

        this.mapMarkers = newMarkers;
    }
}

//in case on using ionic "ion-card"
import {IONIC_DIRECTIVES, Nav, NavParams, Config} from 'ionic-angular';
import {Component, Input, OnChanges} from '@angular/core';
import {LocationDetailsPage} from '../../pages/location-details/location-details';
import {MorePipe} from '../../pipes/pipes';

@Component({
    selector: 'locations-list',
    templateUrl: 'build/components/locations-list/locations-list.html',
directives: [IONIC_DIRECTIVES],
pipes: [MorePipe],
})

export class LocationsListComponent {
    @Input() locations: Array<any>;
    @Input() simple: boolean;
    is_empty: boolean;

     constructor(private nav: Nav, private config: Config) {
         this.is_empty = false;
}
     itemTapped(event, location) {
        // location.location_statistics.ticket_counts.closed = null;
         this.nav.push(LocationDetailsPage, location);
                   }
     
     ngOnChanges(event) {
        // console.log(event.locations);
         if (!this.simple)
             return;
         if ("locations" in event ) {
             if (event.locations.isFirstChange() && event.locations.currentValue !== null)
                 return;
             this.is_empty = !event.locations.currentValue || event.locations.currentValue.length == 0;
         }
     }
     
}

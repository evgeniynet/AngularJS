import {IONIC_DIRECTIVES, Nav, NavParams, Config, Modal, Alert} from 'ionic-angular';
import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {TicketProvider} from '../../providers/ticket-provider';
import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';
import {CloseTicketModal} from '../../pages/modals/modals';
import {htmlEscape} from '../../directives/helpers';
import {GravatarPipe, LinebreaksPipe, CapitalizePipe} from '../../pipes/pipes';

@Component({
    selector: 'tickets-list',
    templateUrl: 'build/components/tickets-list/tickets-list.html',
    directives: [IONIC_DIRECTIVES],
    pipes: [GravatarPipe, LinebreaksPipe, CapitalizePipe],
})
export class TicketsListComponent {
    LIMIT: number = 6;

    @Input() mode: Array<any>;
    @Input() count: number;
    @Input() preload: number;
    @Input() filter: string;
    tickets: Array<any>;
    cachelen: number;
    pager: any;
    is_empty: boolean;

    constructor(private nav: Nav, private navParams: NavParams, private config: Config, private ticketProvider: TicketProvider) {
        this.is_empty = false;
        this.pager = { page: 0, limit: this.LIMIT};
    }

     
     ngOnChanges(event) {
         if ("count" in event) {
             //TODO: add loading event
             if (event.count.isFirstChange())
                 return;
             this.count = event.count.currentValue;
             if (this.count < 1)
                 this.is_empty = true;
             else {
                 this.pager.limit = this.count;
                 this.onLoad();
                 this.is_empty = false;
             }
     }
     }

     ngOnInit() {
         this.cachelen = (this.ticketProvider._dataStore[this.mode[0] + (this.mode[1] || "")] || {}).length;
         if (this.mode[0] == "all")
         {
             this.pager.limit = this.LIMIT = 15;
         }
         if (this.preload && !this.cachelen) {
             setTimeout(() => {
                 this.onLoad();
             }, this.preload);
         }
         else
             this.onLoad();
     }

     onLoad()
     {
         if (!this.mode)
             return;

         let stat = this.config.getStat("tickets")[this.mode[0]];
         //console.log(this.mode[0] + (this.mode[1] || "") + " - stat:" + stat);
         this.count = !stat ? this.count : stat;
         //console.log(this.mode[0] + (this.mode[1] || "") + " - count:" + this.count);
         if (this.count !== 0) {
             this.ticketProvider.getTicketsList(this.mode[0], this.mode[1], this.pager);
             this.tickets = this.ticketProvider.tickets$[this.mode[0] + (this.mode[1] || "")];
         }
         else {
             this.is_empty = true;
         }
     }

     itemTapped(event, ticket, slidingItem) {
         if (event.srcElement.tagName.toUpperCase() != "ION-ITEM-SLIDING") {
             slidingItem.close();
             //only if no pageloaded
             //if (~['all','alt','user','tech'].indexOf(this.mode[0]))
             //    this.nav.tickets_tab = this.mode[0];
             this.nav.push(TicketDetailsPage, ticket);
         }
     }

     addPost(ticket, slidingItem) {
         slidingItem.close();
         let prompt = Alert.create({
      title: 'Add Response to #' + ticket.number,
      inputs: [
        {
          name: 'note',
          placeholder: 'Note'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Post',
          handler: data => {
              
              if (!data.note.trim())
                  return;

              var post = htmlEscape(data.note.trim()).substr(0, 5000);

              this.ticketProvider.addTicketPost(ticket.id, post).subscribe(
                  data => {
                      this.nav.alert('Note added :)');
                  },
                  error => {
                      console.log(error || 'Server error');
                  }
              );
          }
        }
      ]
    });

         this.nav.present(prompt);
     }

     closeTicket(ticket, slidingItem) {
         slidingItem.close();
         let myModal = Modal.create(CloseTicketModal, ticket);
         myModal.onDismiss(data => {
             if (!data)
                 return;
             this.count -= data;
             if (this.count < 1)
                 this.is_empty = true;
             else {
                 this.pager.limit = this.count;
                 this.onLoad();
                 this.is_empty = false;
             }
         });
         this.nav.present(myModal);
     }


     doInfinite(infiniteScroll) {
         if (this.is_empty || (this.cachelen > 0 && (this.cachelen % this.LIMIT)) || (this.count > 0 && (this.count < this.LIMIT)))
         {
             infiniteScroll.enable(false);
             infiniteScroll.complete();
             return;
         }
         this.pager.page += 1; 
         this.ticketProvider.getTicketsList(this.mode[0], this.mode[1], this.pager);
         this.ticketProvider.tickets$[this.mode[0] + (this.mode[1] || "")].subscribe(
             data => { 
                 infiniteScroll.complete();
                 infiniteScroll.enable(!(data.length % this.LIMIT));
              });
     }
 }

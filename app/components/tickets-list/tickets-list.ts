import {IONIC_DIRECTIVES, NavController, NavParams, Config, Modal, Alert} from 'ionic-angular';
import {Component, Input, OnChanges, OnInit} from 'angular2/core';
import {TicketProvider} from '../../providers/ticket-provider';
import {DataProvider} from '../../providers/data-provider';
import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';
import {CloseTicketModal} from '../../pages/modals/modals';
import {htmlEscape} from '../../directives/helpers';
import {GravatarPipe, LinebreaksPipe} from '../../pipes/pipes';

const LIMIT: number = 6;

@Component({
    selector: 'tickets-list',
    templateUrl: 'build/components/tickets-list/tickets-list.html',
    directives: [IONIC_DIRECTIVES],
    pipes: [GravatarPipe, LinebreaksPipe],
})
export class TicketsListComponent {
    @Input() mode: Array;
    @Input() count: number;
    @Input() preload: number;
    tickets: Array;
    cachelen: number;
    pager: Object;
    is_empty: boolean;

    constructor(private nav: NavController, private navParams: NavParams, private config: Config, private ticketProvider: TicketProvider, private dataProvider: DataProvider) {
        this.is_empty = false;
        this.pager = { page: 0, limit: LIMIT};
    }

     /*
     ngOnChanges(event) {
         if ("tickets" in event ) {
             //TODO: add loading event
             if (event.tickets.isFirstChange() && event.tickets.currentValue !== null)
                 return;
            this.is_empty = !event.tickets.currentValue || event.tickets.currentValue.length == 0;
     }
     }
     */

     ngOnInit() {
         //this.ticketProvider.tickets$.subscribe(
         //    data => { this.tickets = data });
         //this.tickets = this.ticketProvider.tickets$;
         this.cachelen = (this.ticketProvider._dataStore[this.mode[0]] || {}).length;
         if (this.preload && !this.cachelen) {
             setTimeout(() => {
                 this.busy = true;
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
         this.tickets = [];

         this.count = ((this.config.current.stat || {}).tickets || {})[this.mode[0]] || this.count;

         if (this.count !== 0) {
             var timer = null;
             
             if (this.cachelen) {
                this.tickets = this.ticketProvider._dataStore[this.mode[0]];
                this.pager.limit = this.cachelen;
                timer = -1;
                // if cache is already has all data
                //if (this.cachelen >= this.count){return;}
            }
             else 
                timer = setTimeout(() => { this.busy = true }, 500);

             this.getTickets(null, timer);
         }
         else {
             this.is_empty = true;
         }
     }

     itemTapped(event, ticket, slidingItem) {
         if (event.srcElement.tagName.toUpperCase() != "ION-ITEM-SLIDING") {
             slidingItem.close();
             if (~['all','alt','user','tech'].indexOf(this.mode[0]))
                 this.nav.tickets_tab = this.mode[0];
             this.nav.push(TicketDetailsPage, ticket);
         }
     }

     getTickets(infiniteScroll, timer)
     {
         this.ticketProvider.getTicketsList([this.mode[0]], this.mode[1], this.pager).subscribe(
             data => {
                 if (timer) {
                     if (timer != -1) {
                         this.is_empty = !data.length;
                         clearTimeout(timer);
                         this.busy = false;
                         this.count = data.length;
                     }
                     else
                     {
                         this.count = (this.cachelen % LIMIT) || LIMIT;
                         this.pager.page = Math.max((this.cachelen / LIMIT | 0) - 1, 0);
                         this.pager.limit = LIMIT;
                     }
                     this.tickets = data;
                 }
                 if (infiniteScroll){
                     this.tickets.push(...data);
                     infiniteScroll.enable(data.length == LIMIT);
                     this.count = data.length;
                     infiniteScroll.complete();
                 }
                 this.ticketProvider._dataStore[this.mode[0]] = this.tickets;
             },
             error => {
                 if (timer) {
                     clearTimeout(timer);
                     this.busy = false;
                 }
                 console.log(error || 'Server error');
             }
             );
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

              this.dataProvider.addTicketPost(ticket.id, post).subscribe(
                  data => {
                      this.config.alert.success("", 'Note added :)');
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
             console.log(data);
         });
         setTimeout(() => {
             this.nav.present(myModal);
         }, 500);
     }


     doInfinite(infiniteScroll) {
         if (this.is_empty || this.count < LIMIT)
         {
             infiniteScroll.enable(false);
             infiniteScroll.complete();
             return;
         }
         this.pager.page += 1; 
         this.getTickets(infiniteScroll);
     }
 }

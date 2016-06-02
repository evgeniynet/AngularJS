import {Page, ActionSheet, IONIC_DIRECTIVES, Nav, NavParams, Modal, Config} from 'ionic-angular';
import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {TicketCreatePage} from '../../pages/modals/modals';
import {TimelogPage} from '../../pages/timelog/timelog';
import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';
import {ExpenseCreatePage} from '../../pages/expense-create/expense-create';
import {UnInvoicesPage} from '../../pages/uninvoices/uninvoices';

@Component({
    selector: 'action-button',
    templateUrl: 'build/components/action-button/action-button.html',
    directives: [IONIC_DIRECTIVES],
})

export class ActionButtonComponent {

    @Input() data: any;
    current: any;
    actionSheet: any;

    constructor(private navParams: NavParams, private nav: Nav, private config: Config) {
        this.current = config.getCurrent();
        this.data = {};
    }
    
    ngOnInit() {
        //console.log(this.data);
        //this.data = {'tech': { id: queue.id, name: queue.fullname + ' Queue'};
    }
    
    openModal(page) {
        let myModal = Modal.create(page, this.data);
        myModal.onDismiss(data1 => { 
            //console.log(this.nav);
            //console.log(this.data);
            if (data1 && !this.data.tech && !this.data.account)
                setTimeout(() => {
                    this.nav.push(TicketDetailsPage, data1);
                }, 500);
        });
        setTimeout(() => {
            this.nav.present(myModal);
        }, 500);
    }
    
    presentActionSheet() {
        let but = [
        {
            icon: 'create',
            text: 'Add Ticket',
            role: '',
            handler: () => {
                this.openModal(TicketCreatePage);
            }
        }];
        if (this.current.is_time_tracking) {
            but.push({
                icon: 'md-time',
                text: 'Add Time',
                role: '',
                handler: () => {
                    this.openModal(TimelogPage);
                }
            });
            if (this.current.is_invoice)
                but.push(
                {
                    icon: 'card',
                    text: 'Add Invoice',
                    role: '',
                    handler: () => {
                        this.actionSheet.dismiss().then(() => this.nav.push(UnInvoicesPage));
                        return false;
                    }
                });
        }

        if (this.current.is_expenses)
            but.push({
                icon: 'calculator',
                text: 'Add Expense',
                role: '',
                handler: () => {
                    this.openModal(ExpenseCreatePage);
                }
            });

        but.push({
            icon: '',
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                console.log('Cancel clicked');
            }
        }
        );

        this.actionSheet = ActionSheet.create({
            title: '',
            buttons: but
        });

        //setTimeout( () => {
            this.nav.present(this.actionSheet);
        //});
    }
}

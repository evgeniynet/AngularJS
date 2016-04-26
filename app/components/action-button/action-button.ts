import {Page, ActionSheet, IONIC_DIRECTIVES, NavController, NavParams, Modal, Config} from 'ionic-angular';
import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from 'angular2/core';
import {TicketCreatePage} from '../../pages/modals/modals';
import {TimelogPage} from '../../pages/timelog/timelog';
import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';
import {ExpenseCreatePage} from '../../pages/expense-create/expense-create';
import {UnInvoicesPage} from '../../pages/invoices/uninvoices';

@Component({
    selector: 'action-button',
    templateUrl: 'build/components/action-button/action-button.html',
directives: [IONIC_DIRECTIVES],
})

export class ActionButtonComponent {

    @Input() data: any;
    actionSheet: any;

    constructor(private navParams: NavParams, private nav: NavController, private config: Config) {
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
        this.actionSheet = ActionSheet.create({
            title: '',
            buttons: [
                {
                    icon: 'create',
                    text: 'Add Ticket',
                    handler: () => {
                        this.openModal(TicketCreatePage);
                    }
                },{
                    icon: 'md-time',
                    text: 'Add Time',
                    handler: () => {
                        this.openModal(TimelogPage);
                    }
                },{
                    icon: 'card',
                    text: 'Add Invoice',
                    handler: () => {
                        this.nav.push(UnInvoicesPage);
                    }
                },{
                    icon: 'calculator',
                    text: 'Add Expense',
                    handler: () => {
                        this.openModal(ExpenseCreatePage);
                    }
                },{
                    icon: '',
                    text: 'Cancel',
                    style: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });

        //setTimeout( () => {
            this.nav.present(this.actionSheet);
        //});
    }

    ngOnDestroy() {
        this.actionSheet && this.actionSheet.dismiss();
    }
     
}

//in case on using ionic "ion-card"
import {Page, ActionSheet, IONIC_DIRECTIVES, NavController, NavParams, Modal, Config} from 'ionic-framework/ionic';
import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from 'angular2/core';
import {TicketCreatePage} from '../../pages/modals/modals';
import {TimelogPage} from '../../pages/timelog/timelog';
import {ExpenseCreatePage} from '../../pages/expense-create/expense-create';
import {InvoiceDetailsPage} from '../../pages/invoice-details/invoice-details';

@Component({
    selector: 'action-button',
    templateUrl: 'build/components/action-button/action-button.html',
directives: [IONIC_DIRECTIVES],
})

export class ActionButtonComponent {

    @Input() data: any;

    constructor(nav: NavController, config: Config) {
         this.nav = nav;
        this.config = config;
}
    
    ngOnInit() {
        //console.log(this.data);
        //this.data = {'tech': { id: queue.id, name: queue.fullname + ' Queue'};
    }
    
    openModal(page) {
        setTimeout( () => {
        let myModal = Modal.create(page, this.data);
        myModal.onDismiss(data => {
            console.log("close create");
        });
        this.nav.present(myModal);
        }, 200);
    }
    
    presentActionSheet() {
        let actionSheet = ActionSheet.create({
            title: '',
            buttons: [
                {
                    icon: 'create-outline',
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
                        this.openModal(InvoiceDetailsPage);
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
            this.nav.present(actionSheet);
        //});
    }

    /*ngOnDestroy() {
        actionSheet && actionSheet.dismiss();
    }*/
     
}

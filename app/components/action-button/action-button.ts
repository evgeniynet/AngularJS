import {Page, ActionSheet, IONIC_DIRECTIVES, Nav, NavParams, Modal, Config} from 'ionic-angular';
import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {TicketCreatePage} from '../../pages/modals/modals';
import {TimelogPage} from '../../pages/timelog/timelog';
import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';
import {ExpenseCreatePage} from '../../pages/expense-create/expense-create';
import {TodoCreatePage} from '../../pages/todo-create/todo-create';
import {InvoicesPage} from '../../pages/invoices/invoices';
import {InvoiceCreatePage} from '../../pages/invoice-create/invoice-create';

@Component({
    selector: 'action-button',
    templateUrl: 'build/components/action-button/action-button.html',
    directives: [IONIC_DIRECTIVES],
})

export class ActionButtonComponent {

    @Input() data: any;
    actionSheet: any;

    constructor(private navParams: NavParams, private nav: Nav, private config: Config) {
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
            if (data1 && !this.data.tech && !this.data.account && data1 != "close")
                this.nav.push(TicketDetailsPage, data1);
        });
        this.nav.present(myModal);
    }
    
    presentActionSheet() {
        if (!this.config.current.user.is_techoradmin)
        {
            this.openModal(TicketCreatePage);
            return;
        }
        let but = [
        {
            icon: 'create',
            text: 'Add ' + this.config.current.names.ticket.s,
            role: '',
            handler: () => {
                this.actionSheet.dismiss().then(() => this.openModal(TicketCreatePage));
                return false;
            }
        }];
        if (this.config.current.is_time_tracking) {
            but.push({
                icon: 'md-time',
                text: 'Add Time',
                role: '',
                handler: () => {
                    this.actionSheet.dismiss().then(() => this.openModal(TimelogPage));
                    return false;
                }
            });
            if (this.config.current.is_invoice)
                but.push(
                {
                    icon: 'card',
                    text: 'Create Invoice',
                    role: '',
                    handler: () => {
                        this.actionSheet.dismiss().then(() => this.nav.push(InvoiceCreatePage));
                        return false;
                    }
                });
            if (this.config.current.is_invoice)
                but.push(
                {
                    icon: 'card',
                    text: 'Show Invoices',
                    role: '',
                    handler: () => {
                        this.actionSheet.dismiss().then(() => this.nav.push(InvoicesPage));
                        return false;
                    }
                });
            if (this.config.current.is_todos)
                but.push(
                {
                    icon: 'ios-list-box-outline',
                    text: 'Add ToDo',
                    role: '',
                    handler: () => {
                        this.actionSheet.dismiss().then(() => this.nav.push(TodoCreatePage));
                        return false;
                    }
                });
        }

        if (this.config.current.is_expenses)
            but.push({
                icon: 'md-list-box',
                text: 'Add Expense',
                role: '',
                handler: () => {
                    this.actionSheet.dismiss().then(() => this.openModal(ExpenseCreatePage));
                    return false;
                }
            });

        but.push({
            icon: '',
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                console.log('Cancel clicked');
                return true;
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

//in case on using ionic "ion-card"
import {Page, ActionSheet, IONIC_DIRECTIVES, NavController, NavParams, Modal, Config} from 'ionic-framework/ionic';
import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from 'angular2/core';
import {TicketCreatePage} from '../../pages/modals/modals';

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
    
    openModal() {
        let myModal = Modal.create(TicketCreatePage, this.data);
        myModal.onDismiss(data => {
            console.log("close create");
        });
        this.nav.present(myModal);
    }
    
    presentActionSheet() {
        this.openModal();
        return;
        this.actionSheet = ActionSheet.create({
            title: '',
            buttons: [
                {
                    icon: 'create-outline',
                    text: 'Add Ticket',
                    handler: () => {
                        console.log('Destructive clicked');
                    }
                },{
                    icon: 'md-time',
                    text: 'Add Time',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                },{
                    icon: 'card',
                    text: 'Add Invoice',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                },{
                    icon: 'calculator',
                    text: 'Add Expense',
                    handler: () => {
                        console.log('Archive clicked');
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
        this.nav.present(this.actionSheet);
    }

    ngOnDestroy() {
        this.actionSheet && this.actionSheet.dismiss();
    }
     
}

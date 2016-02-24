//in case on using ionic "ion-card"
import {Page, ActionSheet, IONIC_DIRECTIVES, NavController, NavParams} from 'ionic/ionic';
import {Component, Input, Output} from 'angular2/core';

@Component({
    selector: 'action-button',
    templateUrl: 'build/components/action-button/action-button.html',
directives: [IONIC_DIRECTIVES],
})

export class ActionButtonComponent {
    //@Input() accounts: Array;
     constructor(nav: NavController) {
         this.nav = nav;
    //this.header = "into";
}
    presentActionSheet() {
        let actionSheet = ActionSheet.create({
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
        this.nav.present(actionSheet);
    }

    onPageWillLeave() {
        actionSheet && actionSheet.dismiss();
    }
     
}

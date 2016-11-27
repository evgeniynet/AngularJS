import {Page, Config, Nav, NavParams, Modal} from 'ionic-angular';

@Page({
    templateUrl: 'build/pages/todos/todos.html',
    //directives: [TicketsListComponent, Focuser],
})
export class TodosPage {
    
    constructor(private nav: Nav, private navParams: NavParams, private config: Config) {
    }
}
import { Config, Nav, NavParams, ViewController } from 'ionic-angular';
import { TodoProvider } from '../../providers/todo-provider';
export declare class TodoCreatePage {
    private nav;
    private navParams;
    private todoProvider;
    private config;
    private view;
    todo: any;
    he: any;
    displayFormat: string;
    UserDateOffset: number;
    constructor(nav: Nav, navParams: NavParams, todoProvider: TodoProvider, config: Config, view: ViewController);
    ngOnInit(): void;
    AddHours(date: any, hours: any): any;
    onSubmit(form: any): void;
    setMinTime(date: any): any;
    getStartDate(time: any): any;
    setStartDate(time: any): void;
    close(): void;
}

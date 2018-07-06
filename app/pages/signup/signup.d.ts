import { Config, Nav, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
export declare class SignupPage {
    private nav;
    private dataProvider;
    private config;
    private events;
    login: any;
    is_force_registration: boolean;
    constructor(nav: Nav, dataProvider: DataProvider, config: Config, events: Events);
    onPageLoaded(): void;
    getUrl(name: any): void;
    onSignup(form: any): void;
    presentConfirm(): void;
    gotoPrivacy(): void;
}

import { Config, Nav, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
export declare class LoginPage {
    private nav;
    private dataProvider;
    private config;
    private events;
    skype: any;
    login: any;
    google_action: string;
    busy: boolean;
    is_sd: boolean;
    fileDest: any;
    constructor(nav: Nav, dataProvider: DataProvider, config: Config, events: Events);
    onPageLoaded(): void;
    onLogin(form: any): void;
    ngAfterViewInit(): void;
    cancel_skype(): void;
    support(): void;
    onGoogleSignin(): void;
    onSignup(): void;
}

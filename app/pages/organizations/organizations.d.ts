import { Config, Nav, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { TicketProvider } from '../../providers/ticket-provider';
import { TimeProvider } from '../../providers/time-provider';
export declare class OrganizationsPage {
    private nav;
    private dataProvider;
    private config;
    private events;
    private ticketProvider;
    private timeProvider;
    list: Array<any>;
    constructor(nav: Nav, dataProvider: DataProvider, config: Config, events: Events, ticketProvider: TicketProvider, timeProvider: TimeProvider);
    onPageLoaded(): void;
    toggle(org: any, index: any): void;
    support(): void;
    alertOrg(name: any): void;
    onSelectInst(instance: any): void;
}

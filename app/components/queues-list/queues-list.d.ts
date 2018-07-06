import { Nav } from 'ionic-angular';
export declare class QueuesListComponent {
    private nav;
    queues: any;
    simple: boolean;
    is_empty: boolean;
    constructor(nav: Nav);
    ngOnChanges(event: any): void;
    goToQueueTicketsPage(queue: any): void;
}

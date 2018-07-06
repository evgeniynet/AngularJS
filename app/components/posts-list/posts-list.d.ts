import { Config } from 'ionic-angular';
export declare class PostsListComponent {
    private config;
    posts: Array<any>;
    _posts: Array<any>;
    attachments: Array<any>;
    is_showlogs: boolean;
    is_first: boolean;
    constructor(config: Config);
    filter(): void;
    ngOnInit(): void;
    ngOnChanges(event: any): void;
    getTime(date: any): any;
    setDate(date: any, showmonth?: any, istime?: any): any;
}

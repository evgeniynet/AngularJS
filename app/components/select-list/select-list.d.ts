import { Nav, Config } from 'ionic-angular';
import { ApiData } from '../../providers/api-data';
import { EventEmitter } from '@angular/core';
export declare class SelectListComponent {
    private nav;
    private apiData;
    private config;
    list: any;
    isbutton: boolean;
    is_enabled: boolean;
    is_me: boolean;
    preload: boolean;
    ajax: boolean;
    onChanged: EventEmitter<any>;
    selected: Object;
    init: boolean;
    url: string;
    name: string;
    constructor(nav: Nav, apiData: ApiData, config: Config);
    ngOnInit(): void;
    me(): void;
    open(): void;
    loadData(show: any): void;
    error(message: any): void;
    proceed_list(show: any): void;
    emit_changed(value: any): void;
    openRadio(): void;
    openModal(): void;
}

import { Nav, Config } from 'ionic-angular';
import { ApiData } from '../../providers/api-data';
import { EventEmitter } from '@angular/core';
import 'rxjs';
export declare class ClassListComponent {
    private nav;
    private apiData;
    private config;
    list: any;
    preload: boolean;
    onChanged: EventEmitter<any>;
    init: boolean;
    selected: Object;
    url: any;
    constructor(nav: Nav, apiData: ApiData, config: Config);
    ngOnInit(): void;
    open(): void;
    loadData(show: any): void;
    error(message: any): void;
    proceed_list(show: any): void;
    emit_changed(value: any): void;
    findPath(path: any, array: any, id: any): any;
    openRadio(): void;
    openModal(): void;
}

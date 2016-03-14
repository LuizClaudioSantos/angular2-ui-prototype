﻿import {Injectable} from 'angular2/core';
import {EventEmitter} from 'angular2/core';

@Injectable()
export class BreadcrumbService {

    emitter: EventEmitter<Object>;

    breadcrumb: any;
                
    constructor() {
        this.emitter = new EventEmitter<Object>();
    }

    visit(context) {
        this.emitter.next(context);
        this.breadcrumb = context;
    }

    getBreadcrumb() {
        return this.breadcrumb;
    }

}
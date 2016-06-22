import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { DSpaceHierarchyService } from '../../dspace/services/dspace-hierarchy.service';
import { BreadcrumbService } from '../services/breadcrumb.service';

import { TruncatePipe } from '../../utilities/pipes/truncate.pipe';

/**
 * Breadcrumb component for displaying current set of breadcrumbs of the
 * hierarchy to the given context. e.g. Home / Community / Collection / Item
 */
@Component({
    selector: 'breadcrumb',
    directives: [ ROUTER_DIRECTIVES ],
    pipes: [ TruncatePipe ],
    template: `
    			<ul class="list-inline breadcrumb">
                    <li *ngFor="let breadcrumb of trail">
                        <a *ngIf="rootBreadcrumb(breadcrumb)" [routerLink]="[breadcrumb.component]">{{ breadcrumb.name | truncate:[25] }}</a>
                        <a *ngIf="contextBreadcrumb(breadcrumb)" [routerLink]="[breadcrumb.component, { id: breadcrumb.id }]">{{ breadcrumb.name | truncate:[25] }}</a>
                        <a *ngIf="contextBreadcrumbWithPage(breadcrumb)" [routerLink]="[breadcrumb.component, { id: breadcrumb.id, page: breadcrumb.page }]">{{ breadcrumb.name | truncate:[25] }}</a>
                        <a *ngIf="contextBreadcrumbWithPageAndLimit(breadcrumb)" [routerLink]="[breadcrumb.component, { id: breadcrumb.id, page: breadcrumb.page, limit: breadcrumb.limit }]">{{ breadcrumb.name | truncate:[25] }}</a>
                    </li>
                </ul>
    		  `
})
export class BreadcrumbComponent implements AfterViewInit, OnDestroy {

    // TODO: probably should have a breadcrumb object

    /**
     * Array of any, { name: string, context: Object }, representing the breadcrumb trail.
     */
    trail: Array<any>;

    /**
     * Subscription to the breadcrumb service to recieve changes to the breadcrumb trail.
     */
    subscription: any;

    /**
     *
     * @param dspace
     *      DSpaceHierarchyService is a singleton service to interact with the dspace hierarchy.
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     */
    constructor(private dspace: DSpaceHierarchyService,
                private breadcrumbService: BreadcrumbService) {

    }

    /**
     * Method provided by Angular2. Invoked after the component view is ready.
     */
    ngAfterViewInit() {
        this.subscription = this.breadcrumbService.emitter.subscribe(obj => {
            if(obj.action == 'visit') {
                this.buildTrail(obj.context);
            }
            else {
                this.updateBreadcrumb(obj.breadcrumb);
            }
        });
    }

    /**
     * Method provided by Angular2. Invoked when destroying the component.
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * Method to build the breadcrumb trail when a given context is visited.
     *
     * @param context
     *      The current context. Represents a dspace object community, collection, or item.
     */
    private buildTrail(context): void {
        let root = this.breadcrumbService.getRoot();
        this.trail = new Array<any>();
        if (Object.keys(context).length > 0 && !context.root) {
            this.dropBreadcrumb(context).then(() => {
                this.trail.unshift(root);
            });
        }
        else {
            this.trail.unshift(root);
        }
    }

    /**
     * will not work if name of breadcrumb is what is being updated
     */
    private updateBreadcrumb(updatedBreadcrumb): void {
        for(let i in this.trail) {            
            if(this.trail[i].id == updatedBreadcrumb.id) {
                this.trail[i] = updatedBreadcrumb;
            }
        }
    }

    /**
     * Recursive method called by buildTrail to construct a breadcrumb trail
     * from the original provided context to the top most parent context.
     *
     * @param context
     *      The current context. Represents a dspace object community, collection, or item.
     */
    private dropBreadcrumb(context): Promise<any> {
        let bc = this;
        return new Promise(function (resolve, reject) {
            bc.trail.unshift({
                name: context.name,
                type: context.type,
                component: context.component,
                id: context.id,
                page: context.page,
                limit: context.limit
            });
            if ((context.parentCommunity && context.parentCommunity.type) || (context.parentCollection && context.parentCollection.type)) {
                let parentType = context.parentCommunity ? 'Community' : 'Collection';
                if (context['parent' + parentType].ready) {
                    bc.dropBreadcrumb(context['parent' + parentType]).then(() => {
                        resolve();
                    });
                }
                else {
                    bc.dspace.loadObj(context['parent' + parentType].type, context['parent' + parentType].id, context['parent' + parentType].page).then(parent => {
                        context['parent' + parentType] = parent;
                        bc.dropBreadcrumb(context['parent' + parentType]).then(() => {
                            resolve();
                        });
                    });
                }
            }
            else {
                resolve();
            }
        });
    }

    /**
     *
     */
    private rootBreadcrumb(breadcrumb: any): boolean {
        return !breadcrumb.id;
    }

    /**
     *
     */
    private contextBreadcrumb(breadcrumb: any): boolean {
        return breadcrumb.id && !breadcrumb.page;
    }

    /**
     *
     */
    private contextBreadcrumbWithPage(breadcrumb: any): boolean {
        return breadcrumb.id && breadcrumb.page && !breadcrumb.limit;
    }

    /**
     *
     */
    private contextBreadcrumbWithPageAndLimit(breadcrumb: any): boolean {
        return breadcrumb.id && breadcrumb.page && breadcrumb.limit;
    }

}

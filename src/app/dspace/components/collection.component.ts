import { Component } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';

import { DSpaceHierarchyService } from '../services/dspace-hierarchy.service';
import { BreadcrumbService } from '../../navigation/services/breadcrumb.service';

import { ContainerHomeComponent } from "./container-home.component";
import { ItemListComponent } from './item-list.component';

import { Collection } from "../models/collection.model";

/**
 * Collection component for displaying the current collection.
 * View contains sidebar context and tree hierarchy below current collection.
 */
@Component({
    selector: 'collection',
    directives: [ ContainerHomeComponent, ItemListComponent ],
    template: `
                <div *ngIf="collectionProvided()">
                    <container-home [container]="collection"></container-home>
                    <item-list *ngIf="collection.items.length > 0" [collection]="collection" [items]="collection.items"></item-list>
                </div>
              `
})
export class CollectionComponent {

    /**
     * An object that represents the current collection.
     */
    private collection: Collection;

    /**
     *
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param dspace
     *      DSpaceHierarchyService is a singleton service to interact with the dspace hierarchy.
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     */
    constructor(private params: RouteParams,
                private dspace: DSpaceHierarchyService,
                private breadcrumbService: BreadcrumbService) {
        dspace.loadObj('collection', params.get('id'), params.get('page'), params.get('limit')).then((collection:Collection) => {
            this.collection = collection;
            breadcrumbService.visit(this.collection);
        });
    }

    /**
     * Check if context provides a collection.
     */
    private collectionProvided(): boolean {
        return this.collection && this.collection.type == 'collection';
    }

}

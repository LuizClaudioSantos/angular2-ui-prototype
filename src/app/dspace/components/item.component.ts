import { Component } from '@angular/core';
import {
    RouteConfig,
    RouterOutlet,
    RouteParams,
    CanDeactivate,
    ComponentInstruction
} from '@angular/router-deprecated';

import { DSpaceHierarchyService } from '../services/dspace-hierarchy.service';
import { BreadcrumbService } from '../../navigation/services/breadcrumb.service';
import { GoogleScholarMetadataService } from "../../utilities/services/google-scholar-metadata.service.ts";
import { MetaTagService } from "../../utilities/meta-tag/meta-tag.service";

import { ObjectUtil } from "../../utilities/commons/object.util";

import { SimpleItemViewComponent } from './simple-item-view.component';
import { FullItemViewComponent } from './full-item-view.component';

import { Item } from "../models/item.model";

/**
 * Item component for displaying the current item. Routes to simple or item view.
 */
@Component({
    selector: 'item',
    directives: [ RouterOutlet ],
    providers: [ GoogleScholarMetadataService ],
    template: `
                <router-outlet></router-outlet>
              `
})
@RouteConfig([

        { path: "/", name: "SimpleItemView", component: SimpleItemViewComponent, useAsDefault: true },
        { path: "/full", name: "FullItemView", component: FullItemViewComponent },

        { path: '/**', redirectTo: [ '/Dashboard' ] }

])
export class ItemComponent implements CanDeactivate {

    /**
     *
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param dspace
     *      DSpaceHierarchyService is a singleton service to interact with the dspace hierarchy.
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param gsMeta
     *      GoogleScholarMetadataService is a singleton service to set the <meta> tags for google scholar
     */
    constructor(private dspace: DSpaceHierarchyService,
                private breadcrumbService: BreadcrumbService,
                private gsMeta: GoogleScholarMetadataService,
                private params: RouteParams) {
        dspace.loadObj('item', params.get("id")).then((item:Item) => {
            breadcrumbService.visit(item);
            this.gsMeta.setGoogleScholarMetaTags(item);
        });
    }

    /**
     * This method is called automatically when the user navigates away from this route. It is used
     * here to clear the google scholar meta tags.
     *
     * @param nextInstruction
     * @param prevInstruction
     * @returns {boolean}
     */
    routerCanDeactivate(nextInstruction: ComponentInstruction,
                        prevInstruction: ComponentInstruction): boolean | Promise<boolean> {
        if (ObjectUtil.hasValue(this.gsMeta)) {
            this.gsMeta.clearGoogleScholarMetaTags();
        }
        return true;
    }

}

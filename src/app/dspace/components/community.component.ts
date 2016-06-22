import { Component, OnDestroy, Inject } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';

import { DSpaceHierarchyService } from '../services/dspace-hierarchy.service';
import { BreadcrumbService } from '../../navigation/services/breadcrumb.service';

import { ContainerHomeComponent } from "./container-home.component.ts";
import { TreeComponent } from '../../navigation/components/tree.component';

import { Community } from "../models/community.model";

import { CommunitySidebarHelper } from '../../utilities/community-sidebar.helper';

/**
 * Community component for displaying the current community.
 * View contains sidebar context and tree hierarchy below current community.
 */
@Component({
    selector: 'community',
    directives: [ ContainerHomeComponent, TreeComponent ],
    providers : [CommunitySidebarHelper],
    template: `
                <div *ngIf="communityProvided()" class="community-home">
                    <container-home [container]="community"></container-home>
                    <tree [hierarchies]="subCommunitiesAndCollections(community)" header="community.home.browse"></tree>
                </div>
              `
})
export class CommunityComponent implements OnDestroy {

    /**
     * An object that represents the current community.
     */
    private community: Community;

    /**
     *
     * @param dspace
     *      DSpaceHierarchyService is a singleton service to interact with the dspace hierarchy.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param sidebarHelper
     *      SidebarHelper is a helper-class to inject the sidebar sections when the user visits this component
     */
    constructor(private dspace: DSpaceHierarchyService,
                private breadcrumb: BreadcrumbService,
                private params: RouteParams,
                @Inject(CommunitySidebarHelper) private sidebarHelper : CommunitySidebarHelper) {
        dspace.loadObj('community', params.get('id'), params.get('page'), params.get('limit')).then((community:Community) => {
            this.community = community;
            breadcrumb.visit(this.community);
            this.sidebarHelper.populateSidebar(this.community);
        });
    }

    /**
     * Check if context provides a community.
     */
    private communityProvided(): boolean {
        return this.community && this.community.type == 'community';
    }

    /**
     *
     */
    private subCommunitiesAndCollections(community: any): Array<any> {
        return community.subcommunities.concat(community.collections);
    }


    /**
     *
     */
    ngOnDestroy()
    {
        this.sidebarHelper.removeSections();
    }

}

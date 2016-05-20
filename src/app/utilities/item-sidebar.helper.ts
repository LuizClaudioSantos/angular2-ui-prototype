import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar-section.model';
import { Item } from '../dspace/models/item.model';
import { SidebarService } from './services/sidebar.service';


/**
 * Class to populate the sidebar on item-view pages.
 */
export class ItemSidebarHelper
{

    /**
     *
     */
    sections : Array<SidebarSection>;


    /**
     *
     * @type {boolean}
     */
    isAuthenticated : boolean = false;


    /**
     *
     * @param sidebarService
     * @param item
     * @param authorization
     */
    constructor(private sidebarService : SidebarService, private item : Item, private authorization? : any)
    {
        this.sidebarService = sidebarService;
        this.sections = [];
    }

    /**
     * The item sidebar requires an item object
     * Because we need some data from the item to populate the links
     * @param item
     */
    populateSidebar()
    {

        if(this.authorization != null)
        {
            this.isAuthenticated = this.authorization.isAuthenticated();
        }

        let editItemChildSection = SidebarSection.getBuilder()
            .name("sidebar.item-context.edit")
            .route("ItemEdit",{id:this.item.id}) // does not exist yet.
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .build();
        let viewItemChildSection = SidebarSection.getBuilder()
            .name("sidebar.item-context.view")
            .route('Items',{id:this.item.id})
            .build();
        let itemSection = SidebarSection.getBuilder()
            .name("sidebar.item-context.header")
            .addChild(viewItemChildSection)
            .addChild(editItemChildSection)
            .id("itemsidebar")
            .index(2)
            .build();
        this.sections.push(itemSection);
        this.sidebarService.addSection(itemSection);
    }


    /**
     *
     */
    removeSections()
    {
        this.sections.forEach(section => this.sidebarService.removeSection(section));
    }
}
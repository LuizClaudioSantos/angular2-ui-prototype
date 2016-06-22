import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { Collection } from "../../models/collection.model";
import { ViewElementComponent } from './view-element.component';

/**
 * Component for the collections of the simple-item-view.
 */
@Component({
    selector: 'item-collection',
    directives: [ ROUTER_DIRECTIVES, ViewElementComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <view-element *ngIf="validParent()" [header]="componentTitle | translate" class="simple-item-view-collection">
                    <a *ngIf="validParent()" [routerLink]="[itemParent.component, {id: itemParent.id}]">{{ itemParent.name }}</a>
                </view-element>
              `
})
export class ItemCollectionComponent {

    /**
     * 
     */
    @Input() private itemParent: Collection;
    
    /**
     * 
     */
    private componentTitle: string = "item-view.header.collections";

    /**
     * TODO: this should show mapped collections as well.
     */
    private validParent(): number {
        return (this.itemParent && this.itemParent.component && this.itemParent.id);
    }

}

import { Component, OnChanges, Input } from '@angular/core';

import { TranslatePipe } from "ng2-translate/ng2-translate";
import { ViewComponent } from '../../models/view-component.model'
import { MetadataHelper } from '../../../utilities/metadata.helper';
import { Metadatum } from '../../models/metadatum.model'
import { ViewElementComponent } from './view-element.component';

import { FormInlineEditComponent } from '../../../utilities/form/form-inline-edit.component';

/**
 * Component for the authors of the simple-item-view.
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 */
@Component({
    selector: 'item-abstract',
    directives: [ FormInlineEditComponent, ViewElementComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <view-element *ngIf="hasMetadata()" class="simple-item-view-abstract" [header]="componentTitle | translate" [headerClasses]="['visible-xs']">
                    <div *ngFor="let metadatum of filteredFields;">
                        <inline-edit [model]="metadatum" property="value" [class]="'simple-item-view-abstract-contents'"></inline-edit>
                    </div>
                </view-element>
              `
})
export class AbstractComponent extends ViewComponent implements OnChanges {

    /**
     *
     */
    @Input() private itemData: Array<Metadatum>;

    /**
     *
     */
    private componentTitle: string = "item-view.header.abstract";

    /**
     *
     */
    constructor() {
        super(["dc.description.abstract"]);
    }

    /**
     *
     */
    ngOnChanges() {
        super.filterMetadata(this.itemData);
    }

}

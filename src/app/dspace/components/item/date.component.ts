import {Component, Input} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";



import {TruncatePipe} from "../../../utilities/pipes/truncate.pipe"
import {MetadataHelper} from '../../../utilities/metadata.helper';
import {Metadatum} from '../../models/metadatum.model'
import {ViewElementComponent} from './view-element.component'

/**
 * Component for the authors of the simple-item-view.
 * This component gets a list of all metadata, and filters for the appropriate date to be shown.
 */

@Component({
    selector: 'item-date',
    inputs: ['itemData'],
    directives: [ViewElementComponent],
    pipes: [TruncatePipe, TranslatePipe],
    template:
        `
        <view-element [header]="componentTitle | translate">
            <div *ngFor="#metadatum of filteredFields;">
                <p>{{ metadatum.value | truncate}}</p> <!-- calling our truncate pipe without arguments will is equals to truncate : 10. (Display the first 10 chars or the string) -->
            </div>
        </view-element>
            `
})

export class DateComponent {

    private componentTitle = "item-view.date.title";
    private itemData : Metadatum[];
    private fields : String[]; // the fields that we want to show on this page.
    private filteredFields : Metadatum[]; // the values that we will filter out of the metadata.

    constructor()
    {
        this.fields = ["dc.date.accessioned"];
    }

    ngOnInit()
    {
        this.filterMetadata();
    }

    private filterMetadata()
    {
        let metadataHelper = new MetadataHelper();
        this.filteredFields = metadataHelper.filterMetadata(this.itemData,this.fields);
    }

}

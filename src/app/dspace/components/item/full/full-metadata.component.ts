import { Component, Input } from '@angular/core';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from '../../../authorization/services/authorization.service';
import { DSpaceService } from '../../../services/dspace.service';
import { ContextProviderService } from '../../../services/context-provider.service';
import { NotificationService } from '../../../../utilities/notification/notification.service';

import { Metadatum } from '../../../models/metadatum.model'
import { ViewElementComponent } from '../view-element.component';

import { FormInlineEditComponent } from '../../../../utilities/form/form-inline-edit.component';

/**
 * Renders a table of all metadata entries of an item.
 */
@Component({
    selector: 'item-full-metadata',
    directives: [ FormInlineEditComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <view-element>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="thead-inverse">
                                <tr>
                                    <th>{{ 'item-view.full.full-metadata.thead.key' | translate }}</th>
                                    <th>{{ 'item-view.full.full-metadata.thead.value' | translate }}</th>
                                    <th>{{ 'item-view.full.full-metadata.thead.lang' | translate }}</th>
                                    <th *ngIf="editing()">{{ 'item-view.full.full-metadata.thead.remove' | translate }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr *ngFor="let metadatum of itemData">

                                    <td class="item-full-metadata-label-cell">{{ metadatum.key }}</td>
                                    <td>
                                        <inline-edit class="word-break item-full-metadata-data-cell" [model]="metadatum" property="value"></inline-edit>
                                    </td>
                                    <td class="item-full-metadata-language-cell">{{ metadatum.language }}</td>
                                    
                                    <td class="item-full-metadata-remove-cell">
                                        <span *ngIf="removable(metadatum)" class="glyphicon glyphicon-trash clickable" (click)="remove(metadatum)"></span>
                                    </td>
                                    
                                </tr>


                                <tr *ngIf="adding">

                                    <td class="item-full-metadata-label-cell">

                                    </td>

                                    <td>
                                        <div class="word-break item-full-metadata-data-cell">

                                        </div>
                                    </td>

                                    <td class="item-full-metadata-language-cell">

                                    </td>

                                    <td class="item-full-metadata-remove-cell">

                                    </td>

                                </tr>

                            </tbody>
                        </table>
                        <a *ngIf="editing()" class="btn btn-default pull-right" (click)="addMetadataInline()">{{ 'item-view.add-metadata' | translate }}</a>
                    </div>
                </view-element>
              `
})
export class FullMetadataComponent {

    /**
     * We get all metadata related to the item in question from the 'full-item-view'
     */
    @Input() private itemData: Array<Metadatum>;

    /**
     *
     */
     private adding: boolean = false;

    /**
     * 
     */
    constructor(private translate: TranslateService,
                private contextProvider: ContextProviderService,
                private notificationService: NotificationService,
                private dspaceService: DSpaceService,
                private authorization: AuthorizationService) {

    }
        
    /**
     * 
     */
    remove(metadatum: Metadatum): void {
        
        let token = this.authorization.user.token;
        
        let item = this.contextProvider.context;
        
        // have to store a list of the editable metadata to reset the editable property after update
        // the sanitization removes editable for the REST API to accept the PUT
        let editableMetadata = new Array<string>();
        
        // removing them from the item's metadata property triggers change detection
        for(let i = item.metadata.length - 1; i >= 0; i--) {
            
            // temporary easy way to sanatize metadata for REST PUT
            if(item.metadata[i].editable) {
                editableMetadata.push(item.metadata[i].key);
                delete item.metadata[i].editable;
            }
            
            // remove the metadata being removed
            if(item.metadata[i].key == metadatum.key && 
               item.metadata[i].value == metadatum.value &&
               item.metadata[i].language == metadatum.language) {
                item.metadata.splice(i, 1);
            }
            
        }
        
        if(item.type == 'item') {
            
            this.dspaceService.clearItemMetadata(token, item.id).subscribe(response => {
    
                if(response.status == 200) {
                    
                    this.dspaceService.updateItemMetadata(item.metadata, token, item.id).subscribe(response => {
    
                        if(response.status == 200) {
                            
                            item.metadata.forEach(m => {
                               if(editableMetadata.indexOf(m.key) > -1) {
                                    m.editable = true;
                               }
                            });
                            
                            this.notificationService.notify('item', 'SUCCESS', this.translate.instant('delete.success', { name: metadatum.key }), 10);
                        }
                    },
                    error => {
                        console.error(error);
                        this.notificationService.notify('item', 'DANGER', this.translate.instant('delete.error', { name: metadatum.key }));
                    });
                    
                }
            },
            error => {
                console.error(error);
                this.notificationService.notify('item', 'DANGER', this.translate.instant('delete.error', { name: metadatum.key }));
            });
        }
    }
    
    /**
     * 
     */
    addMetadataInline(): void {
        this.adding = true;
    }

    /**
     * 
     */
    editing(): boolean {
        return this.itemData ? this.contextProvider.editing : false;
    }

    /**
     * 
     */
    removable(metadatum: Metadatum): boolean {
        return this.editing() && metadatum['editable'];
    }

}
import { Component, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { ContextProviderService } from '../services/context-provider.service';
import { NotificationService } from '../../utilities/notification/notification.service';
import { Notification } from '../../utilities/notification/notification.model';

import { AbstractComponent } from './item/abstract.component';
import { AuthorsComponent } from './item/authors.component';
import { BitstreamsComponent } from './item/bitstreams.component';
import { DateComponent } from './item/date.component';
import { ItemCollectionComponent } from './item/item-collection.component';
import { ThumbnailComponent } from './item/thumbnail.component';
import { UriComponent } from './item/uri.component';

import { FormInlineEditComponent } from '../../utilities/form/form-inline-edit.component';

import { Item } from '../models/item.model';

/**
 * A simple item view, the user first gets redirected here and can optionally view the full item view.
 *
 * Item component for displaying the current item.
 * View contains sidebar context and tree hierarchy below current item.
 */
@Component({
    selector: 'simple-item-view',
    directives: [ ROUTER_DIRECTIVES,
                  AbstractComponent,
                  AuthorsComponent,
                  BitstreamsComponent,
                  DateComponent,
                  FormInlineEditComponent,
                  ItemCollectionComponent,
                  ThumbnailComponent,
                  UriComponent ],
    pipes: [ TranslatePipe ],
    template: `
                <div *ngIf="itemProvided()">
                    <div class="item-summary-view-metadata">
                        <inline-edit class="page-header" [model]="item" property="name"></inline-edit>
                        <div class="row">
                            <div class="col-sm-4">
                                <thumbnail [thumbnailLink]="item.thumbnail"></thumbnail>
                                <item-bitstreams [itemBitstreams]="item.bitstreams"></item-bitstreams>
                                <item-date [itemData]="item.metadata"></item-date>
                                <item-authors [itemData]="item.metadata"></item-authors>
                            </div>
                            <div class="col-sm-8">
                                <item-abstract [itemData]="item.metadata"></item-abstract>
                                <item-uri [itemData]="item.metadata"></item-uri>
                                <item-collection [itemParent]="item.parentCollection"></item-collection>
                            </div>
                            <div class="col-xs-12 text-center"> <!--col-xs-12 is only here to ensure it gets the col padding-->
                                <a class="btn btn-default" [routerLink]="[item.component, {id: item.id}, 'FullItemView']">{{ 'item-view.show-full' | translate }}</a>
                                <a *ngIf="editing()" class="btn btn-default" (click)="exitEditMode()">{{ 'item-view.exit-edit-mode' | translate }}</a>
                            </div>
                        </div>
                    </div>
                </div>
              `
})
export class SimpleItemViewComponent implements OnDestroy { // uses OnInit for testing purposes.

    /**
     * The current item.
     */
    private item: Item;

    /**
     * 
     */
    private editingNotification: Notification;
    
    /**
     *
     */
    private subscriptions: Array<any>;

    /**
     *
     */
    constructor(private translate: TranslateService,
                private contextProvider: ContextProviderService,
                private notificationService: NotificationService) {
        
        this.subscriptions = new Array<any>();
        
        this.item = contextProvider.context;
        
        let csub = contextProvider.contextObservable.subscribe(currentContext => {
            this.item = currentContext;
        });
        
        this.subscriptions.push(csub);
        
        let esub = contextProvider.editingObservable.subscribe(editing => {
            if(editing) {
                if(this.editingNotification === undefined) {
                    this.editingNotification = new Notification('WARNING', translate.instant('edit.mode'));
                }
                this.notificationService.add('item', this.editingNotification);
            }
        });
        
        this.subscriptions.push(esub);
    }

    /**
     * Check if context provides an item.
     */
    private itemProvided(): boolean {
        return this.item && this.item.type == 'item';
    }

    /**
     * 
     */
    private editing(): boolean {
        return this.contextProvider.editing;
    }

    /**
     * 
     */
    private exitEditMode(): void {
        this.contextProvider.editing = false;
        this.notificationService.remove('item', this.editingNotification);
    }

    /**
     *
     */
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.exitEditMode();
    }

}

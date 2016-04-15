import {Component, Input} from 'angular2/core';


/**
 * Component for the collections of the simple-item-view.
 * When you click on the collection name, it has to redirect to the right collection.
 */
@Component({
    selector: 'view-element',
    inputs: ['header'],
    template:
            `
            <div id="simple-view-element">
                <h3 *ngIf="header">{{header}}</h3>
                <ng-content></ng-content>
            </div>
            `
})

export class ViewElementComponent {

}

﻿import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {DSpaceService} from './dspace/dspace.service';

@Component({
    selector: "dashboard",
    template: `
                <div>
                    <h2>Dashboard</h2>
                    <ul>
                        <li *ngFor="#topCommunity of dspaceService.directory | async" >
                            {{ topCommunity.name }}
                        </li>
                    </ul>
                </div>
              `
})
export class DashboardComponent {

    constructor(private dspaceService: DSpaceService) {
        dspaceService.loadDirectory();
    }

}

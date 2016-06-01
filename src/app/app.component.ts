﻿import { Component, OnInit, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";
import { CollapseDirective } from 'ng2-bootstrap/ng2-bootstrap';

import { AuthorizationService } from './dspace/authorization/services/authorization.service';
import { DSpaceHierarchyService } from './dspace/services/dspace-hierarchy.service';

import { BreadcrumbComponent } from './navigation/components/breadcrumb.component';
import { CollectionComponent } from './dspace/components/collection.component';
import { CollectionCreateComponent } from './dspace/components/collection-create.component';
import { CommunityComponent } from './dspace/components/community.component';
import { CommunityCreateComponent } from './dspace/components/community-create.component';
import { LogoutComponent } from './dspace/components/logout.component';
import { NotFoundComponent } from './dspace/components/notfound.component';

import { HomeComponent } from './home.component.ts';
import { ProfileComponent} from './profile.component.ts';
import { ItemComponent } from './dspace/components/item.component';
import { ItemCreateComponent } from './dspace/components/item-create.component';
import { LoginModalComponent } from './dspace/authorization/login/login-modal.component';
import { LoginFormComponent } from './dspace/authorization/login/login-form.component';
import { NotificationComponent } from './utilities/notification/notification.component';
import { RegistrationComponent } from './dspace/authorization/registration/registration.component';
import { SettingsComponent } from './settings.component';
import { SetupComponent } from './setup.component';

import { SidebarComponent } from './dspace/components/sidebar/sidebar.component';
import { NewsComponent } from './dspace/components/news.component';

import { User } from './dspace/models/user.model';

import { AppSidebarHelper } from './utilities/app-sidebar.helper';

/**
 * The main app component. Layout with navbar, breadcrumb, and router-outlet.
 * This component is server-side rendered and either replayed or hydrated on client side.
 * Also, defines the parent routes.
 */
@Component({
    selector: 'dspace',
    directives: [ ROUTER_DIRECTIVES,
                  CollapseDirective,
                  BreadcrumbComponent,
                  LoginModalComponent,
                  NotificationComponent,
                  SidebarComponent,
                  NewsComponent
                ],
    providers : [AppSidebarHelper],
    pipes: [ TranslatePipe ],
    template: `
                <nav class="navbar navbar-inverse">
                    <div class="container-fluid">
                        <div class="navbar-header">
                            <!-- When clicked toggle navCollapsed setting -->
                            <button type="button" class="navbar-toggle" (click)="navCollapsed = !navCollapsed">
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                            </button>
                            <a class="navbar-brand" [routerLink]="['Profile']">{{ 'header.repository-name' | translate }}</a>
                        </div>
                        <!-- Collapse this menu when navCollapse is true -->
                        <div [collapse]="navCollapsed" class="collapse navbar-collapse">
                            <ul class="nav navbar-nav">
                                <li><a [routerLink]="['/Home']">{{ 'header.dashboard' | translate }}</a></li>
                            </ul>
                            <ul class="nav navbar-nav navbar-right" *ngIf="!user">
                                <li><a [routerLink]="['/Register']"><span class="glyphicon glyphicon-user space-right"></span>{{ 'header.register' | translate }}</a></li>
                                <li><a (click)="login.openLoginModal()" class="clickable"><span class="glyphicon glyphicon-log-in space-right"></span>{{ 'header.login' | translate }}</a></li>
                            </ul>
                            <ul class="nav navbar-nav navbar-right" *ngIf="user">
                                <li><a [routerLink]="['Profile']"><span class="glyphicon glyphicon-user space-right"></span>{{ user.fullname }}</a></li>
                                <li><a (click)="logout()" class="clickable"><span class="glyphicon glyphicon-log-out space-right"></span>{{ 'header.logout' | translate }}</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <breadcrumb></breadcrumb>
                <div class="container">
                    <div class="col-md-4">
                        <sidebar></sidebar>
                    </div>
                    <div class="col-md-8">
                        <notification [channel]="channel"></notification>
                        <router-outlet></router-outlet>
                    </div>
                </div>

                <login-modal #login></login-modal>
              `
})
@RouteConfig([

        { path: "/profile", name: "Profile", component: ProfileComponent,useAsDefault: true  },
        { path: "/settings", name: "Settings", component: SettingsComponent },
        { path: "/setup", name: "Setup", component: SetupComponent },
        { path: "/login", name: "Login", component: LoginFormComponent },
        { path: "/register", name: "Register", component: RegistrationComponent },

        { path: "/", name: "Home", component: HomeComponent },
        { path: "/communities/:id", name: "Communities", component: CommunityComponent },
        { path: "/collections/:id", name: "Collections", component: CollectionComponent },
        { path: "/items/:id/...", name: "Items", component: ItemComponent },

        { path: "/create-community", name: "CommunityCreate", component: CommunityCreateComponent },
        { path: "/create-collection", name: "CollectionCreate", component: CollectionCreateComponent },
        { path: "/create-item", name: "ItemCreate", component: ItemCreateComponent },

        { path: "/logout", name: "Logout", component: LogoutComponent},

        { path: "/404", name: "E404", component: NotFoundComponent},
        { path: "/news", name: "News", component: NewsComponent},

        { path: '/**', redirectTo: [ 'Home' ] }
])
export class AppComponent implements OnInit {

    /**
     * Notification channel.
     */
    private channel: string = "app";

    /**
     * Logged in user.
     */
    private user: User;


    /**
     * Is navbar collapsed?
     * Default to true so that navbar is hidden by default when window is resized.
     */
    private navCollapsed: boolean = true;

    /**
     * @param dspace
     *      DSpaceHierarchyService is a singleton service to interact with the dspace hierarchy.
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param translate
     *      TranslateService
     * @param router
     *      Router is a singleton service provided by Angular2.
     * @param sidebarHelper
     *      SidebarHelper is a helper-class to inject the sidebar sections when the user visits this component
     */
     constructor(private dspace: DSpaceHierarchyService,
                private authorization: AuthorizationService,
                private translate: TranslateService,
                private router: Router,
                @Inject(AppSidebarHelper)  sidebarHelper : AppSidebarHelper) {

                    this.user = authorization.user;

                    authorization.userObservable.subscribe(user => {
                        this.user = user;
                    });

                    translate.setDefaultLang('en');
                    translate.use('en');
                    sidebarHelper.populateSidebar();
    }

    /**
     * Method provided by Angular2. Invoked after the constructor.
     */
    ngOnInit(){
        this.dspace.loadHierarchy();
    }

    /**
     * Logout.
     */
    private logout(): void {
        this.authorization.logout();
        this.router.navigate(['/Home']);
    }

}

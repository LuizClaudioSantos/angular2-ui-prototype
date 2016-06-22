﻿﻿import { Component, OnInit, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";
import { CollapseDirective } from 'ng2-bootstrap/ng2-bootstrap';

import { DSpaceHierarchyService } from './dspace/services/dspace-hierarchy.service';

import { BreadcrumbComponent } from './navigation/components/breadcrumb.component';
import { CollectionComponent } from './dspace/components/collection.component';
import { CollectionCreateComponent } from './dspace/components/collection-create.component';
import { CommunityComponent } from './dspace/components/community.component';
import { CommunityCreateComponent } from './dspace/components/community-create.component';
import { LogoutComponent } from './dspace/authorization/logout.component';
import { PageNotFoundComponent } from './dspace/components/pagenotfound.component';

import { HomeComponent } from './home.component.ts';
import { ProfileComponent} from './profile.component.ts';
import { ItemComponent } from './dspace/components/item.component';
import { ItemCreateComponent } from './dspace/components/item-create.component';
import { LoginFormComponent } from './dspace/authorization/login/login-form.component';
import { LoginModalComponent } from './dspace/authorization/login/login-modal.component';
import { NotificationComponent } from './utilities/notification/notification.component';
import { RegistrationComponent } from './dspace/authorization/registration/registration.component';
import { SettingsComponent } from './settings.component';
import { SetupComponent } from './setup.component';

import { SidebarComponent } from './dspace/components/sidebar/sidebar.component';
import { NewsComponent } from './dspace/components/news.component';

import { AppSidebarHelper } from './utilities/app-sidebar.helper';
import { AdminSidebarComponent } from './dspace/components/sidebar/admin-sidebar.component';
import { SidebarService } from "./utilities/services/sidebar.service";
import { ViewportService } from "./utilities/services/viewport.service";

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
                <!--TODO separate out header-->
                <div class="container-fluid">
                    <div class="row no-gutter">
                        <div [ngClass]="{'sidebar-open-sidebar':isSidebarVisible, 'sidebar-closed-sidebar':!isSidebarVisible}">
                            <sidebar></sidebar>
                        </div>
                        <div [ngClass]="{'sidebar-open-content':isSidebarVisible, 'sidebar-closed-content':!isSidebarVisible, 'sidebar-slider-animating':isSidebarAnimating}" class="sticky-footer-wrapper sidebar-slider">
                            <div class="sticky-footer-everything-else">
                                <header>
                                    <nav class="navbar navbar-inverse">
                                        <div class="container-fluid content-container-fluid">
                                            <button type="button" (click)="toggleSidebar()" class="sidebar-toggle-button navbar-left clearfix"><i class="ion-arrow-left-b sidebar-toggle-arrow-icon"></i><i class="ion-icon ion-navicon sidebar-toggle-hamburger-icon"></i></button>
                                            <div class="">
                                                <a class="navbar-brand" [routerLink]="['/Home']">{{
                                                    'header.repository-name' | translate }}</a>
                                            </div>
                                        </div>
                                    </nav>
                                </header>
                                <div class="fixed-header-spacer"></div>
                                <div class="container-fluid content-container-fluid">
                                    <breadcrumb></breadcrumb>
                                    <main>
                                        <notification [channel]="channel"></notification>
                                        <router-outlet></router-outlet>
                                    </main>
                                    <!--TODO separate out footer-->
                                    <footer>
                                        <div class="container-fluid content-container-fluid">
                                            <!-- <div class="row">
                                                <div class="col-sm-offset-4 col-lg-offset-3"> -->
                                                    <p>
                                                        <a href="http://www.dspace.org/">{{"footer.link.dspace" | translate}}</a>
                                                        {{ "footer.copyright" | translate }}
                                                        <a href="http://www.duraspace.org/">{{"footer.link.duraspace" | translate}}</a>
                                                    </p>
                                                <!-- </div>
                                            </div> -->
                                        </div>
                                    </footer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <login-modal></login-modal>
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

        { path: "/404", name: "404", component: PageNotFoundComponent},
        { path: "/news", name: "News", component: NewsComponent},

        { path: "/admin-sidebar", name:"AdminSidebar", component : AdminSidebarComponent},

        { path: '/**', redirectTo: [ '/404' ] }
])
export class AppComponent implements OnInit {

    /**
     * Notification channel.
     */
    private channel: string = "app";

    /**
     * Is the sidebar visible or not
     */
    isSidebarVisible: boolean;

    /**
     * Is the sidebar animating
     */
    isSidebarAnimating: boolean;

    /**
     * Is navbar collapsed?
     * Default to true so that navbar is hidden by default when window is resized.
     */
    private navCollapsed: boolean = true;

    /**
     * @param dspaceHierarchy
     *      DSpaceHierarchyService is a singleton service to interact with the dspace hierarchy.
     * @param translate
     *      TranslateService
     * @param router
     *      Router is a singleton service provided by Angular2.
     * @param sidebarService
     *      SidebarService is a singleton service that provides access to the content of the sidebar
     * @param sidebarHelper
     *      SidebarHelper is a helper-class to inject the sidebar sections when the user visits this component
     */
    constructor(private dspaceHierarchy: DSpaceHierarchyService,
                private translate: TranslateService,
                private router: Router,
                private sidebarService: SidebarService,
                @Inject(AppSidebarHelper) private sidebarHelper: AppSidebarHelper) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

    /**
     * Initialize the sidebar
     */
    private initSidebar(): void {
        this.isSidebarAnimating = false;
        this.isSidebarVisible = this.sidebarService.isSidebarVisible.getValue();

        //Subscribe to the visibility observable of the SidebarService to
        //detect when the sidebar should open and close
        this.sidebarService.isSidebarVisible.subscribe((isSidebarVisible: boolean) => {
            this.isSidebarAnimating = true;

            //I don't like this setTimeout but it's the only way I could ensure
            //the 'animating' css class is always set before the 'visible' class
            setTimeout(() => {
                this.isSidebarVisible = isSidebarVisible;
            }, 10);

            //This setTimeout was intended to be here. It removes the "animating" class after
            //the sidebar animation completes, to ensure that the elements don't animate in
            //response to other changes, like the resizing of the window for example
            //I would however like a way to share the duration between this file and the scss
            //Maybe something webpack can fix?
            setTimeout(() => {
                this.isSidebarAnimating = false;
            }, 350);
        });

        this.sidebarHelper.populateSidebar();
    }

    /**
     * Method provided by Angular2. Invoked after the constructor.
     */
    ngOnInit(){
        this.dspaceHierarchy.loadHierarchy();
        this.initSidebar();
    }

    /**
     * Show or hide the sidebar.
     */
    toggleSidebar() {
        this.sidebarService.toggleSidebarVisibility();
    }

}

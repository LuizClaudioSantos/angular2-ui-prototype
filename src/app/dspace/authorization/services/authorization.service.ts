import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs/Observable";

import { DSpaceService } from '../../services/dspace.service';
import { StorageService } from '../../../utilities/services/storage.service';

import { User } from '../../models/user.model';

/**
 * Authorization service used for authentication and authorization.
 */
@Injectable()
export class AuthorizationService {

    /**
     * Current logged in user.
     */
    private _user: User;

    /**
     * User subject.
     */
    userSubject : Subject<User>;

    /**
     * User observable.
     */
    userObservable: Observable<User>;

    /**
     * @param storageService
     *      StorageService is a singleton service to interact with the storage service.
     * @param dspaceService
     *      DSpaceService is a singleton service to interact with the dspace service.
     */
    constructor(@Inject(StorageService) private storageService: StorageService,
                private dspaceService: DSpaceService) {
        this.userSubject = new Subject<User>();
        this.userObservable = this.userSubject.asObservable();
        
        {
            let fullname = storageService.load('fullname');
            let email = storageService.load('email');
            let token = storageService.load('token');
            
            if(fullname && email && token) {
                this.user = new User({
                    fullname: fullname,
                    email: email,
                    token: token
                });
            }

        }
        
    }

    /**
     * Login user with email and password.
     *
     * @param email
     *      User email.
     * @param password
     *      User password.
     */
    login(email: string, password: string): Observable<Response> {

        let loginResponse: Observable<Response> = this.dspaceService.login(email, password);
        
        loginResponse.subscribe(response => {
            if(response.status == 200) {
                
            }
        },
        error => {
            console.log(error);
        });


        return loginResponse;
    }

    /**
     * 
     */
    status(token: string): Observable<Response> {

        let statusResponse: Observable<Response> = this.dspaceService.status(token);

        statusResponse.subscribe(response => {
            this.user = new User(response);

            {
                this.storageService.store('fullname', this.user.fullname);
                this.storageService.store('email', this.user.email);
                this.storageService.store('token', this.user.token);
            }

        },
        error => {
            console.log(error);
        });

        return statusResponse;
    }

    /**
     * Logout. Sets user to null. Perform other logout actions.
     */
    logout(): Observable<Response> {

        return Observable.create(observer => {

            // clear user and localStorage no matter the response from dspace REST API
            this.user = null;

            {
                this.storageService.remove('fullname');
                this.storageService.remove('email');
                this.storageService.remove('token');
            }

            let logoutResponse: Observable<Response> = null;
            
            if(this.user && this.user.token) {

                let token = this.user.token;
                
                logoutResponse = this.dspaceService.logout(token);
                
                logoutResponse.subscribe(response => {
                    if(response.status == 200) {
                        console.log("Successfully logged out.");
                        observer.complete();
                    }
                },
                error => {
                    console.error(error);
                    observer.complete();
                });
            }
            else {
                observer.complete();
            }

        });
    }

    /**
     *
     */
    isAuthenticated(): boolean {
        return this.user ? true : false;
    }

    /**
     * Sets the currently logged in user.
     *
     * @param user
     *      User whom is currently logged in.
     */
    set user(user: User) {
        this._user = user;
        this.userSubject.next(this._user);
    }

    /**
     * Returns the logged in user.
     */
    get user(): User {
        return this._user;
    }

}

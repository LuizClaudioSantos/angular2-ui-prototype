﻿import {Injectable} from 'angular2/core';

import {URLSearchParams} from 'angular2/http';

import {HttpService} from '../utilities/http.service';
import {Community} from './models/community.model';
import {Collection} from './models/collection.model';
import {Item} from './models/item.model';

/**
 * Injectable service to provide an interface with the DSpace REST API 
 * through the utility http service. The responses here are returned as
 * Observables and the content is mapped to a JSON object.
 *
 * It important to note that the methods in this service are referenced
 * with bracket notation combining fetch with a constant.
 * Such as: dspaceService['fetch' + dspaceKeys[type].METHOD]
 *
 * TODO: map the JSON content to an inheritence model
 */
@Injectable()
export class DSpaceService {

    /**
     * The DSpace REST API endpoint root
     */
    private REST: string;

    /**
     * The DSpace REST API URL
     */
    private url: string;

    /**
     * @param httpService 
     *      HttpService is a singleton service to provide basic xhr requests.
     */
    constructor(private httpService: HttpService) {
        this.REST = '/rest';
        this.url = 'http://localhost:5050';
    }

    /**
     * Method to fetch top communities for navigation purposes.
     */
    fetchTopCommunities() {
        //TODO: handle top community pagination
        var params = new URLSearchParams();
        params.append("limit", '200');
        params.append("offset", '0');
        return this.httpService.get({
            url: this.url + this.REST + '/communities/top-communities',
            search: params
        }).map(json => {
            let topCommunities = new Array<Community>();
            for(let communityJson of json) {
                topCommunities.push(new Community(communityJson));
            }
            console.log(topCommunities);
            return json;
        });
    }

    /**
     * Method to fetch subcommunities for navigation purposes.
     *
     * @param communityId
     *      The community id of which its subcommunities are to be fetched.
     */
    fetchCommunities(community) {
        var params = new URLSearchParams();
        params.append("limit", community.limit);
        params.append("offset", community.offset);
        return this.httpService.get({
            url: this.url + this.REST + '/communities/' + community.id + '/communities',
            search: params
        }).map(json => {
            let communities = new Array<Community>();
            for(let communityJson of json) {
                communities.push(new Community(communityJson));
            }
            console.log(communities);
            return json;
        });
    }

    /**
     * Method to fetch collections of a community for navigation purposes.
     *
     * @param communityId
     *      The community id of which its collections are to be fetched.
     */
    fetchCollections(community) {
        var params = new URLSearchParams();
        params.append("limit", community.limit);
        params.append("offset", community.offset);
        return this.httpService.get({
            url: this.url + this.REST + '/communities/' + community.id + '/collections',
            search: params
        }).map(json => {
            let collections = new Array<Collection>();
            for(let collectionJson of json) {
                collections.push(new Collection(collectionJson));
            }
            console.log(collections);
            return json;
        });
    }

    /**
     * Method to fetch items of a collection for navigation purposes. 
     *
     * @param collectionId
     *      The collection id of which its items are to be fetched.
     */
    fetchItems(collection) {
        var params = new URLSearchParams();
        params.append("limit", collection.limit);
        params.append("offset", collection.offset);
        return this.httpService.get({
            url: this.url + this.REST + '/collections/' + collection.id + '/items',
            search: params
        }).map(json => {
            let items = new Array<Item>();
            for(let itemJson of json) {
                items.push(new Item(itemJson));
            }
            console.log(items);
            return json;
        });
    }

    /**
     * Method to fetch details of a community. 
     *
     * @param id
     *      Community id of which to fetch its relationships and other details.
     */
    fetchCommunity(id) {
        return this.httpService.get({
            url: this.url + this.REST + '/communities/' + id + '?expand=parentCommunity,logo'
        }).map(json => {
            let community = new Community(json);
            console.log(community);
            return json;
        });
    }

    /**
     * Method to fetch details of a collection. 
     *
     * @param id
     *      Collection id of which to fetch its relationships and other details.
     */
    fetchCollection(id) {
        return this.httpService.get({
            url: this.url + this.REST + '/collections/' + id + '?expand=parentCommunity,logo'
        }).map(json => {
            let collection = new Collection(json);
            console.log(collection);
            return json;
        });
    }

    /**
     * Method to fetch details of an item. 
     *
     * @param id
     *      Item id of which to fetch its relationships and other details.
     */
    fetchItem(id) {
        return this.httpService.get({
            url: this.url + this.REST + '/items/' + id + '?expand=metadata,bitstreams,parentCollection'
        }).map(json => {
            let item = new Item(json);
            console.log(item);
            return json;
        });
    }

    /**
     * Method to login and recieve a token. 
     *
     * @param email
     *      DSpace user email/login
     * @param password
     *      DSpace user password
     */
    login(email, password) {
        this.httpService.post({
            url: this.url + this.REST + '/login',
            data: {
                email: email,
                password: password
            }
        }); 
    }

}

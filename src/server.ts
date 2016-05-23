import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import 'angular2-universal/polyfills';

import {
    provide,
    enableProdMode,
    expressEngine,
    REQUEST_URL,
    ORIGIN_URL,
    BASE_URL,
    NODE_ROUTER_PROVIDERS,
    NODE_LOCATION_PROVIDERS,
    NODE_HTTP_PROVIDERS,
    NODE_PRELOAD_CACHE_HTTP_PROVIDERS
} from 'angular2-universal';

import { Http } from '@angular/http';

import { TranslateService, TranslateLoader, TranslateStaticLoader } from "ng2-translate/ng2-translate";

// Config
import { GlobalConfig } from "../config";

// App Component
import { AppComponent } from './app/app.component';

// Server Components
import { TitleComponent } from './server/title.component';

// App Injectables
import { AuthorizationService } from './app/dspace/authorization/services/authorization.service';
import { BreadcrumbService } from './app/navigation/services/breadcrumb.service';
import { ContextProviderService } from './app/dspace/services/context-provider.service';
import { DSpaceConstantsService } from './app/dspace/services/dspace-constants.service';
import { DSpaceHierarchyService } from './app/dspace/services/dspace-hierarchy.service';
import { DSpaceService } from './app/dspace/services/dspace.service';
import { FormService } from './app/utilities/form/form.service';
import { GoogleScholarMetadataService } from './app/utilities/services/google-scholar-metadata.service.ts';
import { HttpService } from './app/utilities/services/http.service';
import { MetadataHelper } from './app/utilities/metadata.helper';
import { MetaTagService } from "./app/utilities/meta-tag/meta-tag.service";
import { NotificationService } from './app/utilities/notification/notification.service';
import { PaginationService } from './app/navigation/services/pagination.service';
import { PagingStoreService } from './app/dspace/services/paging-store.service';
import { StorageService } from './app/utilities/services/storage.service';

// Disable Angular 2's "development mode".
// See: https://angular.io/docs/ts/latest/api/core/enableProdMode-function.html
enableProdMode();

// Default to port 3000
var PORT = 3000;

// Create our server-side app with express (http://expressjs.com/)
// See also http://expressjs.com/en/4x/api.html#express
let app = express();

// Root directory of our app is the top level directory (i.e. [src])
let root = path.join(path.resolve(__dirname, '..'));

// Create an express "middleware" function which embeds CORS headers (http://enable-cors.org/)
// into any response we receive.
// TODO: Once DSpace's REST API returns CORS headers, this can be removed.
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-HTTP-Method-Override, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};
// Enable the above function in our express app
app.use(allowCrossDomain);

// Express view engine setup
// Use the "expressEngine" from Angular Universal for all HTML files,
// and configure it
app.engine('.html', expressEngine);
app.set('views', __dirname + '/app/view');
app.set('view engine', 'html');

app.use(bodyParser.json());

// Define location of Static Resources
// Map the /static URL path to the ./dist/server/static local directory
app.use('/static', express.static(path.join(root, 'dist', 'server', 'static'), {index:false}));
// Other static resources (e.g. our compiled app.bundle.js) can be found directly in ./dist
app.use(express.static(path.join(root, 'dist'), {index:false}));

// Port to use
app.set('port', PORT);

/**
 * Server-side Angular App setup
 * This defines all components which should be initialized on server-side
 * along with all necessary application data providers (e.g. services, etc).
 * (This function is similar in nature to the "bootstrap()" function called in our
 * `boot.ts` to initialize the client-side app.)
 **/
function ngApp(req, res) {
    let baseUrl = '/';
    let url = req.originalUrl || '/';
    res.render('index', {
        directives: [ AppComponent, TitleComponent ],
        platformProviders: [
            provide(ORIGIN_URL, {useValue: GlobalConfig.ui.baseURL}),
            provide(BASE_URL, {useValue: baseUrl}),
        ],
        providers: [
            NODE_ROUTER_PROVIDERS,
            NODE_LOCATION_PROVIDERS,
            NODE_PRELOAD_CACHE_HTTP_PROVIDERS,
            provide(REQUEST_URL, { useValue: url }),
            provide(TranslateLoader, {
                useFactory: (http: Http) => new TranslateStaticLoader(http, 'i18n', '.json'),
                deps: [ Http ]
            }),
            AuthorizationService,
            BreadcrumbService,
            ContextProviderService,
            DSpaceConstantsService,
            DSpaceHierarchyService,
            DSpaceService,
            FormService,
            GoogleScholarMetadataService,
            HttpService,
            MetadataHelper,
            MetaTagService,
            NotificationService,
            PaginationService,
            PagingStoreService,
            StorageService,
            TranslateService
        ],
        preboot: {
            appRoot: 'dspace',
            listen: 'attributes',
            replay: 'hydrate',
            //freeze: 'spinner',
            //pauseEvent: string,
            //resumeEvent: string,
            //completeEvent: string,
            //presets: any,
            focus: true,
            uglify: true,
            buffer: false,
            keyPress: true,
            buttonPress: true,
            debug: false
        },
        async: true
    });
}

// Specifies that all server-side paths should be routed to our ngApp function (see above)
app.get('/*', ngApp);

// Binds our express app the the specified port (i.e. starts it up) and logs when it is running
app.listen(PORT, () => {
    console.log("Running at port " + PORT);
});

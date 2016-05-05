import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS} from 'angular2/router'
import {KuzzleService} from "./shared/services/kuzzle/KuzzleService.service";

bootstrap(AppComponent,[ROUTER_PROVIDERS, KuzzleService]);

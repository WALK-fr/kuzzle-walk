import {bootstrap}    from '@angular/platform-browser-dynamic';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated'
import {KuzzleService} from "./shared/kuzzle/index";

bootstrap(AppComponent,[ROUTER_PROVIDERS, KuzzleService]);

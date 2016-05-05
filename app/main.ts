import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {KuzzleService} from "./shared/services/kuzzle/KuzzleService.service";

bootstrap(AppComponent,[KuzzleService]);

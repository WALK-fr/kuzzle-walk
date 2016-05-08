import {Component} from 'angular2/core';

@Component({
    selector: 'navbar',
    template: `
        <div class="row">
            <div class="col s12 m12 l6">
                <h3 id="tp-app-title">Travel Planner</h3>
            </div>
            <div class="col s12 m12 l6">
                <div class="row" id="tp-chat">
                    <div class="col s3 m2 l2 right">
                        <a id="tp-chat-all" class="btn-floating btn-large waves-effect waves-light orange">All</a>
                    </div>
                    <div class="col s3 m2 l2 right">
                        <img src="http://lorempixel.com/100/100/people/?random=1" alt="" class="circle">
                    </div>
                    <div class="col s3 m2 l2 right">
                        <img src="http://lorempixel.com/100/100/people/?random=2" alt="" class="circle">
                    </div>
                    <div class="col s3 m2 l2 right">
                        <img src="http://lorempixel.com/100/100/people/?random=3" alt="" class="circle">
                    </div>
                    <div class="col s3 m2 l2 right">
                        <img src="http://lorempixel.com/100/100/people/?random=4" alt="" class="circle">
                    </div>
                    <div class="col s3 m2 l2 right">
                        <img src="http://lorempixel.com/100/100/people/?random=5" alt="" class="circle">
                    </div>
                </div>
            </div>
        </div>
    `
})
export class NavbarComponent {

}

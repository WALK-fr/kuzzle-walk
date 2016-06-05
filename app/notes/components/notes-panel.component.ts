import {Component} from "@angular/core";

/**
 * This components represent the Three note columns component.
 */

@Component({
    selector: 'note-panel',
    template: `
        <section id="tp-all-notes-panel" class="row">
            <div class="col s12 m6 l4">
                <ng-content select="[note.firstCol]"></ng-content>
            </div>
            <div class="col s12 m6 l4">
                <ng-content select=".secondCol"></ng-content>
            </div>
            <div class="col s12 m6 l4">
                <ng-content select=".thirdCol"></ng-content>
            </div>
        </section>
    `,
})
export class NotePanelComponent{}

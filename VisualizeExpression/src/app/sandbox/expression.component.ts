import { Component,EventEmitter,Output, Input } from '@angular/core';
import { ExpressionService} from './expression.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'expression',
    template: 
    `
        <div class="expression_box">
            <div class="expression_actions">
                <p>{{counter1}}</p>
                <button (click)="add()">Insert New</button>
                <button>Clone</button>
                <button (click)="remove()">Remove</button>
                <button>Move up</button>
                <button>Move down</button>
            </div>
            <div class="expression_edit">
                <textarea rows="1">Insert expression here</textarea>
            </div>
            <div class="visualization_render">
                <img src="" alt="Syntax tree visualization" />
            </div>
            <div class="expression" id="expression_2"></div>
        </div>
    `,
    styleUrls:[`./expression.component.css`]
})

export class ExpressionComponent {
    static counter = 1;
    @Input()
    counter1: Number;

    constructor(private es: ExpressionService){
        this.counter1 = ExpressionComponent.counter++;
    }
    add(){
        this.es.addNew();
    }
    remove(){
        this.es.remove();
    }
}
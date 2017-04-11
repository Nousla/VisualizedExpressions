import { Component, EventEmitter, Output, Input, SimpleChanges, InjectionToken, Inject } from '@angular/core';
import { ExpressionService } from './expression.service';
import { Subscription } from 'rxjs/Subscription';
import { InternalData } from "../visualization/internal-data";
import { MathConverterService } from "../visualization/math-converter-service";
import { MathTextConverterService } from "../visualization/math-text-converter.service";
import ExpressionEventHandler from './expression-event-handler';
import OperationState from './operation-state';
import { InternalNode } from "../visualization/internal-node";

export let MATH_CONVERTER_SERVICE = new InjectionToken<MathConverterService>("MathConverterServiceToken");

@Component({
    selector: 'expression',
    templateUrl: './expression.component.html',
    styleUrls: [`./expression.component.css`],
    providers: [{ provide: MATH_CONVERTER_SERVICE, useClass: MathTextConverterService }, ExpressionEventHandler]
})

export class ExpressionComponent {
    @Input()
    counter: number;
    @Input()
    input: string;

    private data: InternalData;
    private config: Object;
    private timeout: number;

    private selectedNode: InternalNode;

    @Output()
    operationState: OperationState;

    constructor(private es: ExpressionService,
        @Inject(MATH_CONVERTER_SERVICE) private mcs: MathConverterService,
        private eventHandler: ExpressionEventHandler) {

        this.config = {
            width: 600,
            height: 200
        }

        this.input = "";
        this.operationState = OperationState.Closed;
    }

    ngOnInit(): void {
        this.onTimeOut();

        this.eventHandler.visualizationSelectNode$.subscribe(this.onNodeSelected);
    }

    onInputChange(e: Event): void {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.onTimeOut.bind(this), 200);
    }

    onTimeOut(): void {
        this.data = this.mcs.convert(this.input);
    }

    addExpression(): void {
        this.es.addNew();
    }

    removeExpression(): void {
        this.es.remove(this.counter);
    }

    cloneExpression(): void {
        this.es.clone({ counter: this.counter, input: this.input });
    }

    onNodeSelected(node: InternalNode): void {
        if (this.selectedNode === node) {
            this.selectedNode = null;
            this.operationState = OperationState.Closed;
        }
        else {
            this.selectedNode = node;
            this.operationState = OperationState.Selected;
            console.log(this.operationState);
        }
    }
}
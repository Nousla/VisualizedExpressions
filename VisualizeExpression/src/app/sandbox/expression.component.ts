import { Component, EventEmitter, Input, SimpleChanges, InjectionToken, Inject, Output, OnChanges } from '@angular/core';
import { ExpressionEventService } from './expression-event.service';
import { Subscription } from 'rxjs/Subscription';
import InternalData from "../visualization/internal-data";
import ExpressionEventHandler from './expression-event-handler';
import OperationState from './operation-state';
import { InternalNode } from "../visualization/internal-node";
import MATH_INPUT_SERVICE from "../visualization/math-input-service-token";
import MathInputService from "../visualization/math-input-service";
import ExpressionService from "./expression.service";

@Component({
    selector: 'expression',
    templateUrl: './expression.component.html',
    styleUrls: [`./expression.component.css`],
    providers: [ExpressionEventHandler, ExpressionService]
})

export class ExpressionComponent implements OnChanges {
    @Input()
    counter: number;
    @Input()
    input: string;

    private data: InternalData;
    private config: Object;
    private timeout: number;

    private selectedNode: InternalNode;
    private operationState: OperationState;

    constructor(private ees: ExpressionEventService,
        @Inject(MATH_INPUT_SERVICE) private mis: MathInputService,
        private es: ExpressionService,
        private eventHandler: ExpressionEventHandler) {

        this.input = "";
        this.updateOperationState();
    }

    ngOnInit(): void {
        this.onTimeOut();
        this.eventHandler.visualizationSelectNode$.subscribe(this.onNodeSelected.bind(this));
    }

    ngOnChanges(changes: SimpleChanges): void {
        var inputChanges = changes["input"];
        if (inputChanges) {
            if (inputChanges.currentValue !== "") {
                this.operationState = OperationState.Closed;
            }
            else {
                this.updateOperationState();
            }
        }
    }

    onInputChange(event: Event): void {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.onTimeOut.bind(this), 200);
        if (this.input !== "") {
            this.operationState = OperationState.Closed;
        }
        else {
            this.updateOperationState();
        }
    }

    onTimeOut(): void {
        this.data = this.mis.convert(this.input);
    }

    addExpression(): void {
        this.ees.addNew();
    }

    removeExpression(): void {
        this.ees.remove(this.counter);
    }

    cloneExpression(): void {
        this.ees.clone({ counter: this.counter, input: this.input });
    }

    onNodeSelected(node: InternalNode): void {
        this.selectedNode = (this.selectedNode === node) ? null : node;
        this.updateOperationState();
    }

    onOperationApplied(newNode: InternalNode): void {
        var math = this.es.applyChange(this.data, this.selectedNode, newNode);
        this.ees.add(<string>math);

        this.onOperationCanceled();
    }

    onOperationCanceled(): void {
        this.selectedNode = null;
        this.updateOperationState();
    }

    updateOperationState(): void {
        if (this.input !== "") {
            if (this.selectedNode) {
                this.operationState = OperationState.Added;
            }
            else {
                this.operationState = OperationState.Waiting;
            }
        }
        else {
            this.operationState = OperationState.Closed;
        }
    }
}
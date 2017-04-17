import { Component, EventEmitter, Input, SimpleChanges, InjectionToken, Inject, Output, OnChanges, OnInit, OnDestroy } from '@angular/core';
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

export class ExpressionComponent implements OnInit, OnDestroy, OnChanges {
    @Input()
    counter: number;
    @Input()
    input: string;

    private subscription: Subscription;

    private data: InternalData;
    private config: Object;

    private selectedNode: InternalNode;
    private operationState: OperationState;

    private timeout: number;
    private readonly TIMEOUT_LIMIT_MS: Number = 200;

    constructor(private ees: ExpressionEventService,
        @Inject(MATH_INPUT_SERVICE) private mis: MathInputService,
        private es: ExpressionService,
        private eventHandler: ExpressionEventHandler) {
            this.input = "";
            this.operationState = OperationState.Closed;
    }

    ngOnInit(): void {
        this.subscription = this.eventHandler.visualizationSelectNode$.subscribe(this.onNodeSelected.bind(this));
        this.updateOperationState();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        var inputChanges = changes["input"];
        if (inputChanges) {
            this.startInputTimeout();
        }
    }

    onInputChange(event: Event): void {
        this.startInputTimeout();
        this.selectedNode = null;
    }

    startInputTimeout(): void {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.onTimeOut.bind(this), this.TIMEOUT_LIMIT_MS);
    }

    onTimeOut(): void {
        this.data = this.mis.convert(this.input);
        this.updateOperationState();
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
        var expression = this.es.applyChange(this.data, this.selectedNode, newNode);
        this.ees.add(<string>expression);
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
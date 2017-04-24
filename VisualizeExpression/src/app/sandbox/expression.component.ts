import { Component, EventEmitter, Input, SimpleChanges, InjectionToken, Inject, Output, OnChanges, OnInit, OnDestroy, ViewChild, ElementRef, Renderer } from '@angular/core';
import { ExpressionEventService } from './expression-event.service';
import { Subscription } from 'rxjs/Subscription';
import InternalData from "../visualization/internal-data";
import ExpressionEventHandler from './expression-event-handler';
import OperationState from './operation-state';
import { InternalNode } from "../visualization/internal-node";
import MATH_INPUT_SERVICE from "../visualization/math-input-service-token";
import MathInputService from "../visualization/math-input-service";
import ExpressionService from "./expression.service";
import { ProblemSolvingService } from "./problemsolving.service"

@Component({
    selector: 'expression',
    templateUrl: './expression.component.html',
    styleUrls: [`./expression.component.css`],
    providers: [ExpressionEventHandler, ExpressionService, ProblemSolvingService]
})

export class ExpressionComponent implements OnInit, OnDestroy, OnChanges {
    @Input()
    counter: number;
    @Input()
    input: string;

    private subscription: Subscription;

    private data: InternalData;
    private config: Object;
    @ViewChild('banner')     
    banner: ElementRef;
    private testInputExpression = "4z+5=9";
    private testInputCorrectSol = 1;
    private testInputWrongSol = 2;

    private selectedNode: InternalNode;
    private operationState: OperationState;

    private timeout: number;
    private timeoutCheck: number;
    private readonly TIMEOUT_LIMIT_MS: Number = 200;
    private readonly TIMEOUT_LIMIT_MS_CHECK: Number = 1000;

    constructor(private ees: ExpressionEventService,
        @Inject(MATH_INPUT_SERVICE) private mis: MathInputService,
        private es: ExpressionService,
        private eventHandler: ExpressionEventHandler,
        private pss: ProblemSolvingService, private renderer: Renderer) {
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
        clearTimeout(this.timeoutCheck);
        this.timeout = setTimeout(this.onTimeOut.bind(this), this.TIMEOUT_LIMIT_MS);
        this.timeoutCheck = setTimeout(this.onTimeOutCheck.bind(this), this.TIMEOUT_LIMIT_MS_CHECK);
    }

    onTimeOut(): void {
        this.data = this.mis.convert(this.input);
        this.updateOperationState();
    }

    onTimeOutCheck(): void {
        var solution = this.pss.checkExpression(this.input, this.testInputCorrectSol, this.testInputWrongSol);
        if(solution == true) {
            this.renderer.setElementStyle(this.banner.nativeElement,'backgroundColor','green');
        }
        else {
            this.renderer.setElementStyle(this.banner.nativeElement,'backgroundColor','red');
        }
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
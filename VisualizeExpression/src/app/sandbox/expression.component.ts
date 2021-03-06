import { Component, EventEmitter, Input, SimpleChanges, InjectionToken, Inject, Output, OnChanges, OnInit, OnDestroy, ViewChild, ElementRef, Renderer } from '@angular/core';
import { ExpressionEventService } from './expression-event.service';
import { Subscription } from 'rxjs/Subscription';
import InternalData from "../visualization/internal-data";
import ExpressionEventHandler from './expression-event-handler';
import OperationState from './operation-state';
import { InternalNode } from "../visualization/internal-node";
import MATH_INPUT_SERVICE from "../visualization/math-input-service-token";
import MathInputService from "../visualization/math-input-service";
import { ProblemSolvingService } from "./problemsolving.service"
import { ImportExpressionService } from "./import-expression.service";
import { GuideProgressService } from "./guideprogress.service";
import { GuideTree, GuideNode } from "./guide-tree";
import { ButtonModule } from 'primeng/primeng';
import { MATH_OUTPUT_SERVICE } from "../visualization/math-output-service-token";
import { MathOutputService } from "../visualization/math-output-service";

@Component({
    selector: 'expression',
    templateUrl: './expression.component.html',
    styleUrls: [`./expression.component.css`],
    providers: [
        ExpressionEventHandler, 
        ProblemSolvingService, 
        GuideProgressService
    ]
})

export class ExpressionComponent implements OnInit, OnDestroy, OnChanges {
    @Input()
    counter: number;
    @Input()
    expressionInput: string;

    @ViewChild('banner')
    private banner: ElementRef;

    private subscription: Subscription;
    private data: InternalData;
    private config: Object;

    private selectedNode: InternalNode;
    private operationState: OperationState;

    private timeout: number;
    private timeoutCheck: number;
    private readonly TIMEOUT_LIMIT_MS: Number = 200;
    private readonly TIMEOUT_LIMIT_MS_CHECK: Number = 1000;

    private expressionEventHandler: ExpressionEventHandler;

    constructor(private ees: ExpressionEventService,
        @Inject(MATH_INPUT_SERVICE) private mis: MathInputService,
        @Inject(MATH_OUTPUT_SERVICE) private mus: MathOutputService,
        private eh: ExpressionEventHandler,
        private pss: ProblemSolvingService,
        private renderer: Renderer,
        private imp: ImportExpressionService,
        private gps: GuideProgressService
    ) {
        this.expressionInput = "";
        this.operationState = OperationState.Closed;
        this.expressionEventHandler = eh;
    }

    ngOnInit(): void {
        this.subscription = this.eh.visualizationSelectNode$.subscribe(this.onNodeSelected.bind(this));
        this.updateOperationState();
        if (this.expressionInput) {
            this.startInputTimeout();
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        var inputChanges = changes["input"];
        if (inputChanges && inputChanges.currentValue !== "") {
            this.startInputTimeout();
            this.selectedNode = null;
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
        this.data = this.mis.convert(this.expressionInput);
        this.updateOperationState();
    }

    onTimeOutCheck(): void {
        if (this.imp.importedSpecifier == "ps") {
            var psSolution = this.pss.checkExpression(this.expressionInput, this.imp.importedCorrectSolution, this.imp.importedWrongSolution);
            if (psSolution == true) {
                this.renderer.setElementStyle(this.banner.nativeElement, 'backgroundColor', 'green');

                var result = this.expressionInput.split('=');
                var leftside = result[0];
                var rightside = result[1];
                if (leftside == this.imp.importedCorrectSolution.toString() || rightside == this.imp.importedCorrectSolution.toString()) {
                    this.guideSuccess();
                }
            }
            else {
                this.renderer.setElementStyle(this.banner.nativeElement, 'backgroundColor', 'red');
            }
        } else if (this.imp.importedSpecifier == "gd") {
            var gdSolution = false;
            try { gdSolution = this.gps.checkGuide(this.expressionInput, this.imp.importedGuideTree); }
            catch (ex) {
                //Do nothing
            }
            if (gdSolution == true) {
                this.renderer.setElementStyle(this.banner.nativeElement, 'backgroundColor', 'green');
            }
            else {
                this.renderer.setElementStyle(this.banner.nativeElement, 'backgroundColor', 'lightblue');
            }
        }
    }

    addExpression(): void {
        this.ees.addNewExpression();
    }

    removeExpression(): void {
        this.ees.removeExpression(this.counter - 1);
    }

    cloneExpression(): void {
        this.ees.cloneExpression(this.expressionInput);
    }

    moveExpressionUp(): void {
        this.ees.moveExpressionUp(this.counter - 1);
    }

    moveExpressionDown(): void {
        this.ees.moveExpressionDown(this.counter - 1);
    }

    guideSuccess(): void {
        this.ees.guideSuccess();
    }

    onNodeSelected(node: InternalNode): void {
        this.selectedNode = (this.selectedNode === node) ? null : node;
        this.updateOperationState();
    }

    onOperationApplied(newData: InternalData): void {
        this.ees.addExpression(<string>this.mus.convert(newData));
        this.onOperationCanceled();
    }

    onOperationCanceled(): void {
        this.selectedNode = null;
        this.updateOperationState();
    }

    updateOperationState(): void {
        if (this.expressionInput !== "") {
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
import { Component, EventEmitter, Output, Input, SimpleChanges, InjectionToken, Inject } from '@angular/core';
import { ExpressionService } from './expression.service';
import { Subscription } from 'rxjs/Subscription';
import { InternalData } from "../visualization/internal-data";
import { MathConverterService } from "../visualization/math-converter-service";
import { MathTextConverterService } from "../visualization/math-text-converter.service";
import { ProblemSolvingService } from "./problemsolving.service"

export let MATH_CONVERTER_SERVICE = new InjectionToken<MathConverterService>("MathConverterServiceToken");

@Component({
    selector: 'expression',
    templateUrl: './expression.component.html',
    styleUrls: [`./expression.component.css`],
    providers: [{ provide: MATH_CONVERTER_SERVICE, useClass: MathTextConverterService, }, ProblemSolvingService]
})

export class ExpressionComponent {
    @Input()
    counter: number;
    @Input()
    input: string;
    private data: InternalData;
    private config: Object;
    private timeout: number;
    private testInputExpression = "4x+5=9";
    private testInputRightSol = 1;
    private testInputWrongSol = 2;
  

    constructor(private es: ExpressionService, @Inject(MATH_CONVERTER_SERVICE) private mcs: MathConverterService, private pss: ProblemSolvingService) {
      
        this.config = {
            width: 600,
            height: 200
        }
        this.input = "";
    }

    ngOnInit(): void {
        this.onTimeOut();
    }

    onInputChange(e: Event): void {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.onTimeOut.bind(this), 200);
    }

    onTimeOut(): void {
        this.data = this.mcs.convert(this.input);
        var solution = this.pss.checkExpression(this.testInputExpression, this.testInputRightSol, this.testInputWrongSol);
        console.log(solution);
        var banner = document.querySelector("#banner");
        if(solution == true) {
            banner.classList.remove("expression_actions");
            banner.classList.add("expression_actions_correct");
        }
        else {
            banner.classList.remove("expression_actions");
            banner.classList.add("expression_actions_wrong");
        }


    }

    add(): void{
        this.es.addNew();
    }

    remove(): void{
        this.es.remove(this.counter);
    }
    clone(): void{
        this.es.clone({counter: this.counter, input: this.input});
    }
}
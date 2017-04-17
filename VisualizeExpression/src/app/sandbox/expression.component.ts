import { Component, EventEmitter, Output, Input, SimpleChanges, InjectionToken, Inject, ViewChild, ElementRef, Renderer } from '@angular/core';
import { ExpressionService } from './expression.service';
import { Subscription } from 'rxjs/Subscription';
import { InternalData } from "../visualization/internal-data";
import { MathConverterService } from "../visualization/math-converter-service";
import { MathTextConverterService } from "../visualization/math-text-converter.service";
import { ProblemSolvingService } from "./problemsolving.service";
import { ImportExpressionService } from "./importexpression.service";

export let MATH_CONVERTER_SERVICE = new InjectionToken<MathConverterService>("MathConverterServiceToken");

@Component({
    selector: 'expression',
    templateUrl: './expression.component.html',
    styleUrls: [`./expression.component.css`],
    providers: [{ provide: MATH_CONVERTER_SERVICE, useClass: MathTextConverterService, }, ProblemSolvingService, ImportExpressionService]
})

export class ExpressionComponent {
    @Input()
    counter: number;
    @Input()
    input: string;
    private data: InternalData;
    private config: Object;
    private timeoutVisualization: number;
    private timeoutCheck: number;
    @ViewChild('banner')     
    banner: ElementRef;
  

    constructor(private es: ExpressionService, @Inject(MATH_CONVERTER_SERVICE) private mcs: MathConverterService, 
                private pss: ProblemSolvingService, private renderer: Renderer, private imp: ImportExpressionService) {
      
        this.config = {
            width: 600,
            height: 200
        }
        this.input = "";
    }

    ngOnInit(): void {
        this.onTimeOutVisualization();
    }

    onInputChange(e: Event): void {
        clearTimeout(this.timeoutVisualization);
        clearTimeout(this.timeoutCheck);
        this.timeoutVisualization = setTimeout(this.onTimeOutVisualization.bind(this), 200);
        this.timeoutCheck = setTimeout(this.onTimeOutCheck.bind(this), 1000);
    }

    onTimeOutVisualization(): void {
        this.data = this.mcs.convert(this.input);
    }
    onTimeOutCheck(): void {
        if(this.imp.importedSpecifier == "ps"){
            var solution = this.pss.checkExpression(this.imp.importedExpression, this.imp.importedCorrectSolution, this.imp.importedWrongSolution);
            if(solution == true) {
                this.renderer.setElementStyle(this.banner.nativeElement,'backgroundColor','green');
            }
            else {
                this.renderer.setElementStyle(this.banner.nativeElement,'backgroundColor','red');
            }
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
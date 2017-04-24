import { Component, EventEmitter, Output, Input, SimpleChanges, InjectionToken, Inject, ViewChild, ElementRef, Renderer } from '@angular/core';
import { ExpressionService } from './expression.service';
import { Subscription } from 'rxjs/Subscription';
import { InternalData } from "../visualization/internal-data";
import { MathConverterService } from "../visualization/math-converter-service";
import { MathTextConverterService } from "../visualization/math-text-converter.service";
import { ProblemSolvingService } from "./problemsolving.service";
import { ImportExpressionService } from "./importexpression.service";
import { GuideProgressService } from "./guideprogress.service";
import { GuideTree, GuideNode } from "./guide-tree";

export let MATH_CONVERTER_SERVICE = new InjectionToken<MathConverterService>("MathConverterServiceToken");

@Component({
    selector: 'expression',
    templateUrl: './expression.component.html',
    styleUrls: [`./expression.component.css`],
    providers: [{ provide: MATH_CONVERTER_SERVICE, useClass: MathTextConverterService, }, ProblemSolvingService,
    GuideProgressService]
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
    tree: GuideTree;
  

    constructor(private es: ExpressionService, @Inject(MATH_CONVERTER_SERVICE) private mcs: MathConverterService, 
                private pss: ProblemSolvingService, private renderer: Renderer, private imp: ImportExpressionService,
                private gps: GuideProgressService) {
        this.tree = new GuideTree();
        var node = this.tree.rootNode = new GuideNode();
        node.expression = "4x+5=9";
        this.tree.path = [node];
        this.tree.activePath = -1;

      
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
            var psSolution = this.pss.checkExpression(this.input, this.imp.importedCorrectSolution, this.imp.importedWrongSolution);
            if(psSolution == true) {
                this.renderer.setElementStyle(this.banner.nativeElement,'backgroundColor','green');
                var result = this.input.split('=');
                var leftside = result[0];
                var rightside = result[1];
                if(leftside && rightside == this.imp.importedCorrectSolution.toString()){
                    this.guideSuccess();
                }
            }
            else {
                this.renderer.setElementStyle(this.banner.nativeElement,'backgroundColor','red');
            }
        }else if(this.imp.importedSpecifier == "gd"){
            var gdSolution = this.gps.checkGuide(this.input, this.tree);
            if(gdSolution == true) {
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
    guideSuccess(): void {
        this.es.guideSuccess();
    }
}
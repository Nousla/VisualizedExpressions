import { Component, EventEmitter, Output, Input, SimpleChanges, InjectionToken, Inject } from '@angular/core';
import { ExpressionService } from './expression.service';
import { Subscription } from 'rxjs/Subscription';
import { InternalData } from "../visualization/internal-data";
import { MathConverterService } from "../visualization/math-converter-service";
import { MathTextConverterService } from "../visualization/math-text-converter.service";

export let MATH_CONVERTER_SERVICE = new InjectionToken<MathConverterService>("MathConverterServiceToken");

@Component({
    selector: 'expression',
    templateUrl: './expression.component.html',
    styleUrls: [`./expression.component.css`],
    providers: [{ provide: MATH_CONVERTER_SERVICE, useClass: MathTextConverterService }]
})

export class ExpressionComponent {
    @Input()
    counter: number;
    @Input()
    input: string;
    private data: InternalData;
    private config: Object;
    private timeout: number;

    constructor(private es: ExpressionService, @Inject(MATH_CONVERTER_SERVICE) private mcs: MathConverterService) {
      
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
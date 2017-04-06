import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { ExpressionComponent } from './expression.component';
import { ExpressionService } from './expression.service';
import { Subscription } from 'rxjs/Subscription';
import { MathTextConverterService } from "../visualization/math-text-converter.service";

@Component({
  selector: 'sandbox',
  templateUrl: './sandbox.html',
  styleUrls: ['./sandbox.css'],
  providers: [ExpressionService]
})
export class SandboxComponent {
  @ViewChild("submitted_expression_box", { read: ViewContainerRef })
  container: ViewContainerRef;
  subscription: Subscription;

  constructor(private resolver: ComponentFactoryResolver, private expressionService: ExpressionService) {
    this.subscription = expressionService.expressionNew$.subscribe(this.onAddNewExpression.bind(this));
  }

  ngOnInit() {
    var factory = this.resolver.resolveComponentFactory(ExpressionComponent);
    this.container.createComponent(factory);

    var mcs = new MathTextConverterService();
    console.log(mcs.convert("5 + 4 - 7"));
  }

  onAddNewExpression() {
    var factory = this.resolver.resolveComponentFactory(ExpressionComponent);
    this.container.createComponent(factory);
  }

}
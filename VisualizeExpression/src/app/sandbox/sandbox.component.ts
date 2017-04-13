import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';
import { ExpressionComponent } from './expression.component';
import { ExpressionEventService } from './expression-event.service';
import { Subscription } from 'rxjs/Subscription';
import { MathTextConverterService } from "../visualization/math-text-converter.service";
import { InternalData } from "../visualization/internal-data";

@Component({
  selector: 'sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css'],
  providers: [ExpressionEventService]
})
export class SandboxComponent {
  @ViewChild("submitted_expression_box", { read: ViewContainerRef })
  container: ViewContainerRef;
  subscription: Subscription;
  public listOfExpressions:ComponentRef<ExpressionComponent>[];
  

  constructor(private resolver: ComponentFactoryResolver, private ees: ExpressionEventService) {
      this.subscription = ees.expressionAddNew$.subscribe(this.onAddNewExpression.bind(this));
      this.subscription = ees.expressionAdd$.subscribe(this.onAddExpression.bind(this));      
      this.subscription = ees.expresionRemove$.subscribe(this.onRemoveExpression.bind(this));
      this.subscription = ees.expressionClone$.subscribe(this.onCloneExpression.bind(this));
      this.listOfExpressions = [];
  }

  addNewExpression(): ComponentRef<ExpressionComponent> {
    var factory = this.resolver.resolveComponentFactory(ExpressionComponent);
    var expression = this.container.createComponent(factory);
    this.listOfExpressions.push(expression);
    (<ExpressionComponent>expression.instance).counter = this.listOfExpressions.length;
    return expression;
  }

  ngOnInit(): void {
    this.addNewExpression();
  }

  onAddNewExpression(): void {
    this.addNewExpression();
  }

  onAddExpression(): void {
    this.addNewExpression();
  }

  onRemoveExpression(index: number): void {
    if(index-1 > -1) {
    var element = this.listOfExpressions[index-1];
    element.destroy();
      this.listOfExpressions.splice(index-1, 1);
      for(var i = index-1; i < this.listOfExpressions.length; i++) {
        var tempEl = this.listOfExpressions[i];
        (<ExpressionComponent>tempEl.instance).counter = i+1;
      }
      if(this.listOfExpressions.length == 0) {
        this.addNewExpression();
      }
    }
  }
   
  onCloneExpression( expression: Object): void {
    var element = this.listOfExpressions[expression["counter"]-1];
    var clone = this.addNewExpression();
    (<ExpressionComponent>clone.instance).input = expression["input"];
  }
}

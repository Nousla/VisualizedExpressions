import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';
import { ExpressionComponent } from './expression.component';
import { ExpressionService } from './expression.service';
import { Subscription } from 'rxjs/Subscription';
import { MathTextConverterService } from "../visualization/math-text-converter.service";
import { InternalData } from "../visualization/internal-data";

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
  public listOfExpressions:ComponentRef<ExpressionComponent>[];
  

  constructor(private resolver: ComponentFactoryResolver, private expressionService: ExpressionService) {
    
      this.subscription = expressionService.expressionNew$.subscribe(this.onAddNewExpression.bind(this));
      this.subscription = expressionService.expresionRemove$.subscribe(this.onRemoveExpression.bind(this));
      this.listOfExpressions = [];
  }

  addNewExpression(){
    var factory = this.resolver.resolveComponentFactory(ExpressionComponent);
    var expression = this.container.createComponent(factory);
    this.listOfExpressions.push(expression);
    (<ExpressionComponent>expression.instance).counter = this.listOfExpressions.length;
  }

  ngOnInit() {
    this.addNewExpression();
  }

  onAddNewExpression() {
    this.addNewExpression();
  }

  onRemoveExpression(index: number) {
    if(index-1 > -1){
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

}

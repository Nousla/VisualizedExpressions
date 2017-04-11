import { Component, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { ExpressionComponent } from './expression.component';
import { ExpressionService } from './expression.service';
import { Subscription } from 'rxjs/Subscription';
import { MathTextConverterService } from "../visualization/math-text-converter.service";
import { InternalData } from "../visualization/internal-data";
import { StandardService } from "./standard.service"

@Component({
  selector: 'sandbox',
  templateUrl: './sandbox.html',
  styleUrls: ['./sandbox.css'],
  providers: [ExpressionService, StandardService]
})
export class SandboxComponent {
  subscription: Subscription;
  listOfExpressions:string[];

  constructor(private resolver: ComponentFactoryResolver, private expressionService: ExpressionService, private standardService: StandardService) {
    
      this.subscription = expressionService.expressionNew$.subscribe(this.onAddNewExpression.bind(this));
      this.subscription = expressionService.expresionRemove$.subscribe(this.onRemoveExpression.bind(this));
      this.subscription = expressionService.expressionClone$.subscribe(this.onCloneExpression.bind(this));
      this.listOfExpressions = [];
  }

  ngOnInit() {
    this.standardService.addEmptyExpression();
    this.listOfExpressions = this.standardService.listOfExpressions;
  }

  onAddNewExpression() {
    this.standardService.addEmptyExpression();
    this.listOfExpressions = this.standardService.listOfExpressions;

  }

  onRemoveExpression(index: number) {
    this.standardService.removeExpression(index);
    this.listOfExpressions = this.standardService.listOfExpressions;
    console.log(this.listOfExpressions);

  }
   
  onCloneExpression( expression: Object) {
    this.standardService.cloneExpression(expression);
    this.listOfExpressions = this.standardService.listOfExpressions;
  }


}

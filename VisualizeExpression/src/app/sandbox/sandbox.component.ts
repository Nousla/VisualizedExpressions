import { Component, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { ExpressionComponent } from './expression.component';
import { ExpressionEventService } from './expression-event.service';
import { Subscription } from 'rxjs/Subscription';
import { InternalData } from "../visualization/internal-data";
import { StandardService } from "./standard.service"
import MATH_INPUT_SERVICE from "../visualization/math-input-service-token";
import MATH_OUTPUT_SERVICE from "../visualization/math-output-service-token";
import MathTextInputService from "../visualization/math-text-input.service";
import MathTextOutputService from "../visualization/math-text-output.service";

@Component({
  selector: 'sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css'],
  providers: [
    ExpressionEventService,
    { provide: MATH_INPUT_SERVICE, useClass: MathTextInputService },
    { provide: MATH_OUTPUT_SERVICE, useClass: MathTextOutputService },
    StandardService
  ]
})

export class SandboxComponent {
  subscription: Subscription;
  listOfExpressions:string[];


  constructor(private resolver: ComponentFactoryResolver, private ees: ExpressionEventService, private standardService: StandardService) {
    this.subscription = ees.expressionAddNew$.subscribe(this.onAddNewExpression.bind(this));
    this.subscription = ees.expressionAdd$.subscribe(this.onAddNewExpression.bind(this));
    this.subscription = ees.expresionRemove$.subscribe(this.onRemoveExpression.bind(this));
    this.subscription = ees.expressionClone$.subscribe(this.onCloneExpression.bind(this));
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

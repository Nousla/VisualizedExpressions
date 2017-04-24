import { Component, ComponentFactoryResolver, ComponentFactory, ViewChild } from '@angular/core';
import { ExpressionComponent } from './expression.component';
import { ExpressionEventService } from './expression-event.service';
import { Subscription } from 'rxjs/Subscription';
import { InternalData } from "../visualization/internal-data";
import { StandardService } from "./standard.service"
import { ImportExpressionService } from "./importexpression.service"
import { ModalSuccessComponent } from "./modal-success.component";
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
    StandardService, ImportExpressionService
  ]
})

export class SandboxComponent {
  subscription: Subscription;
  listOfExpressions: string[];
  @ViewChild(ModalSuccessComponent)
  mod: ModalSuccessComponent;

  constructor(private resolver: ComponentFactoryResolver, private ees: ExpressionEventService, private standardService: StandardService,
    private imp: ImportExpressionService) {
    this.subscription = ees.expressionAddNew$.subscribe(this.onAddNewExpression.bind(this));
    this.subscription = ees.expressionAdd$.subscribe(this.onAddNewExpression.bind(this));
    this.subscription = ees.expresionRemove$.subscribe(this.onRemoveExpression.bind(this));
    this.subscription = ees.expressionClone$.subscribe(this.onCloneExpression.bind(this));
    this.subscription = ees.expressionGuideSuccess$.subscribe(this.onGuideSuccess.bind(this));
    this.listOfExpressions = [];
  }

  ngOnInit() {
    if (this.imp.importedExpression) {
      this.standardService.addNewExpression(this.imp.importedExpression);
      this.listOfExpressions = this.standardService.listOfExpressions;
    }
    else {
      this.standardService.addEmptyExpression();
      this.listOfExpressions = this.standardService.listOfExpressions;
    }
  }

  onAddNewExpression() {
    this.standardService.addEmptyExpression();
    this.listOfExpressions = this.standardService.listOfExpressions;
  }

  onRemoveExpression(index: number) {
    this.standardService.removeExpression(index);
    this.listOfExpressions = this.standardService.listOfExpressions;

  }

  onCloneExpression(expression: Object) {
    this.standardService.cloneExpression(expression);
    this.listOfExpressions = this.standardService.listOfExpressions;
  }

  onGuideSuccess() {
    this.mod.showDialog();
  }
}
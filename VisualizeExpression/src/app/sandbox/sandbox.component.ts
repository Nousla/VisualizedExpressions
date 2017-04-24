import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';
import { ExpressionComponent } from './expression.component';
import { ExpressionEventService, ExpressionChangeState } from './expression-event.service';
import { Subscription } from 'rxjs/Subscription';
import { InternalData } from "../visualization/internal-data";
import MATH_INPUT_SERVICE from "../visualization/math-input-service-token";
import MATH_OUTPUT_SERVICE from "../visualization/math-output-service-token";
import MathTextInputService from "../visualization/math-text-input.service";
import MathTextOutputService from "../visualization/math-text-output.service";
import { StandardService } from "./standard.service";

@Component({
  selector: 'sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css'],
  providers: [
    ExpressionEventService,
    StandardService,
    { provide: MATH_INPUT_SERVICE, useClass: MathTextInputService },
    { provide: MATH_OUTPUT_SERVICE, useClass: MathTextOutputService }
  ]
})

export class SandboxComponent {
  @ViewChild("submitted_expression_box", { read: ViewContainerRef })
  private container: ViewContainerRef;

  private expressionComponents: ComponentRef<ExpressionComponent>[];
  private subscription: Subscription;

  constructor(private resolver: ComponentFactoryResolver, private ees: ExpressionEventService,
    private standardService: StandardService) {
    this.subscription = ees.expressionAddNew$.subscribe(this.onAddNewExpression.bind(this));
    this.subscription = ees.expressionAdd$.subscribe(this.onAddExpression.bind(this));
    this.subscription = ees.expresionRemove$.subscribe(this.onRemoveExpression.bind(this));
    this.subscription = ees.expressionClone$.subscribe(this.onCloneExpression.bind(this));
    this.subscription = ees.expressionMoveUp.subscribe(this.onMoveUpExpression.bind(this));
    this.subscription = ees.expressionMoveDown.subscribe(this.onMoveDownExpression.bind(this));
    this.expressionComponents = [];
  }

  ngOnInit(): void {
    this.addEmptyExpression();
  }

  onAddNewExpression(): void {
    this.addEmptyExpression();
  }

  onAddExpression(input: string): void {
    this.addExpression(input);
  }

  onRemoveExpression(index: number): void {
    this.removeExpression(index);
  }

  onCloneExpression(input: string): void {
    this.addExpression(input);
  }

  onMoveUpExpression(index: number): void {
    if (index > 0) {
      this.swapExpressions(index, index - 1);
    }
  }

  onMoveDownExpression(index: number): void {
    if (index < this.expressionComponents.length - 1) {
      this.swapExpressions(index, index + 1);
    }
  }

  private addEmptyExpression(): void {
    this.createExpressionComponent()
  }

  private addExpression(input: string): void {
    var expressionComponent = this.createExpressionComponent();
    this.getExpressionInstance(expressionComponent).input = input;
  }

  private removeExpression(index: number) {
    if (index >= 0 && index <= this.container.length - 1) {
      this.container.remove(index);

      this.expressionComponents.splice(index, 1);

      for (var i = index; i < this.container.length; i++) {
        var expressionComponent = this.expressionComponents[i];
        this.getExpressionInstance(expressionComponent).counter = i + 1;
      }

      if (this.container.length == 0) {
        this.addEmptyExpression();
      }
    }
  }

  private swapExpressions(sourceIndex: number, targetIndex: number): void {
    var sourceElement = this.expressionComponents[sourceIndex];
    if (!sourceElement) {
      return;
    }

    var targetElement = this.expressionComponents[targetIndex];
    if (!targetElement) {
      return;
    }

    this.expressionComponents[sourceIndex] = targetElement;
    this.expressionComponents[targetIndex] = sourceElement;

    this.container.move(this.container.get(sourceIndex), targetIndex);

    var sourceInstance = this.getExpressionInstance(sourceElement);
    var targetInstance = this.getExpressionInstance(targetElement);
    var sourceCounter = sourceInstance.counter;

    sourceInstance.counter = targetInstance.counter;
    targetInstance.counter = sourceCounter;
  }

  private createExpressionComponent(): ComponentRef<ExpressionComponent> {
    var factory = this.resolver.resolveComponentFactory(ExpressionComponent);
    var expressionComponent = this.container.createComponent(factory);
    this.expressionComponents.push(expressionComponent);
    this.getExpressionInstance(expressionComponent).counter = this.expressionComponents.length;
    return expressionComponent;
  }

  private getExpressionInstance(componentRef: ComponentRef<ExpressionComponent>): ExpressionComponent {
    return (<ExpressionComponent>componentRef.instance);
  }
}

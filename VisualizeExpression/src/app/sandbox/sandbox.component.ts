import { Component, ComponentFactoryResolver, ComponentFactory, ViewChild, ViewContainerRef, ComponentRef, Inject, InjectionToken } from '@angular/core';
import { ExpressionComponent } from './expression.component';
import { ExpressionEventService } from './expression-event.service';
import { Subscription } from 'rxjs/Subscription';
import { InternalData } from "../visualization/internal-data";
import { ImportExpressionService } from "./import-expression.service"
import { ModalSuccessComponent } from "./modal-success.component";
import MATH_INPUT_SERVICE from "../visualization/math-input-service-token";
import MATH_OUTPUT_SERVICE from "../visualization/math-output-service-token";
import MathTextInputService from "../visualization/math-text-input.service";
import MathTextOutputService from "../visualization/math-text-output.service";
import { GuideTreeService } from "./guide-tree.service";
import { MathInputService } from "../visualization/math-input-service";
import SandboxMode from "./sandbox-mode";
import { MirrorMountainService } from "../visualization/mirror-mountain/mirror-mountain.service";
import { VISUALIZATION_SERVICE } from "../visualization/visualization-injection-token";
import { SandboxTextService } from "./sandbox-text.service";
import { ExpressionOperationTextService } from "./expression-operation-text.service";
import { EncodeService } from "../encode.service";
import { ExpressionOperationService } from "./expression-operation.service";

@Component({
  selector: 'sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css'],
  providers: [
    ExpressionEventService,
    { provide: MATH_INPUT_SERVICE, useClass: MathTextInputService },
    { provide: MATH_OUTPUT_SERVICE, useClass: MathTextOutputService },
    ImportExpressionService, GuideTreeService, SandboxTextService,
    { provide: VISUALIZATION_SERVICE, useClass: MirrorMountainService },
    ExpressionOperationTextService, EncodeService, ExpressionOperationService
  ]
})

export class SandboxComponent {

  @ViewChild("expressionBox", { read: ViewContainerRef })
  private container: ViewContainerRef;
  @ViewChild(ModalSuccessComponent)
  private successModal: ModalSuccessComponent;

  private expressionComponents: ComponentRef<ExpressionComponent>[];
  private subscription: Subscription;

  private mode: SandboxMode;
  private importedExpressionData: InternalData;

  private textService: SandboxTextService;

  constructor(private resolver: ComponentFactoryResolver,
    private ees: ExpressionEventService,
    private imp: ImportExpressionService,
    private sts: SandboxTextService,
    @Inject(MATH_INPUT_SERVICE) private mis: MathInputService) {
    this.subscription = ees.expressionAddNew$.subscribe(this.onAddNewExpression.bind(this));
    this.subscription = ees.expressionAdd$.subscribe(this.onAddExpression.bind(this));
    this.subscription = ees.expresionRemove$.subscribe(this.onRemoveExpression.bind(this));
    this.subscription = ees.expressionClone$.subscribe(this.onCloneExpression.bind(this));
    this.subscription = ees.expressionMoveUp.subscribe(this.onMoveUpExpression.bind(this));
    this.subscription = ees.expressionMoveDown.subscribe(this.onMoveDownExpression.bind(this));
    this.subscription = ees.expressionGuideSuccess$.subscribe(this.onGuideSuccess.bind(this));
    this.expressionComponents = [];

    this.mode = SandboxMode.Standard;
    this.importedExpressionData = this.getImportedExpressionData();
    this.textService = sts;
  }

  ngOnInit(): void {
    if (this.imp.importedExpression) {
      this.addExpression(this.imp.importedExpression);
    } else if (this.imp.importedGuideTree) {
      this.addExpression(this.imp.importedGuideTree.rootNode.expression);
    } else {
      this.addEmptyExpression();
    }

    if (this.imp.importedSpecifier === "ps") {
      this.mode = SandboxMode.ProblemSolving;
    }
    else if (this.imp.importedSpecifier === "gd") {
      this.mode = SandboxMode.Guide;
    }
    else {
      this.mode = SandboxMode.Standard;
    }
  }

  private onAddNewExpression(): void {
    this.addEmptyExpression();
  }

  private onAddExpression(input: string): void {
    this.addExpression(input);
  }

  private onRemoveExpression(index: number): void {
    this.removeExpression(index);
  }

  private onCloneExpression(input: string): void {
    this.addExpression(input);
  }

  private onMoveUpExpression(index: number): void {
    if (index > 0) {
      this.swapExpressions(index, index - 1);
    }
  }

  private onMoveDownExpression(index: number): void {
    if (index < this.expressionComponents.length - 1) {
      this.swapExpressions(index, index + 1);
    }
  }

  private onGuideSuccess() {
    this.successModal.showDialog();
  }

  private addEmptyExpression(): void {
    this.createExpressionComponent()
  }

  private addExpression(input: string): void {
    var expressionComponent = this.createExpressionComponent();
    this.getExpressionInstance(expressionComponent).expressionInput = input;
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

  private getImportedExpression(): string {
    var importedTreeExpression = this.getImportedTreeExpression();
    if(importedTreeExpression) {
      return importedTreeExpression;
    }
    
    return this.imp.importedExpression;
  }

  private getImportedExpressionData(): InternalData {
    var importedExpression = this.getImportedExpression();
    if (!importedExpression || importedExpression === "") {
      return null;
    }

    return this.mis.convert(importedExpression);
  }

  private getImportedTreeExpression(): string {
    return this.imp.importedGuideTree ? this.imp.importedGuideTree.rootNode.expression : null;
  }

  private getModeTitle(): string {
    switch (this.mode) {
      case SandboxMode.Guide: return this.sts.getModeGuideText();
      case SandboxMode.ProblemSolving: return this.sts.getModeProblemSolvingText();
      case SandboxMode.Standard: return this.sts.getModeStandardText();
      default: return this.sts.getModeNotFoundText();
    }
  }

  private getModeDescription(): string {
    switch (this.mode) {
      case SandboxMode.Guide: return this.sts.getGuideDescriptionText();
      case SandboxMode.ProblemSolving: return this.sts.getProblemSolvingDescriptionText();
      case SandboxMode.Standard: return this.sts.getStandardDescriptionText();
      default: return this.sts.getModeNotFoundText();
    }
  }

  private getImportedDescription(): string {
    return this.imp.importedDescription;
  }
}


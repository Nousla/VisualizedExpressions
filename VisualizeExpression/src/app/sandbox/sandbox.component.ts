import { Component, ComponentFactoryResolver, ComponentFactory, ViewChild } from '@angular/core';
import { ExpressionComponent } from './expression.component';
import { ExpressionService } from './expression.service';
import { Subscription } from 'rxjs/Subscription';
import { MathTextConverterService } from "../visualization/math-text-converter.service";
import { InternalData } from "../visualization/internal-data";
import { StandardService } from "./standard.service"
import { ImportExpressionService} from "./importexpression.service"
import { ModalSuccessComponent } from "./modal-success.component";

@Component({
  selector: 'sandbox',
  templateUrl: './sandbox.html',
  styleUrls: ['./sandbox.css'],
  providers: [ExpressionService, StandardService, ImportExpressionService]
})
export class SandboxComponent {
  subscription: Subscription;
  listOfExpressions:string[];
  @ViewChild(ModalSuccessComponent)
  mod: ModalSuccessComponent;

  constructor(private resolver: ComponentFactoryResolver, private expressionService: ExpressionService, private standardService: StandardService,
              private imp: ImportExpressionService) {
    
      this.subscription = expressionService.expressionNew$.subscribe(this.onAddNewExpression.bind(this));
      this.subscription = expressionService.expresionRemove$.subscribe(this.onRemoveExpression.bind(this));
      this.subscription = expressionService.expressionClone$.subscribe(this.onCloneExpression.bind(this));
      this.subscription = expressionService.expressionGuideSuccess$.subscribe(this.onGuideSuccess.bind(this));
      this.listOfExpressions = [];
  }

  ngOnInit() {
    if(this.imp.importedExpression){
      this.standardService.addNewExpression(this.imp.importedExpression);
      this.listOfExpressions = this.standardService.listOfExpressions;
    }
    else{
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
   
  onCloneExpression( expression: Object) {
    this.standardService.cloneExpression(expression);
    this.listOfExpressions = this.standardService.listOfExpressions;
  }

  onGuideSuccess(){
    this.mod.showDialog();
  }


}

import { Injectable, Component } from '@angular/core';
import { ExpressionComponent } from './expression.component';
import { ExpressionService } from './expression.service';


@Injectable()
export class StandardService {
  private _listOfExpressions:string[];
  

  constructor() {
          this._listOfExpressions = [];
  }
    
  addNewExpression(expression: string): void{
        this._listOfExpressions.push(expression);
  }

  addEmptyExpression(): void {
      this._listOfExpressions.push("");
  }

  get listOfExpressions(){
      return this._listOfExpressions;
  }

  removeExpression(index: number){
    if(index-1 > -1) {
      this.listOfExpressions.splice(index-1, 1);
      if(this.listOfExpressions.length == 0) {
        this.addEmptyExpression();
      }
    }
  }

  cloneExpression(expression: Object){
    this.addNewExpression(expression["input"]);
  }
}
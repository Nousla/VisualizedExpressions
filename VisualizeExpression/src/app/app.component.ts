import { Component } from '@angular/core';
import { InternalData } from "./internal-data";

@Component({
  selector: 'app',
  template: `<h1>Test</h1>
             <visualization [data]=graphData></visualization>`,
})
export class AppComponent {
  private graphData = new InternalData([
    {
      "name": "=",
      "type": "equality",
      "group": "operator",
      "children": [
        {
          "name": "+",
          "type": "addition",
          "group": "operator",
          "children": [
            {
              "name": "5",
              "type": "integer",
              "group": "number"
            },
            {
              "name": "-",
              "type": "subtraction",
              "group": "operator",
              "children": [
                {
                  "name": "8",
                  "type": "integer",
                  "group": "number"
                },
                {
                  "name": "12",
                  "type": "integer",
                  "group": "number"
                }
              ]
            }
          ]
        },
        {
          "name": "*",
          "type": "multiplication",
          "group": "operator",
          "children": [
            {
              "name": "+",
              "type": "addition",
              "group": "operator",
              "children": [
                {
                  "name": "7.4",
                  "type": "decimal",
                  "group": "number",
                },
                {
                  "name": "-",
                  "type": "subtraction",
                  "group": "operator",
                  "children": [
                    {
                      "name": "2.5",
                      "type": "decimal",
                      "group": "number",
                    },
                    {
                      "name": "25",
                      "type": "integer",
                      "group": "number",
                    }
                  ]
                }
              ]
            },
            {
              "name": "/",
              "type": "division",
              "group": "operator",
              "children": [
                {
                  "name": "6",
                  "type": "integer",
                  "group": "number"
                },
                {
                  "name": "x",
                  "type": "variable",
                  "group": "extended"
                }
              ]
            }
          ]
        }
      ]
    }
  ]);
}

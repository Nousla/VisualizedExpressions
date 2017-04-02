import { Component } from '@angular/core';

@Component({
  selector: 'app',
  template: `<h1>Test</h1>
             <visualization [data]=graphData></visualization>`,
})
export class AppComponent {
  private graphData = [
    {
      "name": "root",
      "value": "=",
      "type": "equality",
      "children": [
        {
          "name": "node1",
          "value": "+",
          "type": "addition",
          "children": [
            {
              "name": "node1.1",
              "value": "5",
              "type": "number"
            },
            {
              "name": "node1.2",
              "value": "-",
              "type": "subtraction",
              "children": [
                {
                  "name": "node1.2.1",
                  "value": "8",
                  "type": "number"
                },
                {
                  "name": "node1.2.2",
                  "value": "12",
                  "type": "number"
                }
              ]
            }
          ]
        },
        {
          "name": "node2",
          "value": "*",
          "type": "multiplication",
          "children": [
            {
              "name": "node2.1",
              "value": "7",
              "type": "number"
            },
            {
              "name": "node2.2",
              "value": "/",
              "type": "division",
              "children": [
                {
                  "name": "node2.2.1",
                  "value": "6",
                  "type": "number"
                },
                {
                  "name": "node2.2.2",
                  "value": "x",
                  "type": "variable"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { EncodeService } from './encode.service';


@Component({
  selector: 'frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css'],
  providers: [EncodeService]
})

export class FrontpageComponent {
    type: string;
    types: SelectItem[];
    chosenType: number;
    expression: string;
    urlOutput: string;
    correctSolution: string;
    wrongSolution: string;
    tree: string;
    description: string;


    constructor(private encode: EncodeService, private router: Router){
        this.types = [];
        this.types.push({label:'Sandbox', value:{id: 1, name: 'Sandbox'}});
        this.types.push({label:'Problem Solving', value:{id: 2, name: 'ProblemSolving'}});
        this.types.push({label:'Guide', value:{id: 3, name: 'Guide'}});
        this.chosenType = 1;
    }

    onDropdownChange(event: Event, value: DropdownType){
        this.chosenType=value.id;
    }

    onGenerateURL(){
        var URL: string[] = [];
            URL.push(window.location.protocol);
            URL.push("//");
            URL.push(window.location.host);
            URL.push("/sandbox;");
        switch(this.chosenType){
        case 1:
            URL.push("ex=");
            URL.push(this.encode.encodeURL(this.expression));
            this.urlOutput=URL.join("");
        break;
        case 2:
            URL.push("sp=ps;");
            URL.push("ex=");
            URL.push(this.encode.encodeURL(this.expression));
            URL.push(";x=");
            URL.push(this.encode.encodeURL(this.correctSolution));
            URL.push(";y=");
            URL.push(this.encode.encodeURL(this.wrongSolution));
            this.urlOutput=URL.join("");
        break;
        case 3:
            URL.push("sp=gd;");
            URL.push("tree=");
            URL.push(this.encode.encodeURL(this.tree));
            URL.push(";desc=");
            URL.push(this.encode.encodeURL(this.description));
            this.urlOutput=URL.join("");
            break;
        }
    }

    onCopy(){
        var textToCopy =<HTMLTextAreaElement> document.querySelector("#output_area");
        textToCopy.select();
        document.execCommand("copy");
    }

    onGoToSandbox(){
        this.router.navigateByUrl('/sandbox');
    }

}

class DropdownType {
    private _id: number;
    private _name: string;

    get id(): number{
        return this._id;
    }
    set id(value: number){
       this._id = value;
    }
    
    get name(): string {
        return this._name;
    }
    set name(value: string){
        this._name = value;
    }

}
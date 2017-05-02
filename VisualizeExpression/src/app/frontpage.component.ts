import { Component } from "@angular/core";
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
    expression_field: string;
    url_output_field: string;
    correct_solution_field: string;
    wrong_solution_field: string;
    tree_area: string;
    description_area: string;


    constructor(private encode: EncodeService){
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
        switch(this.chosenType){
        case 1:
            URL.push(window.location.protocol);
            URL.push("//");
            URL.push(window.location.host);
            URL.push("/sandbox;");
            URL.push("ex=");
            URL.push(this.encode.encodeURL(this.expression_field));
            this.url_output_field=URL.join("");
        break;
        case 2:
            URL.push(window.location.protocol);
            URL.push("//");
            URL.push(window.location.host);
            URL.push("/sandbox;");
            URL.push("sp=ps;");
            URL.push("ex=");
            URL.push(this.encode.encodeURL(this.expression_field));
            URL.push(";x=");
            URL.push(this.encode.encodeURL(this.correct_solution_field));
            URL.push(";y=");
            URL.push(this.encode.encodeURL(this.wrong_solution_field));
            this.url_output_field=URL.join("");
        break;
        case 3:
            URL.push(window.location.protocol);
            URL.push("//");
            URL.push(window.location.host);
            URL.push("/sandbox;");
            URL.push("sp=gd;");
            URL.push("tree=");
            URL.push(this.encode.encodeURL(this.tree_area));
            URL.push(";desc=");
            URL.push(this.encode.encodeURL(this.description_area));
            this.url_output_field=URL.join("");
            break;
        }
    }

    onCopy(){
        var textToCopy =<HTMLTextAreaElement> document.querySelector("#output_area");
        textToCopy.select();
        document.execCommand("copy");
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
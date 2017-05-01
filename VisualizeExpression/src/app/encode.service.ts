import { Injectable } from "@angular/core";

@Injectable()
export class EncodeService{

    encodeURL(value: string){
        var URL = encodeURIComponent(value).replace(/\-/g,"%2D").
        replace(/\_/g,"%5F").replace(/\./g,"%2E").replace(/\!/g,"%21").
        replace(/\~/g,"%7E").replace(/\*/g,"%2A").replace(/\'/g,"%27").
        replace(/\(/g,"%28").replace(/\)/g,"%29");
        return URL;
    }
}
import { Injectable } from "@angular/core";

@Injectable()
export class EncodeService{

    encodeURL(value: string): string{
        var encodedURL = encodeURIComponent(value).replace(/\-/g,"$0").
        replace(/\_/g,"$1").replace(/\./g,"$2").replace(/\!/g,"$3").
        replace(/\~/g,"$4").replace(/\*/g,"$5").replace(/\'/g,"$6").
        replace(/\(/g,"$7").replace(/\)/g,"$8");
        return encodedURL;
    }

    decodeURL(value:string): string{
        var decodedURL = decodeURIComponent(value).replace(/\$0/g,"-").
        replace(/\$1/g,"_").replace(/\$2/g,".").replace(/\$3/g,"!").
        replace(/\$4/g,"~").replace(/\$5/g,"*").replace(/\$6/g,"'").
        replace(/\$7/g,"(").replace(/\$8/g,")");

        return decodedURL;
    }
}
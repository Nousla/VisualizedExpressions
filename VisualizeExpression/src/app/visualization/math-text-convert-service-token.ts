import { InjectionToken } from "@angular/core";
import { MathConverterService } from "./math-converter-service";

export let MATH_CONVERTER_SERVICE = new InjectionToken<MathConverterService>("MathConverterServiceToken");
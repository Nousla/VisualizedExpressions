import { InjectionToken } from "@angular/core";
import { MathOutputService } from "./math-output-service";

export let MATH_OUTPUT_SERVICE = new InjectionToken<MathOutputService>("MathOutputServiceToken");

export default MATH_OUTPUT_SERVICE;
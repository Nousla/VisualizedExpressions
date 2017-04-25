import { InjectionToken } from "@angular/core";
import { MathInputService } from "./math-input-service";

export let MATH_INPUT_SERVICE = new InjectionToken<MathInputService>("MathInputServiceToken");

export default MATH_INPUT_SERVICE;
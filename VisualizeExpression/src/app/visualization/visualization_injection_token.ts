import { InjectionToken } from "@angular/core/";
import VisualizationService from "./visualization-service";

export var VISUALIZATION_SERVICE = new InjectionToken<VisualizationService>("VisualizationServiceToken");
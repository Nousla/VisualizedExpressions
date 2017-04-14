import { InternalData } from "./internal-data";

export interface MathInputService {
    convert(input: Object): InternalData;
}

export default MathInputService;
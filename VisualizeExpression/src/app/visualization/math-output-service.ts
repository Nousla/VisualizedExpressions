import { InternalData } from "./internal-data";

export interface MathOutputService {
    convert(data: InternalData): Object;
}

export default MathOutputService;
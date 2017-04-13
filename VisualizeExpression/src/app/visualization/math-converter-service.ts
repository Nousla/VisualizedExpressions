import { InternalData } from "./internal-data";

export interface MathConverterService {
    convert(input: Object): InternalData;
}

export default MathConverterService;
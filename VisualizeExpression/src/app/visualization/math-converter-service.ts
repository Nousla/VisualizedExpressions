import { InternalData } from "./internal-data";

export interface MathConverterService {
    convert(input: string): InternalData;
}

export default MathConverterService;
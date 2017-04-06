import { InternalData } from "./internal-data";

interface MathConverterService {
    convert(input: string): InternalData;
}

export default MathConverterService;
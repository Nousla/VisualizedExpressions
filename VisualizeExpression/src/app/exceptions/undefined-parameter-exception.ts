import { Exception } from "./exception";

export class UndefinedParameterException extends Exception {
    constructor(message: string) {
        super("Undefined Parameter Exception", message);
    }
}

export default UndefinedParameterException;
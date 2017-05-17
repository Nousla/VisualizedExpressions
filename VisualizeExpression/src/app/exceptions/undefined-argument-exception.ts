import { Exception } from "./exception";

export class UndefinedArgumentException extends Exception {
    constructor(argumentName: string) {
        super("Undefined Parameter Exception", argumentName + " is undefined!");
    }
}

export default UndefinedArgumentException;
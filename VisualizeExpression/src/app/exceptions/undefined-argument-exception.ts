import { Exception } from "./exception";

export class UndefinedArgumentException extends Exception {
    constructor(argumentName: string) {
        super("Undefined Argument Exception", argumentName + " is undefined!");
    }
}

export default UndefinedArgumentException;
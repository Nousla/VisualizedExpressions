import { Exception } from "./exception";

export class UndefinedArgumentException extends Exception {
    constructor(message: string) {
        super("Undefined Parameter Exception", message);
    }
}

export default UndefinedArgumentException;
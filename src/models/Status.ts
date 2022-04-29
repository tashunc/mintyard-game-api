interface IStatus {
    code: number,
    description: string;
    additionalDescription: string;

}

export class Status implements IStatus {
    code: number;
    description: string;
    additionalDescription: string;

    constructor(code: number, description: string, additionalDescription: string) {
        this.code = code;
        this.description = description;
        this.additionalDescription = additionalDescription;
    }

    StatusWithoutAdditionalDescription(code: number, description: string) {
        new Status(code, description, '');
    }
}
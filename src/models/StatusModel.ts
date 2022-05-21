interface IStatus {
    code: number,
    description: string;
    additionalDescription: string;

}

export class StatusModel implements IStatus {
    code: number;
    description: string;
    additionalDescription: string;

    constructor(code: number, description: string, additionalDescription: string) {
        this.code = code;
        this.description = description;
        this.additionalDescription = additionalDescription;
    }

    StatusWithoutAdditionalDescription(code: number, description: string) {
        new StatusModel(code, description, '');
    }
}

export enum ERROR_CONSTANTS {
    SUCCESS = 1,
    ERROR = 0
}
export interface IEmployee {
    id: number;
    name: string;
    isAvailable: boolean;
}


export class Employee {
    id: number;
    name: string;
    isAvailable: boolean;

    constructor(id: number, name: string, isAvailable: boolean = true) {
        this.id = id;
        this.name = name;
        this.isAvailable = isAvailable;
    }
}
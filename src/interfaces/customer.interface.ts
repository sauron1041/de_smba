export interface ICustomer {
    id: number;
    name: string;
    checkInTime: Date;
    serviceId: number;
    status: 'waiting' | 'serving' | 'completed';
}

export class Customer {
    id: number;
    name: string;
    status: 'waiting' | 'serving' | 'completed';

    constructor(id: number, name: string, status: 'waiting' | 'serving' | 'completed' = 'waiting') {
        this.id = id;
        this.name = name;
        this.status = status;
    }
}
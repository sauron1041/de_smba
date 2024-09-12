export class Appointment {
    id: number;
    customerId: number;
    dateTime: Date;

    constructor(id: number, customerId: number, dateTime: Date) {
        this.id = id;
        this.customerId = customerId;
        this.dateTime = dateTime;
    }
}
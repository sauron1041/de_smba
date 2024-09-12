import database from "@core/config/database";
import { ICustomer } from "interfaces/customer.interface";
import { Customer } from "interfaces/customer.interface";

class QueueModel {
    private queue: Customer[] = [];

    // public add = (customer: Customer) => {
    //     this.queue.push(customer);
    //     this.queue.sort((a: any, b: any) => {
    //         return a.checkInTime.getTime() - b.checkInTime.getTime();
    //     })
    // }
    public add = (customer: Customer): void => {
        this.queue.push(customer);
    }

    public remove = (id: number) => {
        let index = this.queue.findIndex(customer => customer.id === id);
        if (index > -1) {
            this.queue.splice(index, 1);
        }
    }
    public getNext = (): Customer | undefined => {
        return this.queue[0];
    }
}

export default QueueModel;
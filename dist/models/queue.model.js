"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueueModel {
    constructor() {
        this.queue = [];
        // public add = (customer: Customer) => {
        //     this.queue.push(customer);
        //     this.queue.sort((a: any, b: any) => {
        //         return a.checkInTime.getTime() - b.checkInTime.getTime();
        //     })
        // }
        this.add = (customer) => {
            this.queue.push(customer);
        };
        this.remove = (id) => {
            let index = this.queue.findIndex(customer => customer.id === id);
            if (index > -1) {
                this.queue.splice(index, 1);
            }
        };
        this.getNext = () => {
            return this.queue[0];
        };
    }
}
exports.default = QueueModel;
//# sourceMappingURL=queue.model.js.map
import { ICustomer } from "interfaces/customer.interface";
import { QueueModel } from "models";
import { IEmployee } from "interfaces/employee.interface";
import { getAvailableEmployee, setEmployeeAvailability } from "./employee.service";
import { Employee } from "interfaces/employee.interface";
import { Customer } from "interfaces/customer.interface";

const queueModel = new QueueModel();
const employees: IEmployee[] = [];
// export const addCustomerToQueue = (customer: ICustomer) => {
//     queueModel.add(customer);
// }

// export const checkInCustomer = (customer: ICustomer) => {
//     queueModel.add(customer);
//     console.log(`Customer ${customer.name} has checked in`);
// }

// // export const checkOutCustomer = (id: number) => {
// //     queueModel.remove(id);
// //     console.log(`Customer ${id} has checked out`);
// // }

// // export const assignEmployeeToCustomer = (employee: IEmployee, customer: ICustomer) => {
// //     console.log(`Employee ${employee.name} is serving customer ${customer.name}`);
// // }

// export const serveCustomer = (employee: IEmployee, customer: ICustomer) => {
//     console.log(`Employee ${employee.name} is serving customer ${customer.name}`);
//     const nextCustomer = queueModel.getNext();
//     if (nextCustomer) {
//         console.log(`Next customer is ${nextCustomer.name}`);
//         const availableEmployee = getAvailableEmployee();
//         if (availableEmployee) {
//             console.log(`Employee ${(availableEmployee as any).name} is available`);
//             // serveCustomer(availableEmployee, nextCustomer);
//             nextCustomer.status = 'serving';
//             setEmployeeAvailability((availableEmployee as any).id, false);
//             console.log(`Employee ${(availableEmployee as any).name} is serving customer ${nextCustomer.name}`);
//             queueModel.remove(nextCustomer.id);
//         } else {
//             console.log('No employee is available');
//         }
//     }
// }

// export const completeService = (customerId: number, employeeId: number): void => {
//     const customer = queueModel.getNext();
//     if (customer && customer.id === customerId) {
//         console.log(`Customer ${customer.name} has completed the service`);
//         customer.status = 'completed';
//         setEmployeeAvailability(employeeId, true);
//     }
// }




const queue = new QueueModel();

export function addCustomerToQueue(customer: Customer): void {
    queue.add(customer);
}

export function serveCustomer(): void {
    const nextCustomer = queue.getNext();
    if (nextCustomer) {
        const availableEmployee = getAvailableEmployee();
        if (availableEmployee) {
            console.log(`Serving customer ${nextCustomer.name} with employee ${availableEmployee.name}`);
            nextCustomer.status = 'serving';
            setEmployeeAvailability(availableEmployee.id, false);
            queue.remove(nextCustomer.id);
        } else {
            console.log('No available employees to serve.');
        }
    } else {
        console.log('No customers in queue.');
    }
}

export function completeService(customerId: number, employeeId: number): void {
    const customer = queue.getNext();
    if (customer && customer.id === customerId) {
        customer.status = 'completed';
        console.log(`Service for customer ${customer.name} completed by employee ${employeeId}.`);
        setEmployeeAvailability(employeeId, true);
    }
}
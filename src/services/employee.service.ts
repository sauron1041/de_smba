import e from "express";
import { IEmployee } from "interfaces/employee.interface";
import { Employee } from "interfaces/employee.interface";

const employees: IEmployee[] = [
    {
        id: 1,
        name: 'Employee 1',
        isAvailable: true
    },
    {
        id: 2,
        name: 'Employee 2',
        isAvailable: true
    },
    {
        id: 3,
        name: 'Employee 3',
        isAvailable: true
    },
    {
        id: 4,
        name: 'Employee 4',
        isAvailable: true
    }
];

// export const getAvailableEmployees = (): IEmployee[] => {
//     return employees.filter(employee => employee.isAvailable);
// }
export function getAvailableEmployee(): Employee | undefined {
    return employees.find(emp => emp.isAvailable);
}

export const getEmployeeById = (id: number): IEmployee | undefined => {
    return employees.find(employee => employee.id === id);
}

export const updateEmployeeStatus = (id: number, isAvailable: boolean): void => {
    const employee = employees.find(employee => employee.id === id);
    if (employee) {
        employee.isAvailable = isAvailable;
    }
}

export const getEmployeeByName = (name: string): IEmployee | undefined => {
    return employees.find(employee => employee.name === name);
}

export const getEmployeeByStatus = (isAvailable: boolean): IEmployee[] => {
    return employees.filter(employee => employee.isAvailable === isAvailable);
}

// export const setEmployeeAvailability = (id: number, isAvailable: boolean): void => {
//     const employee = employees.find(employee => employee.id === id);
//     if (employee) {
//         employee.isAvailable = isAvailable;
//     }
// }


export function setEmployeeAvailability(employeeId: number, isAvailable: boolean): void {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
        employee.isAvailable = isAvailable;
    }
}
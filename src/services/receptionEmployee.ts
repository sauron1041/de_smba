import database from "@core/config/database";
import { HttpException } from "@core/exceptions";
import { checkExist } from "@core/utils/checkExist";
import { IPagiantion } from "@core/interfaces";
import { RowDataPacket } from "mysql2";
import errorMessages from "@core/config/constants";
import { AppointmentService } from "./appointment.service";
import { ServiceRequestService } from "./serviceRequest.service";
import { CreateDto as ServiceRequest } from "../dtos/serviceRequest/create.dto";
import { AvailableEmployeeService } from "./availableEmployee.service";
import { CreateDto as AvailableeEmployee } from "dtos/availableEmployee/create.dto";
import eventEmitterInstance from "@core/pubSub/pubSub";
import { QueueService } from "./queueService";

export class ReceptionEmployeeService {
    private tableNameAppointment = 'appointment';
    private fieldId = 'id'
    private appointmentService = new AppointmentService();
    private serviceRequestService = new ServiceRequestService();
    private availableEmployeeService = new AvailableEmployeeService();
    private queueService = new QueueService();

    public constructor() {
        this.listenToEvent();
        this.queueService = this.queueService;
    }
    public acceptAppointment = async (appointment_id: number, status: number) => {
        const checkExistAppointment = await checkExist(this.tableNameAppointment, this.fieldId, appointment_id.toString())
        if (!checkExistAppointment) return new HttpException(400, errorMessages.NOT_FOUND)
        const nowDate = "2024-09-19"
        let query = `update ${this.tableNameAppointment} set status = ? where id = ?`;
        // let query = `update ${this.tableNameAppointment} set status = ? where id = ? and date = ?`;
        // status 2: accept thanh cong 3: accept that bai
        const values = [status, appointment_id];
        console.log(values);
        console.log(query);
        
        
        const result = await database.executeQuery(query, values);
        console.log(result);
        
        if ((result as any).affectedRows === 0)
            return new HttpException(400, errorMessages.ACCEPT_CHECK_IN_FAILED)
        if (status == 3) {
            return new HttpException(400, errorMessages.CANCEL_CHECK_IN_SUCCESS)
        }

        let checkInTime: Date = (checkExistAppointment as RowDataPacket)[0].check_in_time;
        // add customer to queue
        let serviceRequest: ServiceRequest = {
            customer_id: (checkExistAppointment as RowDataPacket)[0].customer_id,
            // khong chon nhan vien
            employee_id: (checkExistAppointment as RowDataPacket)[0].employee_id,
            service_id: (checkExistAppointment as RowDataPacket)[0].service_id,
            status: 1, // status pending
            check_in_time: (checkInTime != undefined) ? checkInTime : new Date(),
            user_id: (checkExistAppointment as RowDataPacket)[0].user_id,
            branch_id: (checkExistAppointment as RowDataPacket)[0].branch_id
        }
        const resultServiceRequest = await this.serviceRequestService.create(serviceRequest)
        if (resultServiceRequest instanceof HttpException) { return new HttpException(400, errorMessages.CREATE_SERVICE_REQUEST_FAILED) }
        eventEmitterInstance.emit('acceptAppointment', appointment_id, checkInTime, 2, (resultServiceRequest.data) ? resultServiceRequest.data : null)
        return {
            data: {
                id: appointment_id,
                check_in_time: checkInTime,
                status: 2,
                serviceRequest: (resultServiceRequest.data) ? resultServiceRequest.data : null
            }
        }
    }
    public findAllQueueByBranchAndStatus = async (branch_id: number, status: number) => {
        const result = await this.serviceRequestService.findQueueByBranchAndStatus(branch_id, status)
        if (result instanceof HttpException) { return new HttpException(400, errorMessages.NOT_FOUND) }
        return {
            data: result.data
        }
    }
    public findAllEmployeeWithCondition = async (model: AvailableeEmployee) => {
        const result = await this.availableEmployeeService.findAllEmployeeWithCondition(model)
        if (result instanceof HttpException) { return new HttpException(400, errorMessages.NOT_FOUND) }
        return {
            data: result.data
        }
    }
    private listenToEvent = async () => {
        eventEmitterInstance.on('appStarted', async (appointment_id: number, checkInTime: Date, status: number, serviceRequest: ServiceRequest) => {
            try {
            } catch (error) {

            }
        })
        // eventEmitter.on('acceptAppointment', async (appointment_id: number, checkInTime: Date, status: number, serviceRequest: ServiceRequest) => {
        //     try {
        //         console.log('acceptAppointment', appointment_id, checkInTime, status, serviceRequest);

        //     } catch (error) {

        //     }
        // })
    }
}
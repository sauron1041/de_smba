import database from "@core/config/database";
import { HttpException } from "@core/exceptions";
import { checkExist } from "@core/utils/checkExist";
import errorMessages from "@core/config/constants";
import { AppointmentService } from "./appointment.service";
import { CreateDto as Appointment } from "../dtos/appointment/create.dto";
import { ServiceRequestService } from "./serviceRequest.service";
import { CreateDto as ServiceRequest } from "../dtos/serviceRequest/create.dto";
import { AvailableEmployeeService } from "./availableEmployee.service";
import { CreateDto as AvailableeEmployee } from "dtos/availableEmployee/create.dto";
import eventEmitterInstance from "@core/pubSub/pubSub";

export class TechnicalEmployeeService {
    private tableNameAppointment = 'appointment';
    private fieldId = 'id'
    private appointmentService = new AppointmentService();
    private serviceRequestService = new ServiceRequestService();
    private availableEmployeeService = new AvailableEmployeeService();

    constructor() {
        this.listenToEvent()
    }

    public updateStatusServiceRequestCompleted = async (model: ServiceRequest, service_request_id: number) => {
        // hoan thanh dich vu cho khach hang => model = 4 (completed)
        const completed_at = new Date()
        const checkExistServiceRequest = await checkExist('service_request', 'id', service_request_id.toString())
        if (!checkExistServiceRequest) return new HttpException(400, errorMessages.NOT_FOUND)
        let query = `update service_request set status = ? , completed_at = ? where id = ?`;
        const values = [4, completed_at, service_request_id];
        const result = await database.executeQuery(query, values);
        if ((result as any).affectedRows === 0)
            return new HttpException(400, errorMessages.UPDATE_FAILED)
        return {
            data: {
                id: service_request_id,
                status: model.status,
            }
        }
    }
    public findAllEmployeeWithCondition = async (model: AvailableeEmployee) => {
        const result = await this.availableEmployeeService.findAllEmployeeWithCondition(model)
        if (result instanceof HttpException) { return new HttpException(400, errorMessages.NOT_FOUND) }
        return {
            data: result.data
        }
    }
    private listenToEvent = () => {
        eventEmitterInstance.on('updateStatusServiceRequestCompleted', this.updateStatusServiceRequestCompleted)
    }
}
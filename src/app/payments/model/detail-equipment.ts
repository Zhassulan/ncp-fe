import {PaymentDetail} from './payment-detail';
import {Equipment} from './equipment';
import {NcpPaymentDetails} from './ncp-payment-details';

export class DetailEquipment {

    detail: NcpPaymentDetails;
    equipment: Equipment;


    constructor(detail: NcpPaymentDetails, equipment: Equipment) {
        this.detail = detail;
        this.equipment = equipment;
    }
}

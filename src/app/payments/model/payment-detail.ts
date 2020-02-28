/**
 * Деталь платежа, разноска на форме платежа
 */
import {NcpPaymentDetails} from './ncp-payment-details';

export class PaymentDetail extends NcpPaymentDetails {

    nomenclature: string;
    icc: string;
    distrStrategy: number;
    num: number;

}

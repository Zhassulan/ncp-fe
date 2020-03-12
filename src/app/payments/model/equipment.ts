/**
 * Класс для хранения дополнительных свойств платежа по оборудованию
 */
import {Id} from '../payment/model/id';

export class Equipment extends Id {

    paymentDetailId: number;
    nomenclature: string;
    msisdn: string;
    icc: string;

}

import {NcpPaymentDetails} from '../../model/ncp-payment-details';
import {Id} from './id';

export class Detail extends Id {

    msisdn: string;
    account: number;
    sum: number;
    status: number;
    err_message: string;
    distribute_date: Date;
    nomenclature: string;
    icc: string;

}

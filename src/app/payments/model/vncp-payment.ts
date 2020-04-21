import {Id} from '../../payment/model/id';

export class VNcpPayment extends Id {

    creationDate: string;
    nameSender: string;
    sum: number;
    rnnSender: string;
    accountSender: string;
    accountRecipient: string;
    knp: string;
    paymentDetails: string;
    managedBy: string;
    status: number;
    distributeDate: string;
    statusRu: string;

}

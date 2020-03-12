import {Id} from './id';
import {Action} from './action';
import {Detail} from './detail';

export class Payment  extends Id {

    profileId: number;
    paymentId  : number;
    paymentDocnum  : string;
    agent  : string;
    status: number;
    creationDate: string;
    closeDate  : string;
    distributeDate: string;
    sum: number;
    statementReference  : string;
    nameSender: string;
    rnnSender: string;
    accountSender: string;
    accountRecipient: string;
    knp: string;
    mobipayPartner  : string;
    paymentDetails: string;
    transitPaymentDocNumId  : number;
    details  : Detail [];
    actions  : Action [];
    managedBy  : string;
    mobipay  : boolean;
    isChecked: boolean;
    statusRu: string;

}

import {Id} from './id';
import {Action} from './action';
import {Detail} from './detail';

export class Payment  extends Id {

    profileId: number;
    paymentId  : number;
    payDocnum  : string;
    agent  : string;
    status: number;
    created: string;
    closed  : string;
    distributed: string;
    sum: number;
    statementReference  : string;
    sender: string;
    rnnSender: string;
    accSender: string;
    accRecipient: string;
    knp: string;
    mobipayPartner  : string;
    payDetails: string;
    transitPdocNumId  : number;
    details  : Detail [];
    actions  : Action [];
    managedBy  : string;
    mobipay  : boolean;
    isChecked: boolean;
    statusRu: string;

}

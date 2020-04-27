import {Detail} from './detail';

export class Payment {

    id: number;
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
    managedBy  : string;
    mobipay  : boolean;
    isChecked: boolean;
    statusRu: string;

    details  : Detail [];

    deferred: string;

}

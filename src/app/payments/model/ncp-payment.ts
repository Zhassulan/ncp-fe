/**
 * Модель NCP платёж, таблица ncp_payment
 */
export class NcpPayment {

    id: number;
    profileId: number;
    paymentId: number;
    paymentDocnum: string;
    agent: string;
    status: number;
    creationDate: string;
    closeDate: string;
    distributeDate: string;
    sum: number;
    statementReference: string;
    nameSender: string;
    rnnSender: string;
    accountSender: string;
    accountRecipient: string;
    knp: string;
    mobipayPartner: string;
    paymentDetails: string;
    transitPaymentDocNumId: number;
    details: string [];
    actions: string [];
    managers: string;
    mobipay: boolean;
    isChecked?: boolean;
    statusRu: string;


    constructor() {
        this.paymentId = 11;
        this.creationDate = '11';
    }

    public getId(): number {
        return this.id;
    }

    public getStatus(): number {
        return this.status;
    }

}

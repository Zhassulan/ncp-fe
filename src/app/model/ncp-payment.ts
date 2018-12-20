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
     isChecked? : boolean = false;

     public getId(): number   {
        return this.id;
     }

    public getStatus(): number   {
        return this.status;
    }

}

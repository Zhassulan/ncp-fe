export class Detail {

    id: number;
    paymentId: number;
    msisdn: string;
    account: number;
    sum: number;
    status: number;
    err: string;
    distributed: Date;
    nomenclature: string;
    icc: string;

    constructor() {
        this.id = null;
        this.paymentId = null;
        this.msisdn = null;
        this.account = null;
        this.sum = null;
        this.status = null;
        this.err = null;
        this.distributed = null;
        this.nomenclature = null;
        this.icc = null;
    }

}

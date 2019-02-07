export class PaymentDetail {

    id: number;
    msisdn: string;
    account: number;
    sum: number;
    status: number;
    err_message: string;
    distribute_date: Date;

    nomenclature: string;
    icc: string;
    distrStrategy: number;
    num: number;

    constructor() {
        this.id = null;
        this.msisdn = null;
        this.account = null;
        this.sum = null;
        this.status = null;
        this.err_message = null;
        this.distribute_date = null;
        this.nomenclature = null;
        this.icc = null;
        this.distrStrategy = null;
    }
}

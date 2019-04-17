export class EquipmentCheckParam {

    icc: string;
    sum: number;
    status: number;
    info: string;
    invcodeName: string;
    account: number;

    constructor(icc: string, sum: number, invcodeName: string, account: number) {
        this.icc = icc;
        this.sum = sum;
        this.status = 0;
        this.info = null;
        this.invcodeName = invcodeName;
        this.account = account;
    }

}

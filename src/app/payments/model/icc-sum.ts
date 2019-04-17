export class IccSum {

    icc: string;
    sum: number;
    status: number;
    info: string;

    constructor(icc: string, sum: number) {
        this.icc = icc;
        this.sum = sum;
        this.status = 0;
        this.info = null;
    }
}

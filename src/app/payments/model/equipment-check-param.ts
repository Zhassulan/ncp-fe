/**
 * Класс набор параметров для сверки в биллинге по оборудованию
 *  Конструктор
 * @param {string} icc
 * @param {number} sum
 * @param {string} invcodeName
 * @param {number} account
 */
export class EquipmentCheckParam {

    icc: string;
    sum: number;
    status: number;
    info: string;
    invcodeName: string;
    account: number;

    /**
     * Конструктор
     * @param {string} icc
     * @param {number} sum
     * @param {string} invcodeName
     * @param {number} account
     */
    constructor(icc: string, sum: number, invcodeName: string, account: number) {
        this.icc = icc;
        this.sum = sum;
        this.status = 0;
        this.info = null;
        this.invcodeName = invcodeName;
        this.account = account;
    }

}

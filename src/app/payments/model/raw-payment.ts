/**
 * Модель грязный платёж (загрузка либо с банка, либо с файла), таблица ncp_payment_raw
 */
export class RawPayment {

    id: number;
    ncpPaymentId: number;
    status: number;
    creationDate: string;
    loadDate: string;
    sum: number;
    statementReference: null;
    nameSender: string;
    rnnSender: string;
    accountSender: string;
    accountRecipient: string;
    paymentId: number;
    paymentDocNum: number;
    knp: string;
    dataLoader: string;
    paymentDetails: string;
    mobipay: number;
    hashsum: number;
}

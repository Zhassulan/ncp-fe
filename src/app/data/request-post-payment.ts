import {PaymentActions} from '../settings';

export class RequestPostPayment {

    action: PaymentActions;

    constructor(action) {
        this.action = action;
    }

}

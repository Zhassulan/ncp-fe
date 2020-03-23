import {Injectable} from '@angular/core';
import {locStorItems, PaymentStatusRu, rests} from '../settings';
import {Observable} from 'rxjs';
import {NcpPayment} from './model/ncp-payment';
import {PayDataService} from '../data/pay-data-service';

@Injectable({
    providedIn: 'root',
})
export class PaymentsService {

    payments = []; // платежи
    paginatorResultsLength: number;

    constructor(private payDataService: PayDataService) {    }

    setStatusRu(payment) {
        payment.statusRu = PaymentStatusRu[payment.status];
    }

    setStatusRuOrigin(payment) {
        payment.status = PaymentStatusRu[payment.status];
    }

    initStatusRu(payments) {
        payments.forEach(payment => {
            this.setStatusRu(payment);
        });
    }

    updateStatusRuOrigin(payments): NcpPayment [] {
        payments.forEach(payment => {
            this.setStatusRuOrigin(payment);
        });
        return payments;
    }

    toTransit(paymentId): Observable<any> {
        return new Observable(
            observer => {
                this.payDataService.toTransit(paymentId).subscribe(data => {
                        if (data.result == rests.restResultOk) {
                            let payment = this.payments.find(x => x.id == paymentId);
                            payment.status = data.data.status;
                            this.setStatusRu(payment);
                        }
                        observer.next(data);
                    },
                    error2 => {
                        observer.error(error2);
                    },
                    () => {
                        observer.complete();
                    });
            });
    }

    /**
     *  Удаление платежа на транзитном счёте
     * @param paymentId id платежа
     * @returns {Observable<any>}
     */
    deleteTransit(paymentId): Observable<any> {
        return new Observable<any>(
            observer => {
                this.payDataService.fromTransit(paymentId, localStorage.getItem(locStorItems.userName)).subscribe(data => {
                        if (data.result == rests.restResultOk) {
                            let payment = this.payments.find(x => x.id == paymentId);
                            payment.status = data.data.status;
                            this.setStatusRu(payment);
                        }
                        observer.next(data);
                    },
                    error2 => {
                        observer.error(error2);
                    },
                    () => {
                        observer.complete();
                    });
            });
    }

    /**
     * Обновление платежа в списке сервиса (кеш) после разноски
     * @param {number} paymentId
     * @param {NcpPayment} paymentNewData
     */
    updatePaymentListItem(paymentId: number, paymentNewData: NcpPayment) {
        this.payments.find(x => x.id == paymentId).status = paymentNewData.status;
    }

    /*
    getPaymentsByPage(dr: DateRange, page, offset): Observable<RestResponse> {
        return new Observable(
            observer => {
                this.dataService.payme(dr.startDate, dr.endDate, page, offset).subscribe(data => {
                        if (data.result == rests.restResultOk) {
                            observer.next(data);
                        }
                        if (data.result == rests.restResultErr) {
                            let msg = msgs.msgErrLoadData + data.result + this.userService.logUser();
                            observer.error(msg);
                        }
                    },
                    error2 => {
                        let msg = msgs.msgErrLoadData + error2 + this.userService.logUser();
                        this.logger.error(msg);
                        observer.error(msg);
                    },
                    () => {
                        observer.complete();
                    });
            });
    }*/

}

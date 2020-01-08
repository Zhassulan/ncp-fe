import {Injectable} from '@angular/core';
import {DataService} from '../data/data.service';
import {NGXLogger} from 'ngx-logger';
import {DateRange} from '../data/date-range';
import {locStorItems, msgs, PaymentStatusRu, rests} from '../settings';
import {Observable, Subject} from 'rxjs';
import {UserService} from '../user/user.service';
import {NcpPayment} from './model/ncp-payment';
import {RestResponse} from '../data/rest-response';

@Injectable()
export class PaymentsService {

    payments = []; // платежи
    paginatorResultsLength: number;
    newNcpPayment: NcpPayment = new NcpPayment();

    constructor(private dataService: DataService,
                private logger: NGXLogger,
                private userService: UserService) {
    }

    setStatusRu(payment) {
        payment.statusRu = PaymentStatusRu[payment.status];
    }

    setStatusRuOrigin(payment) {
        payment.status = PaymentStatusRu[payment.status];
    }

    updateStatusRu() {
        this.payments.forEach(payment => {
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
                this.dataService.paymentToTransit(paymentId).subscribe(data => {
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
                this.dataService.deleteTransitPayment(paymentId, localStorage.getItem(locStorItems.userName)).subscribe(data => {
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

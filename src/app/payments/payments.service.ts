import {Injectable} from '@angular/core';
import {DataService} from '../data/data.service';
import {NGXLogger} from 'ngx-logger';
import {DateRange} from '../data/date-range';
import {locStorItems, msgs, PaymentStatusRu} from '../settings';
import {Observable} from 'rxjs';
import {UserService} from '../user/user.service';

@Injectable()
export class PaymentsService {

    payments = [];
    lastDateRange: DateRange;
    paginatorResultsLength: number;

    constructor(private dataService: DataService,
                private logger: NGXLogger,
                private userService: UserService) {
    }

    getData(dr: DateRange): Observable<any> {
        return new Observable(
            observer => {
                this.dataService.getNcpPayments(dr).subscribe(data => {
                        this.payments = data;
                        this.updateStatusRu();
                        observer.next(this.payments);
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
    }

    getSampleData(): Observable<any> {
        return new Observable(
            observer => {
                this.dataService.getNcpPaymentsJson().subscribe(data => {
                    this.payments = data;
                    this.updateStatusRu();
                    observer.next(this.payments);
                }, error2 => {
                    let msg = msgs.msgErrLoadData + error2 + this.userService.logUser();
                    this.logger.error(msg);
                    observer.error(msg);
                }, () => {
                    observer.complete();
                });
            });
    }

    setStatusRu(payment) {
        payment.statusRu = PaymentStatusRu[payment.status];
    }

    updateStatusRu() {
        this.payments.forEach(payment => {
            this.setStatusRu(payment);
        });
    }

    toTransit(paymentId): Observable<any> {
        let msg;
        return new Observable(
            observer => {
                this.dataService.paymentToTransit(paymentId).subscribe(data => {
                        if (data.result == 'ok') {
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
     * @param in_payment
     * @returns {Observable<any>}
     */
    deleteTransit(paymentId): Observable<any> {
        let msg;
        return new Observable<any> (
            observer => {
                this.dataService.deleteTransitPayment(paymentId, localStorage.getItem(locStorItems.userName)).subscribe(data => {
                        if (data.result == 'ok') {
                            let payment = this.payments.find(x => x.id == paymentId);
                            payment.status = data.data.status;
                            this.setStatusRu(payment);
                        }
                        observer.next(data);
                    },
                    error2 => {
                        observer.error(msg);
                    },
                    () => {
                        observer.complete();
                    });
            })
    }

}

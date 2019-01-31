import {Injectable} from '@angular/core';
import {DataService} from '../data/data.service';
import {NGXLogger} from 'ngx-logger';
import {DateRange} from '../data/date-range';
import {locStorItems, msgs, PaymentStatusRu, rests} from '../settings';
import {Observable} from 'rxjs';
import {UserService} from '../user/user.service';
import {NcpPayment} from './model/ncp-payment';
import {RawPayment} from './model/raw-payment';
import {RestResponse} from '../data/rest-response';

@Injectable()
export class PaymentsService {


    payments = [];
    lastDateRange: DateRange;
    paginatorResultsLength: number;
    newRawPayment: RawPayment = new RawPayment();
    newNcpPayment: NcpPayment = new NcpPayment();

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

    createRawPayment(payment: RawPayment): Observable<RestResponse> {
        return new Observable<any>(
            observer => {
                this.dataService.createRawPayment(payment).subscribe(data => {
                        if (data.result == rests.restResultOk) {
                            this.newRawPayment = data.data;
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

    getNcpPaymentByRawId(): Observable<RestResponse> {
        return new Observable<any>(
            observer => {
                this.dataService.getNcpPaymentByRawId(this.newRawPayment.id).subscribe(data => {
                        if (data.result == rests.restResultOk)  {
                            this.newNcpPayment = data.data;
                            observer.next(data);
                        }
                        if (data.result == rests.restResultErrDb)  {
                            observer.error();
                        }
                    },
                    error2 => {
                        observer.error(error2);
                    },
                    () => {
                        observer.complete();
                    });
            });
    }

}

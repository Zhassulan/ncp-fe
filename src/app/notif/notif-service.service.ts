import {Injectable} from '@angular/core';
import {NotificationsService} from 'angular2-notifications';
import {Operation} from '../payments/payment/operations/model/operation';
import {Subject, Subscription} from 'rxjs';
import {PaymentDetail} from '../payments/model/payment-detail';
import {Msg} from './msg';
import {msgType} from '../settings';

@Injectable()
export class NotifService {

    msgs: Msg[] = [];
    private msgsObs = new Subject<Msg [] >();
    msgAnnounced$ = this.msgsObs.asObservable();

    constructor(private notificationsService: NotificationsService) { }

    add(type:number, txt: string) {
        this.msgs.push({type, txt});
        this.announce();
    }

    flush() {
        this.msgs = [];
    }

    announce() {
        this.msgsObs.next(this.msgs);
    }

    subscribe(): Subscription  {
        return this.msgAnnounced$.subscribe(
        msgs => {
            msgs.forEach(msg => {
                if (msg.type == msgType.info)   {
                    this.notificationsService.info(msg.txt);
                }
                if (msg.type == msgType.warn)   {
                    this.notificationsService.warn(msg.txt);
                }
                if (msg.type == msgType.error)   {
                    this.notificationsService.error(msg.txt);
                }
                msgs.splice(msgs.indexOf(msg), 1);
            });
        });
    }

}

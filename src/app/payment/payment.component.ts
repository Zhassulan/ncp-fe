import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';
import {PaymentMenuItems, PaymentStatus} from '../settings';
import {PaymentService} from './payment.service';
import {DlgImportRouterRegistryComponent} from './dialog/dlg-import-router-registry.component';
import {ActivatedRoute, Router} from '@angular/router';
import {PaymentDetailsComponent} from './details/payment-details.component';
import {AppService} from '../app.service';
import {DlgDeferComponent} from './calendar-defer-modal/dlg-defer.component';
import {PaymentRepository} from './payment-repository';
import {Subscription} from 'rxjs';
import {DlgRegistryBufferComponent} from './add-registry-modal/dlg-registry-buffer.component';
import {DlgService} from '../dialog/dlg.service';
import {Message} from '../message';
import {TemplateService} from '../template/template.service';
import {ProgressBarService} from '../progress-bar.service';
import {ClientService} from '../clients/client.service';

export interface RegistryDialogData {
  registry: string;
}

export interface CalendarDialogData {
  date: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {

  paymentStatus = PaymentStatus;
  private paymentMenuItems = PaymentMenuItems;
  private dialogRef;
  private registry: string;
  private deferDate = new Date();
  private subscription: Subscription;
  @ViewChild(PaymentDetailsComponent, {static: true}) private childDetailsComponent: PaymentDetailsComponent;

  constructor(public payService: PaymentService,
              private notifService: NotificationsService,
              private route: ActivatedRoute,
              public dlg: MatDialog,
              private appService: AppService,
              private payDataService: PaymentRepository,
              private clientService: ClientService,
              private dlgService: DlgService,
              private router: Router,
              private templateService: TemplateService,
              private progressBarService: ProgressBarService) {
  }

  get payment() {
    return this.payService.payment;
  }

  ngOnInit() {
    this.load(this.route.snapshot.params['id']);

  }

  public menuOnSelected(selectedMenuItem: number) {
    switch (selectedMenuItem) {
      case this.paymentMenuItems.LOAD_EQUIPMENT: {
        this.dlgImportEquipment();
      }
        break;
      case this.paymentMenuItems.DISTRIBUTE: {
        this.dlgDistribute();
      }
        break;
      case this.paymentMenuItems.REGISTRY: {
        this.dlgImportRegistry();
      }
        break;
      case this.paymentMenuItems.DEFER: {
        this.dlgDefer();
      }
        break;
      case this.paymentMenuItems.DEL_TRANSIT: {
        this.dlgDelTransit();
      }
        break;
      case this.paymentMenuItems.TRANSIT: {
        this.dlgTransit();
      }
        break;
      case this.paymentMenuItems.DEL: {
        this.dlgDel();
      }
        break;
      case this.paymentMenuItems.TEMPLATE: {
        this.openTemplates();
      }
        break;
      default:
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private load(id) {
    this.payService.payment = null;
    this.progressBarService.start();
    this.subscription = this.payDataService.findById(id).subscribe(
      data => {
        this.payService.setPayment(data);
        if (this.canLoadPhones(data)) {
          this.props();
        }
      },
      error => {
        this.progressBarService.stop();
        this.notifService.error(error.message);
      },
      () => this.progressBarService.stop());
  }

  private canLoadPhones(payment) {
    return this.payService.canLoadPhones(payment);
  }

  private props() {
    this.progressBarService.start();
    this.subscription = this.clientService.props(this.payment.rnnSender, this.payment.profileId).subscribe(
      data => {
        this.payService.props.count = data;
        this.payService.announceProps();
      },
      error => {
        this.progressBarService.stop();
        this.notifService.error(error.message);
      },
      () => this.progressBarService.stop());
  }

  private dlgImportEquipment() {
    this.dialogRef = this.dlg.open(DlgImportRouterRegistryComponent, {
      width: '40%',
      height: '30%',
      disableClose: true
    });
  }

  private dlgDistribute() {
    this.progressBarService.start();
    this.subscription = this.payDataService.distribute(this.payment.id, this.payment.details).subscribe(
      data => {
        this.payService.setPayment(data);
        this.notifService.info(Message.OK.DISTRIBUTED);
      },
      error => {
        this.dlgService.clear();
        this.notifService.error(Message.ERR.INVALID_REGISTRY);
        this.dlgService.addItem(`${Message.ERR.INVALID_REGISTRY} в количестве ${error.message.length}`);
        error.message.forEach(i => this.dlgService.addItem(i.msisdn ? i.msisdn : i.account));
        this.dlgService.openDialog();
        this.progressBarService.stop();
      }, () => this.progressBarService.stop());
  }

  private dlgDelTransit() {
    this.progressBarService.start();
    this.subscription = this.payDataService.transitDel(this.payment.id).subscribe(
      data => {
        this.payService.setPayment(data);
        this.notifService.info(Message.OK.TRANSIT_DELETED);
      },
      error => {
        this.notifService.error(error.message);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
  }

  private dlgTransit() {
    this.progressBarService.start();
    this.subscription = this.payDataService.transit(this.payment.id).subscribe(data => {
        this.payService.setPayment(data);
        this.notifService.info(Message.OK.TRANSIT);
      },
      error => {
        this.notifService.error(error.message);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
  }

  private dlgDel() {
    this.progressBarService.start();
    this.subscription = this.payDataService.del(this.payment.id).subscribe(data => {
        this.payService.setPayment(data);
        this.notifService.info(Message.OK.PAYMENT_DELETED);
      },
      error => {
        this.notifService.error(error.message);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
  }

  private dlgImportRegistry() {
    const dialogRef = this.dlg.open(DlgRegistryBufferComponent, {
      width: '50%',
      data: {registry: this.registry},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        return;
      }
      if (result === '') {
        return;
      }
      if (result.length > 0) {
        const data = this.payService.importRegistryData(result);
        if (data.broken.length) {
          this.notifService.warn(`Есть ошибочные строки:\n ${data.broken}`);
        }
      }
    });
  }

  private dlgDefer() {
    const dialogRef = this.dlg.open(DlgDeferComponent, {
      width: '30%',
      data: {date: this.deferDate},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          return;
        }
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const futureDt = new Date(result);
        if (futureDt.getTime() < tomorrow.getTime()) {
          this.notifService.warn(`Дата должна быть больше ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}. Установите дату.`);
          return;
        }
        this.progressBarService.start();
        this.subscription = this.payDataService.defer(this.payment, futureDt.getTime()).subscribe(
          data => {
            this.payService.setPayment(data);
            this.notifService.info(`Установлена дата отложенной разноски ${futureDt.getDate()}/${futureDt.getMonth() + 1}/${futureDt.getFullYear()}`);
          },
          error => {
            this.notifService.error(error.message);
            this.progressBarService.stop();
          },
          () => this.progressBarService.stop()
        );
      }
    );
  }

  private openTemplates() {
    this.router.navigate([`company/${this.payment.profileId}/templates`]);
  }

}

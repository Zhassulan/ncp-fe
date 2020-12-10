import {Component, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {Template} from '../model/template';
import {ActivatedRoute, Router} from '@angular/router';
import {TemplateService} from '../template.service';
import {NotificationsService} from 'angular2-notifications';
import {ClientProfile} from '../../clients/clientProfile';
import {ClientService} from '../../clients/client.service';
import {TemplateDetailsTableComponent} from '../details-table/template-details-table.component';
import {AppService} from '../../app.service';
import {MatDialog} from '@angular/material/dialog';
import {DlgTemplateDetailComponent} from '../dlg-template-detail/dlg-template-detail.component';
import {TemplateDetail} from '../model/template-detail';
import {PaymentService} from '../../payment/payment.service';


@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  template: Template;
  profile: ClientProfile;
  @ViewChild(TemplateDetailsTableComponent)
  private details: TemplateDetailsTableComponent;
  @Output() emitterClose = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute,
              private templateService: TemplateService,
              private clntService: ClientService,
              private appService: AppService,
              private notif: NotificationsService,
              public dialog: MatDialog,
              private router: Router,
              private paymentService: PaymentService) {
  }

  ngOnInit(): void {
    this.loadTemplate();
  }

  loadTemplate() {
    this.appService.setProgress(true);
    this.templateService.findById(this.route.snapshot.params['id']).subscribe(
        data => {
          this.template = data;
          if (this.details)
            this.details.dataSource.data = this.template.details;
          this.clntService.loadProfile(this.template.profileId).subscribe(
              data => {
                this.profile = data;
              },
              error => {
                this.appService.setProgress(false);
                this.notif.error(error);
              },
              () => {
                this.appService.setProgress(false);
              });
        }, error => {
          this.appService.setProgress(false);
          this.notif.error(error);
        }, () => {
          this.appService.setProgress(false);
        });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.details.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.details.dataSource.paginator) {
      this.details.dataSource.paginator.firstPage();
    }
  }

  deleteDetail() {
    if (this.details.selection.selected.length == 0) {
      this.notif.warn('Выделите записи в таблице');
    } else {
      this.details.selection.selected.forEach(t => {
        this.appService.setProgress(true);
        this.templateService.deleteDetail(this.template.id, t.id).subscribe(
            data => {
              this.loadTemplate();
            },
            error => {
              this.appService.setProgress(false);
              this.notif.error(error);
            },
            () => {
              this.appService.setProgress(false);
              this.details.selection.deselect(t);
            });
      });
    }
  }

  onReload(reload: boolean) {
    if (reload) this.loadTemplate();
  }

  onDeleteDetail() {
    this.deleteDetail();
  }

  onAddDetail() {
    this.openDlgAddTemplateDetail();
  }

  openDlgAddTemplateDetail(): void {
    const dialogRef = this.dialog.open(DlgTemplateDetailComponent, {
      width: '500px',
      data: {detail: new TemplateDetail(null, 0, 0)},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addDetail(result);
    });
  }

  onApplyPayment() {
    this.paymentService.templateId = this.route.snapshot.params['id'];
    this.router.navigate([`payments/${ this.paymentService.payment.id }`]);
  }

  addDetail(detail) {
    this.appService.setProgress(true);
    let newDetail = new TemplateDetail(
        detail.msisdn,
        Number(detail.account),
        Number(detail.sum));
    this.templateService.createDetail(this.template.id, newDetail).subscribe(
        data => {
          this.loadTemplate();
        },
        error => {
          this.appService.setProgress(false);
        },
        () => {
          this.appService.setProgress(false);
        }
    );
  }

}


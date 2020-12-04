import {Component, OnInit, ViewChild} from '@angular/core';
import {Template} from '../model/template';
import {ActivatedRoute} from '@angular/router';
import {TemplateService} from '../template.service';
import {NotificationsService} from 'angular2-notifications';
import {ClientProfile} from '../../clients/clientProfile';
import {ClientService} from '../../clients/client.service';
import {TemplateDetailsTableComponent} from '../details-table/template-details-table.component';
import {AppService} from '../../app.service';
import {map} from 'rxjs/operators';
import {combineLatest, concat} from 'rxjs';

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

  constructor(private route: ActivatedRoute,
              private templateService: TemplateService,
              private clntService: ClientService,
              private appService: AppService,
              private notif: NotificationsService) {
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


}


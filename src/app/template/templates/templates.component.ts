import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TemplateService} from '../template.service';
import {ClientService} from '../../clients/client.service';
import {TemplatesTableComponent} from '../templates-table/templates-table.component';
import {NotificationsService} from 'angular2-notifications';
import {AppService} from '../../app.service';
import {ClientProfile} from '../../clients/clientProfile';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

  @ViewChild(TemplatesTableComponent) templatesTableComponent;
  profile: ClientProfile;

  constructor(private route: ActivatedRoute,
              private clntService: ClientService,
              private templateService: TemplateService,
              private notif: NotificationsService,
              private appService: AppService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.loadProfile(params['id']);
    });
  }

  loadProfile(profileId) {
    this.appService.setProgress(true);
    this.clntService.loadProfile(profileId).subscribe(
        data => {
          this.profile = data;
        },
        error => {
          this.appService.setProgress(false);
        },
        () => {
          this.appService.setProgress(false);
        });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.templatesTableComponent.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.templatesTableComponent.dataSource.paginator) {
      this.templatesTableComponent.dataSource.paginator.firstPage();
    }
  }

  delete() {
    if (this.templatesTableComponent.selection.selected.length == 0) {
      this.notif.warn('Выделите записи в таблице');
    } else {
      this.templatesTableComponent.selection.selected.forEach(t => {
        this.appService.setProgress(true);
        this.templateService.delete(t.id).subscribe(
            data => {
              this.templatesTableComponent.retrieve();
            },
            error => {
              this.appService.setProgress(false);
            },
            () => {
              this.appService.setProgress(false);
            });
      });
    }
  }

}

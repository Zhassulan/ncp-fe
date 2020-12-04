import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TemplateService} from '../template.service';
import {ClientService} from '../../clients/client.service';
import {TemplatesTableComponent} from '../templates-table/templates-table.component';
import {NotificationsService} from 'angular2-notifications';
import {AppService} from '../../app.service';
import {ClientProfile} from '../../clients/clientProfile';
import {MatDialog} from '@angular/material/dialog';
import {DlgEnterTemplateName} from '../dlg/enter-template-name/dlg-enter-template-name.component';

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
              private appService: AppService,
              private router: Router,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadProfile(this.route.snapshot.params['id']);
  }

  loadProfile(profileId) {
    console.log('Loading profile by ID' + profileId);
    this.appService.setProgress(true);
    this.clntService.loadProfile(profileId).subscribe(
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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.templatesTableComponent.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.templatesTableComponent.dataSource.paginator) {
      this.templatesTableComponent.dataSource.paginator.firstPage();
    }
  }

  onDelete() {
    this.delete();
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
              this.notif.error(error);
            },
            () => {
              this.appService.setProgress(false);
            });
      });
    }
  }

  onCreate() {
    this.openDlgEnterTemplateName();
  }

  openDlgEnterTemplateName(): void {
    const dialogRef = this.dialog.open(DlgEnterTemplateName, {
      width: '250px',
      data: {name: ''},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.createTemplate(this.profile.id, result);
    });
  }

  createTemplate(profileId, name) {
    this.appService.setProgress(true);
    this.templateService.create(profileId, name).subscribe(
        data => {
          this.router.navigate([`templates/${data.id}`]);
        },
        error => {
          this.appService.setProgress(false);
          this.notif.error(error);
        },
        () => {
          this.appService.setProgress(false);
        });
  }

}

import {AfterContentChecked, AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {Template} from '../model/template';
import {TemplateService} from '../template.service';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {ClientService} from '../../clients/client.service';
import {SelectionModel} from '@angular/cdk/collections';
import {ClientProfile} from '../../clients/clientProfile';

@Component({
  selector: 'app-templates-table',
  templateUrl: './templates-table.component.html',
  styleUrls: ['./templates-table.component.scss']
})
export class TemplatesTableComponent implements OnInit, AfterViewInit, AfterContentChecked {

  displayedColumns = [
    'select',
    'no',
    'name',
    'company',
    'bin',
    'menu'];
  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort: MatSort;
  dataSource = new MatTableDataSource<Template>();
  selection = new SelectionModel<Template>(true, []);
  @Input() profile: ClientProfile;

  constructor(private appService: AppService,
              private notif: NotificationsService,
              private router: Router,
              private templateService: TemplateService,
              private clntService: ClientService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  open(template: Template) {
    this.router.navigate(['templates', template.id]);
  }

  delete(template: Template) {
    this.appService.setProgress(true);
    this.templateService.delete(template.id).subscribe(
        data => {
          this.retrieve();
        },
        error => {
          this.notif.error(error);
          this.appService.setProgress(false);
        },
        () => {
          this.appService.setProgress(false);
        }
    );
  }

  retrieve() {
    this.appService.setProgress(true);
    this.templateService.findAllByProfileId(this.profile.id).subscribe(
        data => {
          this.dataSource.data = data;
        },
        error => {
          this.appService.setProgress(false);
        },
        () => {
          this.appService.setProgress(false);
        });
  }

  create() {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.no + 1}`;
  }

  ngAfterContentChecked(): void {
    if (this.profile)
      if (this.dataSource.data.length == 0) {
        console.log('Loading templates');
        this.retrieve();
      }
  }

}

import {AfterContentChecked, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {TemplateService} from '../template.service';
import {TemplateDetail} from '../model/template-detail';
import {Template} from '../model/template';
import {SelectionModel} from '@angular/cdk/collections';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';


@Component({
  selector: 'app-template-details-table',
  templateUrl: './template-details-table.component.html',
  styleUrls: ['./template-details-table.component.scss']
})
export class TemplateDetailsTableComponent implements OnInit, AfterContentChecked {

  @Input() template: Template;
  displayedColumns = [
    'select',
    'no',
    'msisdn',
    'account',
    'sum',
    'menu'];
  dataSource = new MatTableDataSource<TemplateDetail>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  selection = new SelectionModel<TemplateDetail>(true, []);
  @Output() reload = new EventEmitter<boolean>();

  constructor(private templateService: TemplateService,
              private appService: AppService,
              private notif: NotificationsService) {
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onDelete(detail) {
    this.deleteDetail(detail);
  }

  deleteDetail(detail) {
    this.appService.setProgress(true);
    this.templateService.deleteDetail(this.template.id, detail.id).subscribe(
        data => {
          this.reload.emit(true);
        }, error => {
          this.notif.error(error);
          this.appService.setProgress(false);
        }, () => {
          this.appService.setProgress(false);
        }
    );
  }

  ngAfterContentChecked(): void {
    if (this.template)
      if (this.dataSource.data.length == 0) this.dataSource.data = this.template.details;
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

}

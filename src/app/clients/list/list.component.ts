import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Client} from './client';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-clents-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  displayedColumns: string[] = ['#', 'Название', 'ИИН/БИН', 'Менеджер', 'Тип', 'Сегмент'];
  dataSource = new MatTableDataSource<Client>(this.data());
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  data(): Client [] {
    return null;
  }

}

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {NcpPayment} from '../../payments/model/ncp-payment';
import {DataService} from '../../data/data.service';
import {NGXLogger} from 'ngx-logger';
import {NotificationsService} from 'angular2-notifications';
import {msgs, rests} from '../../settings';
import {PaymentsService} from '../../payments/payments.service';
import {AppService} from '../../app.service';
import {ExcelService} from '../../excel/excel.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-registries',
    templateUrl: './registries.component.html',
    styleUrls: ['./registries.component.css']
})
export class RegistriesComponent implements OnInit {

    displayedColumns = [
        'ID',
        'created',
        'bin',
        'company',
        'phone',
        'email',
        'msisdn',
        'amount',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    //источник данных для таблицы
    dataSource = new MatTableDataSource<NcpPayment>();
    //общее количество для пагинации
    paginatorResultsLength: number;
    excelServ = this.excelService;

    constructor(private dataService: DataService,
                private logger: NGXLogger,
                private notifService: NotificationsService,
                private appService: AppService,
                private excelService: ExcelService,
                private router: Router) {
    }

    ngOnInit() {
        this.getData();
        this.setPaginator();
    }

    getData() {
        this.appService.setProgress(true);
        this.dataService.getAllRegistries().subscribe(
            data => {
                if (data.result = rests.restResultOk) {
                    this.dataSource.data = data.data;
                } else {
                    this.logger.error(data.data);
                }
            },
            error2 => {
                this.logger.error(error2);
                this.notifService.error(msgs.msgErrLoadData);
                this.appService.setProgress(false);
            },
            () => {
                this.appService.setProgress(false);
            });
    }

    setPaginator()  {
        this.paginatorResultsLength = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    save()  {
        this.excelService.save(this.dataSource.data);
    }

    onRowClicked(registry) {
        this.menuOnRegistryOpen(registry);
    }

    menuOnRegistryOpen(registry) {
        this.router.navigate(['registry/' + registry.id]);
    }

}

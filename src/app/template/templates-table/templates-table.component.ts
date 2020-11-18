import {AfterContentChecked, AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {Template} from '../model/template';
import {TemplateService} from '../template.service';
import {ClientProfile} from '../../clients/clientProfile';
import {concat} from 'rxjs';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {ClientService} from '../../clients/client.service';

@Component({
    selector: 'app-templates-table',
    templateUrl: './templates-table.component.html',
    styleUrls: ['./templates-table.component.scss']
})
export class TemplatesTableComponent implements OnInit, AfterViewInit, AfterContentChecked {

    displayedColumns = [
        'name',
        'company',
        'bin',
        'menu'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource = new MatTableDataSource<Template>();

    constructor(private appService: AppService,
                private notif: NotificationsService,
                private router: Router,
                private templateService: TemplateService,
                private clntService: ClientService) {
    }

    ngOnInit(): void {
    }

    get templates() {
        return this.templateService.templates;
    }

    get profile() {
        return this.clntService.clientProfile;
    }

    open(template: Template) {
        this.router.navigate(['templates', {id : template.id} ]);
    }

    delete(template: Template) {
        this.appService.setProgress(true);
        let obs1 = this.templateService.delete(template.id);
        let obs2 = this.templateService.findAllByProfileId(this.profile.id);
        let res = concat(obs1, obs2);
        res.subscribe(
            data => {},
                error => {
                this.appService.setProgress(false);
                this.notif.error(error);
            }, () => this.appService.setProgress(false));
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngAfterContentChecked(): void {
        if (this.templates)
            if (this.dataSource.data.length == 0) this.dataSource.data = this.templates;
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

}

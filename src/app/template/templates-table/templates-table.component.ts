import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AppService} from '../../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClientProfile} from '../../clients/clientProfile';
import {TemplateService} from '../template.service';
import {Template} from '../model/template';

@Component({
    selector: 'app-templates-table',
    templateUrl: './templates-table.component.html',
    styleUrls: ['./templates-table.component.scss']
})
export class TemplatesTableComponent implements OnInit, OnDestroy {

    displayedColumns = [
        'name',
        'company',
        'bin',
        'menu'];
    dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    private clientProfile: ClientProfile;
    private subscription: Subscription;

    constructor(private route: ActivatedRoute,
                private appService: AppService,
                private templateService: TemplateService,
                private snackBar: MatSnackBar,
                private router: Router) {
    }

    @Input()
    get profile(): ClientProfile {
        return this.clientProfile;
    }

    set profile(clientProfile) {
        if (clientProfile) {
            this.clientProfile = clientProfile;
            this.loadData();
        }
    }

    ngOnInit(): void {
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 5000,
        });
    }

    loadData() {
        this.appService.setProgress(true);
        this.subscription = this.templateService.findAllById(this.clientProfile.id).subscribe(
            data => this.dataSource.data = this.templateService.templates = data,
            error => {
                this.appService.setProgress(false);
                this.openSnackBar(error.message, null);
            },
            () => this.appService.setProgress(false));
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }

    openTemplate(item: Template) {
        this.router.navigate([`templates/${item.id}`]);
    }

}

import {AfterViewInit, Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MobipayRepo} from '../mobipay-repo.service';
import {Subscription} from 'rxjs';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
    selector: 'app-partners',
    templateUrl: './dlg-mobipay-partners.component.html',
    styleUrls: ['./dlg-mobipay-partners.component.scss']
})
export class DlgMobipayPartnersComponent implements OnInit, AfterViewInit, OnDestroy {

    dataSource;
    displayedColumns: string[] = ['code', 'name', 'account', 'bin'];
    @Input() paymentId;
    subscription: Subscription;

    constructor(private dlgRef: MatDialogRef<DlgMobipayPartnersComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private mobipayDataService: MobipayRepo,
                private appService: AppService,
                private notifService: NotificationsService) {
    }

    ngOnInit(): void {    }

    ngAfterViewInit(): void {
        this.appService.setProgress(true);
        this.subscription = this.mobipayDataService.partners(this.data.paymentId).subscribe(
            data => this.dataSource = data,
            error => {
                this.notifService.error(error.message);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onRowClick(row) {
        this.dlgRef.close(row);
    }

}

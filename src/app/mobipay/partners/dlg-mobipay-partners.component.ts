import {AfterViewInit, Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MobipayDataService} from '../../data/mobipay-data.service';
import {Subscription} from 'rxjs';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
    selector: 'app-partners',
    templateUrl: './dlg-mobipay-partners.component.html',
    styleUrls: ['./dlg-mobipay-partners.component.css']
})
export class DlgMobipayPartnersComponent implements OnInit, AfterViewInit, OnDestroy {

    dataSource;
    displayedColumns: string[] = ['code', 'name', 'account', 'bin'];
    @Input() paymentId;
    subscription: Subscription;

    constructor(private dlgRef: MatDialogRef<DlgMobipayPartnersComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private mobipayDataService: MobipayDataService,
                private appService: AppService,
                private notifService: NotificationsService) {
    }

    close(): void {
        this.dlgRef.close();
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.appService.setProgress(true);
        this.paymentId = 330096;
        this.subscription = this.mobipayDataService.partners(this.paymentId).subscribe(
            data => this.dataSource = data,
            error => {
                this.notifService.error(error.error.errm);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onRowClick(row) {
        console.log(row);
        this.close();
    }

}

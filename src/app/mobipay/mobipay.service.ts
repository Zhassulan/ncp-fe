import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {MobipayRepository} from './mobipay-repository';
import {LimitsUpdateResponse} from './model/limits-update-response';

@Injectable({
    providedIn: 'root'
})
export class MobipayService {

    limits: LimitsUpdateResponse [];

    constructor(private notifService: NotificationsService,
                private mobipayDataService: MobipayRepository) {
    }

    updateLimits(file: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return new Observable(
            observer => {
                this.mobipayDataService.updateLimits(formData).subscribe(
                    data => {
                        this.limits = data;
                        observer.next(true);
                    },
                    error => {
                        this.notifService.error(error.message);
                        observer.error(false);
                    },
                    () => {
                        observer.complete();
                    });
            }
        );
    }

    resetFile() {
        this.limits = null;
    }

}

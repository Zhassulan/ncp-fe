import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataService} from '../data/data.service';
import {FilePayment} from './model/file-payment';
import {HttpErrorResponse} from '@angular/common/http';
import {msgs} from '../settings';
import {NGXLogger} from 'ngx-logger';
import {NotificationsService} from 'angular2-notifications';

@Injectable()
export class UploadFilePaymentService {

    filePayment: FilePayment;
    formData;

    constructor(private dataService: DataService,
                private logger: NGXLogger,
                private notifService: NotificationsService) {
    }

    upload(file: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        this.formData = formData;
        return new Observable (
            observer => {
                this.dataService.postFilePayment(formData).subscribe(
                    data => {
                        this.filePayment = data.data;
                        observer.next(true);
                    },
                    error2 => {
                        this.notifService.error(msgs.msgErrUploadFilePayment + ' (' + error2 + ')');
                        this.logger.error(msgs.msgErrUploadFilePayment + ' (' + error2 + ')');
                        observer.error(false);
                    },
                    () => {
                        observer.complete();
                    });
            }
        );
    }

    errorHandler(error: HttpErrorResponse) {
        return Observable.throwError(error.message || 'Ошибка сервера.');
    }

    resetFilePayment()  {
        this.filePayment = null;
    }

}

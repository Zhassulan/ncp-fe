import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {FilePayment} from './model/file-payment';
import {HttpErrorResponse} from '@angular/common/http';
import {msgs} from '../../../settings';
import {NGXLogger} from 'ngx-logger';
import {NotificationsService} from 'angular2-notifications';
import {Utils} from '../../../utils';
import {PayDataService} from '../../../data/pay-data-service';

@Injectable({
    providedIn: 'root',
})
export class UploadFilePaymentService {

    private _filePayment: FilePayment;
    formData;
    utils = new Utils(this.logger);

    constructor(private logger: NGXLogger,
                private notifService: NotificationsService,
                private payDataService: PayDataService) {
    }

    get filePayment(): FilePayment {
        return this._filePayment;
    }

    upload(file: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        this.formData = formData;
        return new Observable (
            observer => {
                this.payDataService.postFile(formData).subscribe(
                    data => {
                        this._filePayment = data.data;
                        //console.log('Загружены данные из файла:\n');
                        //this.utils.printObj(this.filePayment);
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
        //return Observable.throwError(error.message || 'Ошибка сервера.');
        return null;
    }

    resetFilePayment()  {
        this._filePayment = null;
    }

}

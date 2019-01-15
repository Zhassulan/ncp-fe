import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DataService} from '../data/data.service';
import {FilePayment} from './model/file-payment';
import {HttpErrorResponse} from '@angular/common/http';
import {msgs, timeouts} from '../settings';
import {MatSnackBar} from '@angular/material';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class UploadFilePaymentService {

    filePayment: FilePayment;
    formData;

    constructor(private dataService: DataService,
                public snackBar: MatSnackBar,
                private logger: NGXLogger) {
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
                        this.showMsg(msgs.msgErrUploadFilePayment);
                        this.logger.error(msgs.msgErrUploadFilePayment);
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

    showMsg(text) {
        this.openSnackBar(text, '');
        setTimeout(function () {
        }.bind(this), timeouts.timeoutAfterLoginInput);
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: timeouts.showMsgDelay,
        });
    }

}

import {Injectable} from '@angular/core';
import {RouterRegistry} from './model/router-registry';
import {NotificationsService} from 'angular2-notifications';
import {PayDataService} from '../data/pay-data-service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  routerRegistry: RouterRegistry;

  constructor(private notifService: NotificationsService,
              private payDataService: PayDataService) {
  }

  registryFromFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return new Observable (
        observer => {
          this.payDataService.routerRegistry(formData).subscribe(
              data => {
                this.routerRegistry = data;
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

  resetFilePayment()  {
    this.routerRegistry = null;
  }

}

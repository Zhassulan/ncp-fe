import {Injectable} from '@angular/core';
import {headers, locStorItems} from '../settings';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root',})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  setUser(user) {
    localStorage.setItem(locStorItems.user, user);
  }

  logout() {
    localStorage.removeItem(locStorItems.user);
  }

  getUser() {
    return localStorage.getItem(locStorItems.user);
  }

  login(username, password) {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.post(environment.apiUrl + '/auth/login', null, {
      params: params,
      headers: headers.append('Content-Type', 'application/x-www-form-urlencoded')
    });
  }
}

export const AUTH_PROVIDERS: Array<any> = [{
  provide: AuthService, useClass: AuthService
}
];

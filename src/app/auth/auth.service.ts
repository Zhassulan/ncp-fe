import {Injectable} from '@angular/core';
import {
    HttpClient,
    HttpEventType,
    HttpRequest,
    HttpResponse,
    HttpHeaders
} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/internal/operators';
// import * as ldapjs from 'ldapjs';

const endpoint = 'http://localhost:8080/ncp-resteasy/rest/user/auth';
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

//const ldapClient = ldapjs.createClient(3268, '192.168.101.70');

@Injectable()
export class AuthService {

    example;

    constructor(private http: HttpClient) {
    }

    private extractData(res: Response) {
        let body = res;
        return body || {};
    }

    login(username: string, password: string) {
        let headers = new HttpHeaders();
        headers.append('Authorization', 'Basic ' + window.btoa(username + ':' + password));
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.http.get(endpoint, {
            headers: headers
        }).subscribe(
            data => this.example = data.toString(),
            err => this.logError(err.toString()),
            () => console.log('Request Complete')
        );
        console.log(this.example);
        // to keep user logged in between page refreshes
        //user.authdata = window.btoa(username + ':' + password);
        localStorage.setItem('username', JSON.stringify(username));
    }

    logError(msg)   {
        console.log(msg);
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('username');
    }

    getUser(): any {
        return localStorage.getItem('username');
    }

    isLoggedIn(): boolean {
        return this.getUser() !== null;
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            console.log(`${operation} failed: ${error.message}`);
            return; //of(result as T);
        };
    }

}

export const AUTH_PROVIDERS: Array<any> = [
    {provide: AuthService, useClass: AuthService}
];

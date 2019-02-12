import { Injectable } from '@angular/core';
import {locStorItems} from '../settings';

@Injectable()
export class UserService {

  constructor() { }

    logUser(): string   {
        return ' user ' + localStorage.getItem(locStorItems.userName);
    }

    getUserName(): string {
        return localStorage.getItem(locStorItems.userName);
    }
}

import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Message} from './message';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {
  }

  ok(msg) {
    this.snackBar.open(Message.RESULT.SUCCESS + msg, 'OK');
  }

  err(msg) {
    this.snackBar.open(Message.RESULT.ERROR + msg, 'OK');
  }
}

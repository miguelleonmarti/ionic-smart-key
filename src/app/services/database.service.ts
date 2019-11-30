import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { Door } from '../models/door';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public doorListRef: firebase.database.Reference;

  constructor() {
    this.doorListRef = firebase.database().ref('doors');
  }

  getRef() {
    return this.doorListRef;
  }

  getUserUuid(): string {
    return firebase.auth().currentUser.uid;
  }
}

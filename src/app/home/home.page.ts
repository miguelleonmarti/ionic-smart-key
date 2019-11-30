import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Door } from '../models/door';

import { AuthService } from '../services/user/auth.service';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  doorList: Door[];

  constructor(
    private database: DatabaseService,
    private auth: AuthService,
    private bluetoothSerial: BluetoothSerial
  ) {
    this.database.getRef().on('value', snapshot => {
      this.doorList = [];
      snapshot.forEach(door => {
        door.forEach(element => {
          if (
            element.key === 'users' &&
            element.val().includes(this.database.getUserUuid())
          ) {
            this.doorList.push(door.val() as Door);
          }
        });
      });
    });
  }

  logout() {
    this.auth.logoutUser();
  }

  /**
   * Set the door state. In other words, it opens or closes a door by its identifier.
   * @example
   * firebase.database().ref(`doors/${id}/open`).set(state)
   * @param id Door identifier.
   * @param state True to open and false to close.
   */
  setDoorState(id: string, state: boolean) {
    this.database
      .getRef()
      .child(`${id}/open`)
      .set(state);
  }

  bleCommunication(macAddress: string) {
    this.bluetoothSerial
      .enable()
      .then(() => {
        this.bluetoothSerial.connect(macAddress).subscribe();
        this.bluetoothSerial
          .isConnected()
          .then(() => {
            console.log('It is connected.');
            this.bluetoothSerial
              .write('Hello world!')
              .then(() => {
                console.log('Sent successfuly ;)');
              })
              .catch((error) => {
                console.log('Could not be sent ;(');
              });
          })
          .catch((error) => {
            console.log('It is not connected.');
          });
      })
      .catch(() => {
        alert('In order to open/close the door turn on the Bluetooth please.');
      });
  }
}

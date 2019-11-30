import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';

// firebase
import * as firebase from 'firebase/app';

// firebase config
import { environment } from '../environments/environment';

const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor() {
    this.initializeApp();
    firebase.initializeApp(environment.firebase);
  }

  initializeApp() {
    SplashScreen.hide().catch(error => {
      console.error(error);
    });

    StatusBar.hide().catch(error => {
      console.error(error);
    });
  }

}

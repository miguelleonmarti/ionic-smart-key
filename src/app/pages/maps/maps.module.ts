import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Geolocation } from "@ionic-native/geolocation/ngx";

import { IonicModule } from '@ionic/angular';

import { MapsPageRoutingModule } from './maps-routing.module';

import { MapsPage } from './maps.page';
import { GoogleMaps, GoogleMap } from '@ionic-native/google-maps';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapsPageRoutingModule
  ],
  declarations: [MapsPage],
  providers: [Geolocation]
})
export class MapsPageModule {}

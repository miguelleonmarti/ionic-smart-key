import {
  Component,
  OnInit,
  AfterContentInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { Door } from 'src/app/models/door';
import { getDistance } from 'geolib';
declare var google;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss']
})
export class MapsPage implements OnInit, AfterContentInit {
  map;
  latitude: any;
  longitude: any;
  doorList: Door[] = [];
  @ViewChild('mapElement', { static: true }) mapElement: ElementRef;
  constructor(
    private geolocation: Geolocation,
    private database: DatabaseService
  ) {
    this.database.getRef().on('value', snapshot => {
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

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        const map = new google.maps.Map(this.mapElement.nativeElement, {
          center: { lat: 28.07079, lng: -15.455199 },
          zoom: 13
        });
        const infoWindow = new google.maps.InfoWindow();
        const pos = {
          lat: this.latitude,
          lng: this.longitude
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent('Me');
        infoWindow.open(map);
        map.setCenter(pos);

        const locations = [];
        this.doorList.forEach(door => {
          if (
            getDistance(
              { latitude: this.latitude, longitude: this.longitude },
              { latitude: door.latitude, longitude: door.longitude }
            ) < 10000
          ) {
            locations.push([
              door.name,
              door.latitude,
              door.longitude,
              door.open
            ]);
          }
        });

        let marker, i;

        console.log(this.database.getUserUuid());
        console.log(locations);

        for (i = 0; i < locations.length; i++) {
          let url = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
          if (locations[i][3] === true) {
            url = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
          }
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            title: locations[i][0],
            icon: {
              url: url
            }
          });

          google.maps.event.addListener(
            marker,
            'click',
            ((marker, i) => {
              return () => {
                infoWindow.setContent(locations[i][0]);
                infoWindow.open(map, marker);
              };
            })(marker, i)
          );
        }
      })
      .catch(error => console.log(`Error: ${error}`));
  }
}

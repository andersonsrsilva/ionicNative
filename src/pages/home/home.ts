import {Component, ElementRef, ViewChild} from '@angular/core';
import {Geolocation} from "@ionic-native/geolocation";
import {
  CameraPosition,
  GoogleMap,
  GoogleMaps,
  GoogleMapsEvent,
  ILatLng,
  LatLng,
  Marker,
  MarkerOptions
} from "@ionic-native/google-maps";
import {MapStyle} from '../../app/mapStyle';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;
  address;

  constructor(public geolocation: Geolocation,
              public googleMaps: GoogleMaps) {

  }

  ngAfterViewInit() {
    let loc: LatLng;
    this.initMap();

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.getLocation().then((res) => {
        loc = new LatLng(res.coords.latitude, res.coords.longitude);
        this.moveCamera(loc);

        this.createMaker(loc, 'Me')
          .then((marker: Marker) => {
            marker.showInfoWindow();
          }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      })
    });
  }

  moveCamera(loc: LatLng) {
    let options: CameraPosition<ILatLng> = {
      target: loc,
      zoom: 15,
      tilt: 10
    }

    this.map.moveCamera(options);
  }

  initMap() {
    let style = [];
    let element = this.mapElement.nativeElement;

    if (this.isNight()) {
      style = MapStyle;
    }

    this.map = this.googleMaps.create(element, {styles: style});
  }

  getLocation() {
    return this.geolocation.getCurrentPosition();
  }

  createMaker(loc: LatLng, title: string) {
    let markerOptions: MarkerOptions = {
      position: loc,
      title: title
    };

    return this.map.addMarker(markerOptions);
  }

  isNight() {
    let time = new Date().getHours();

    return (time > 5 && time < 19) ? true : false;
  }

}

import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation'
/**
 * Generated class for the DinerLocatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google


@IonicPage()
@Component({
  selector: 'page-diner-locate',
  templateUrl: 'diner-locate.html',
})
export class DinerLocatePage {

	@ViewChild('map') mapElement: ElementRef
	map: any

	constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation) {
		this.loadMap()
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DinerLocatePage');
	}

	loadMap(){
 
	    this.geolocation.getCurrentPosition().then((position) => {
 
			let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)

			let mapOptions = {
				center: latLng,
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}

			this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)

			console.log("map is set")

		}, (err) => {
			console.log(err)
	    })
	 
	}

}

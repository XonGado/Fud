import { Component, ViewChild, ElementRef } from '@angular/core'
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular'

import { CustProfilePage } from '../cust-profile/cust-profile'
import { MenusPage } from '../menus/menus'
import { OrderPage } from '../order/order'
import { ComboPage } from '../combo/combo'

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
// import { Observable } from 'rxjs/Observable'

import { Diner } from '../../models/diner.model'

import { Geolocation } from '@ionic-native/geolocation'

/**
 * Generated class for the HomeCustPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google

@IonicPage()
@Component({
  selector: 'page-home-cust',
  templateUrl: 'home-cust.html',
})
export class HomeCustPage {

	@ViewChild('map') mapElement: ElementRef
	map: any

	uid: string
	dinerList: Diner[]
  	dinersCollectionRef: AngularFirestoreCollection<Diner>
  	diner_ids: any[] = []

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public menu: MenuController,
				private fire: AngularFireAuth, 
				private firestore: AngularFirestore,
				public geolocation: Geolocation) {
		menu.enable(true)

		this.uid = fire.auth.currentUser.uid
		this.dinersCollectionRef = this.firestore.collection('diners')
		this.dinerList = this.retrieveDiners()
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomeCustPage')
		// this.openCombo()
		this.loadMap()
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

	addMarker(){
 
		var latLng

		this.geolocation.getCurrentPosition().then((position) => {
			latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
			console.log(latLng)
			
			let marker = new google.maps.Marker({
			  	map: this.map,
			  	animation: google.maps.Animation.DROP,
			  	position: latLng
			})

			let content = "<h4 style='color:black!important'>Information!</h4>"         
			this.addInfoWindow(marker, content)

			marker.setMap(this.map)

			console.log("Marker is set." + latLng)
		}, (err) => {
			console.log(err)
		})

	}

	addInfoWindow(marker, content){
 
		let infoWindow = new google.maps.InfoWindow({
		  	content: content
		})
		 
		google.maps.event.addListener(marker, 'click', () => {
		  	infoWindow.open(this.map, marker)
		})
	 
	}

	retrieveDiners(){
		let _diners: any[] = []
		let that = this
		this.dinersCollectionRef.ref.get()
		.then(function(querySnapshot){
			querySnapshot.forEach(function(doc){
				_diners.push(doc.data())
				that.diner_ids.push(doc.id)
			})
		})
		return _diners
	}

	orderHere(index){
		let that = this
		this.navCtrl.push(OrderPage, {
			data: that.diner_ids[index]
		})
	}

	openProfile(){
		this.navCtrl.push(CustProfilePage)
	}

	openCombo(){
		this.navCtrl.push(ComboPage)
	}


	openMenus(){
		this.navCtrl.push(MenusPage)
	}

	logout(){
		this.navCtrl.pop()
	}

}

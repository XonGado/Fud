import { Component, ViewChild, ElementRef } from '@angular/core'
import { IonicPage, NavController, NavParams, MenuController, ToastController, Slides, Platform, AlertController } from 'ionic-angular'

import { CustProfilePage } from '../cust-profile/cust-profile'
import { MenusPage } from '../menus/menus'
import { OrderPage } from '../order/order'
import { ComboPage } from '../combo/combo'
import { CustViewOrderPage } from '../cust-view-order/cust-view-order'
import { CustViewDinerPage } from '../cust-view-diner/cust-view-diner'
import { CustScanPage } from '../cust-scan/cust-scan'

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

import { Diner } from '../../models/diner.model'

import { Geolocation } from '@ionic-native/geolocation'
import { GoogleMaps, GoogleMap, CameraPosition, LatLng, GoogleMapsEvent, Marker, MarkerOptions, LocationService, MyLocation, MyLocationOptions, GoogleMapOptions } from '@ionic-native/google-maps'

declare var google

@IonicPage()
@Component({
  selector: 'page-cust-home',
  templateUrl: 'cust-home.html',
})

export class CustHomePage {

	@ViewChild(Slides) slides: Slides
	@ViewChild('map') mapElement: ElementRef
	map: GoogleMap

	uid: string
	dinerList: Diner[]
  	dinersCollectionRef: AngularFirestoreCollection<Diner>
  	diner_ids: any[] = []
  	order_ids: any[] = []
  	dinerID: any
  	orderID: any
  	ordered: boolean
  	name: string
  	email: string
  	favorites: any
  	customerCount: any[] = []
  	view: string
  	position: any

  	userLocation: any
  	dinerDistances: any[] = []

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public menu: MenuController,
				public toastCtrl: ToastController,
				private fire: AngularFireAuth, 
				private firestore: AngularFirestore,
				private geolocation: Geolocation,
				private google_maps: GoogleMaps,
				private alertCtrl: AlertController,
				private platform: Platform) {
		let that = this

		this.view = "diner"
		this.uid = fire.auth.currentUser.uid
		this.firestore.collection('customers').doc(this.uid).ref.get()
		.then(doc => {
			that.name = doc.data().cust_name
			that.email = doc.data().cust_email	
			that.favorites = doc.data().favorites.length
		})
		this.dinersCollectionRef = this.firestore.collection('diners')
		this.dinerList = this.retrieveDiners()
		this.customerCount = this.getCount()		
	}

	ionViewWillEnter() { 
		this.dinerList = this.retrieveDiners()
		this.userHasOrdered()
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomeCustPage')
	    this.menu.enable(true)
		this.userHasOrdered()	
		this.setupSlides()
		// this.initMap()
		this.loadMap()
	}

	initMap() {
		// this.map = GoogleMaps.create('map_canvas')
		let that = this
		let option: MyLocationOptions = {
			enableHighAccuracy: true
		}

		LocationService.getMyLocation(option).then((location: MyLocation) => {
			that.map = GoogleMaps.create({
				target: location.latLng,
				zoom: 15
			})
		}).catch((error: any) => {
			let alert = this.alertCtrl.create({
				message: error
			})
			alert.present()
		})
	}

	// ngAfterViewInit() {
	// 	let loc: LatLng
	// 	let that = this
	// 	this.initMap()
	// 	this.map.one(GoogleMapsEvent.MAP_READY)
	// 	.then(() => {
	// 		that.getLocation()
	// 		.then(res => {
	// 			loc = new LatLng(res.coords.latitude, res.coords.longitude);

	// 			let alert = that.alertCtrl.create({
	// 				message: ("Entered get location with position: ")
	// 			})
	// 			alert.present();
	// 			that.moveCamera(loc)

	// 			that.createMarker(loc, "Me").then((marker: Marker) => {
	// 				marker.showInfoWindow();
	// 			}).catch(error => {
	// 				console.log(error)
	// 			})
	// 		})
	// 		.catch(error => {
	// 			console.log(error)
	// 			let alert = that.alertCtrl.create({
	// 				message: (error)
	// 			})
	// 			alert.present();
	// 		})
	// 	})
	// }

// maps function
	// initMap() {
	// 	let element = this.mapElement.nativeElement
	// 	this.map = this.google_maps.create(element)
	// }

	// getLocation() {
	// 	if (this.geolocation.getCurrentPosition() != undefined) {
	// 		let alert = this.alertCtrl.create({
	// 			message: "Got geolocation"
	// 		})
	// 	}
	// 	return this.geolocation.getCurrentPosition()
	// }

	// moveCamera(loc: LatLng) {
	// 	let options: CameraPosition<LatLng> = {
	// 		target: loc,
	// 		zoom: 15,
	// 		tilt: 10
	// 	}
	// 	this.map.moveCamera(options)
	// }

	// createMarker(loc: LatLng, title: string) {
	// 	let markerOptions: MarkerOptions = {
	// 		position: loc,
	// 		title: title
	// 	}
	// 	return this.map.addMarker(markerOptions)
	// }

	loadMap(){
		let that = this
		this.geolocation.getCurrentPosition().then((pos) => {
			let latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
			that.position = latlng
		}).then(() => {
			console.log(that.position)
			that.alertCtrl.create({
				title: "Position",
				message: String(that.position),
				buttons: [{
					text: "Dismiss"
				}]
			}).present()

			let mapOptions = {
				center: that.position,
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}

			this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)

			let marker = new google.maps.Marker({
		        map: this.map,
		        animation: google.maps.Animation.DROP,
		        position: that.position
		    })

			let content = "You are here"

			this.addInfoWindow(marker, content)
		    marker.setMap(this.map)

			var cityCircle = new google.maps.Circle({
	            strokeColor: '#00FF00',
	            strokeOpacity: 0.8,
	            strokeWeight: 2,
	            fillColor: 'transparent',
	            map: this.map,
	            center: that.position,
	            radius: 1500
	        })
	    }).catch(error => {
	    	that.alertCtrl.create({
	    		title: "Error",
	    		message: error.message,
	    		buttons: [{
	    			text: "Dismiss"
	    		}]
	    	}).present()
	    })
	}

	addDinerMarkers(){
		for (var diner of this.dinerList) {
			this.dinerDistances.push(this.getDistance(this.userLocation, latLng))
			let latLng = new google.maps.LatLng(diner.dine_location.latitude, diner.dine_location.longitude);
		    let marker = new google.maps.Marker({
		        map: this.map,
		        animation: google.maps.Animation.DROP,
		        position: latLng
		    })

			let content = 
				"<h4>" + diner.dine_name + "</h4>" +
				"<span>" + diner.dine_address + "</span>"

			this.addInfoWindow(marker, content)
		    marker.setMap(this.map)
		}
		console.log(this.dinerDistances)
	}

	addInfoWindow(marker, content){
		let infoWindow = new google.maps.InfoWindow({
		  	content: content
		})	 
		google.maps.event.addListener(marker, 'click', () => {
		  	infoWindow.open(this.map, marker)
		})
	}

	rad (x) {
		return x * Math.PI / 180;
	}

	getDistance (p1, p2) {
		var R = 6378137; // Earth’s mean radius in meter
		var dLat = this.rad(p2.lat() - p1.lat())
		var dLong = this.rad(p2.lng() - p1.lng())
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
				Math.sin(dLong / 2) * Math.sin(dLong / 2)
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		var d = R * c
		return (d/1000).toFixed(1) // returns the distance in meter
	}

	setupSlides(){
		this.slides.centeredSlides = false
		this.slides.lockSwipes(false)	
		// this.slides.direction = "vertical"
	}

	slide(index){
		this.slides.slideTo(index)
	}

	menuToggle(){
		this.menu.enable(true)
		this.menu.toggle()
	}

	getCount() {
		let that = this
		let counter: any[] = []
		this.dinersCollectionRef.ref.get()
		.then(querySnapshot => {
			that.diner_ids.forEach(function(id) {
				that.dinersCollectionRef.doc(id).collection('orders').ref.where("cleared", "==", false).get()
				.then(function(querySnapshot) {
					counter.push(querySnapshot.size)
				})
			})
		})
		return counter
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
		.then( function() {
			that.userHasOrdered()
		})
		return _diners
	}

	userHasOrdered(){
		let that = this
		let order: any[] = []

		for (var i = 0; i < this.diner_ids.length; i++) {
			let id = this.diner_ids[i]

			this.dinersCollectionRef.doc(id).collection('orders').ref.where("customer_id", "==", that.uid).where("cleared", "==", false).get()
			.then( querySnapshot => {
				querySnapshot.forEach( doc => {
					order.push(doc.data())
					that.dinerID = id
					that.orderID = doc.id
				})
			}).then( _ => {
				that.ordered = order.length >= 1
			})
		}
	}

	orderHere(index){
		if (this.ordered == undefined) {
			this.userHasOrdered()
			
			var orderedMsg = this.toastCtrl.create({
				message: "Give us a second.",
				dismissOnPageChange: true,
				position: "bottom",
				duration: 3000
			})

			orderedMsg.present()
		} else if (!this.ordered) {
			let that = this
			this.navCtrl.push(OrderPage, {
				data: that.diner_ids[index]
			})
		} else {
			var orderedMsg = this.toastCtrl.create({
				message: "You can't order again! You still have ongoing orders.",
				dismissOnPageChange: true,
				position: "bottom",
				duration: 3000
			})

			orderedMsg.present()
		}
	}

	viewMyOrder(){
		this.navCtrl.push(CustViewOrderPage, {
			dinerID: this.dinerID,
			orderID: this.orderID
		})
	}

	viewDiner(index){
		this.navCtrl.push(CustViewDinerPage, {
			dinerID: this.diner_ids[index]
		})
	}

	openProfile(){
		this.navCtrl.push(CustProfilePage)
	}

	openCombo(){
		this.navCtrl.push(ComboPage)
	}

	openScanner(){
		this.navCtrl.push(CustScanPage);
	}

	openMenus(){
		this.navCtrl.push(MenusPage)
	}

	logout(){
		this.fire.auth.signOut()
	}
}

import { Component, ViewChild, ElementRef } from '@angular/core'
import { IonicPage, NavController, NavParams, MenuController, AlertController, ToastController, Slides, Platform } from 'ionic-angular'

import { CustProfilePage } from '../cust-profile/cust-profile'
import { MenusPage } from '../menus/menus'
import { OrderPage } from '../order/order'
import { ComboPage } from '../combo/combo'
import { CustViewOrderPage } from '../cust-view-order/cust-view-order'
import { CustViewDinerPage } from '../cust-view-diner/cust-view-diner'
import { CustScanPage } from '../cust-scan/cust-scan'
import { CustNotificationPage } from '../cust-notification/cust-notification'
import { CustFavoritesPage } from '../cust-favorites/cust-favorites'

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

import { Diner } from '../../models/diner.model'

import { Geolocation } from '@ionic-native/geolocation'

declare var google

@IonicPage()
@Component({
  selector: 'page-cust-home',
  templateUrl: 'cust-home.html',
})

export class CustHomePage {

	@ViewChild(Slides) slides: Slides
	@ViewChild('map') mapElement: ElementRef

	map: any

	uid: string
	dinerList: any[]
  	dinersCollectionRef: AngularFirestoreCollection<Diner>
  	order_ids: any[] = []
  	dinerID: any
  	orderID: any
  	ordered: boolean = false
  	name: string
  	email: string
  	favorites: any
  	view: string

  	location: any = 0
  	position: any

  	dinerDistances: any[] = []

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public menu: MenuController,
				public toastCtrl: ToastController,
				public alertCtrl: AlertController,
				private fire: AngularFireAuth, 
				private firestore: AngularFirestore,
				public platform: Platform,
				public geolocation: Geolocation) {
		let that = this
		this.location = new google.maps.LatLng(10.64071874033119, 122.22745867523122)
		this.view = "diner"
		this.uid = fire.auth.currentUser.uid
		this.firestore.collection('customers').doc(this.uid).ref.get()
		.then(customer => {
			that.name = customer.data().cust_name
			that.email = customer.data().cust_email	
			customer.ref.collection("favorites").get().then( collection => { that.favorites = collection.size })
		})
		this.loadMap()
		this.dinersCollectionRef = this.firestore.collection('diners')
		this.dinerList = this.retrieveDiners()
	}

	ionViewWillEnter() { 
		this.loadMap()
		this.userHasOrdered()	
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomeCustPage')
		this.loadMap()
	    this.menu.enable(true)
		this.userHasOrdered()	
		this.setupSlides()
	}

	setupSlides(){
		this.slides.centeredSlides = false
		this.slides.lockSwipes(false)
	}

	slide(index){
		this.slides.slideTo(index)
	}

	menuToggle(){
		this.menu.enable(true)
		this.menu.toggle()
	}

	rad (x) {
		return x * Math.PI / 180;
	}

	getDistance (p1, p2) {
		console.log("P1", p1.lat())
		console.log("P2", p2.lat())
		var R = 6378137
		var dLat = this.rad(p2.lat() - p1.lat())
		var dLong = this.rad(p2.lng() - p1.lng())
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
				Math.sin(dLong / 2) * Math.sin(dLong / 2)
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		var d = R * c
		return (d/1000).toFixed(1)
	}

	loadMap(){
		let that = this
 
	    this.geolocation.getCurrentPosition().then( 
	    	position => {
				let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
				that.location = latLng
			}, error => {
				console.log(error.message)
			}
	    ).then( _=>{
	    	let mapOptions = {
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: that.location,
				zoom: 15
			}

			that.map = new google.maps.Map(that.mapElement.nativeElement, mapOptions)

			let marker = new google.maps.Marker({
			       map: that.map,
			       animation: google.maps.Animation.DROP,
			       position: that.location
			   })

			let content = "You are here"

			that.addInfoWindow(marker, content)
			   marker.setMap(that.map)

			var cityCircle = new google.maps.Circle({
			          strokeColor: '#00FF00',
			          strokeOpacity: 0.8,
			          strokeWeight: 2,
			          fillColor: 'transparent',
			          map: that.map,
			          center: that.location,
			          radius: 1500
			      })
	    }).catch( error => {
	    	console.log(error.message)
	    })
	}

	addDinerMarkers(){
		for (var diner of this.dinerList) {
			let latLng = new google.maps.LatLng(diner.location.latitude, diner.location.longitude)
		    let marker = new google.maps.Marker({
		        map: this.map,
		        animation: google.maps.Animation.DROP,
		        position: latLng
		    })

			let content = 
				"<h4>" + diner.name + "</h4>" +
				"<span>" + diner.address + "</span>"
			this.addInfoWindow(marker, content)
		    marker.setMap(this.map)
		}
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
		let that = this
		let _diners: any[] = []

		this.dinersCollectionRef.ref.get().then( diners => {
			diners.forEach( diner => {
				let details = {id: "", name: "", location: { latitude: 0, longitude: 0 }, distance: "0", customers: 0}
				let latLng = new google.maps.LatLng(diner.data().dine_location.latitude, diner.data().dine_location.longitude)
				that.dinersCollectionRef.doc(diner.id).collection('orders').ref.where("cleared", "==", false).get().then( pending => { details.customers = pending.size })

				details.id = diner.id
				details.name = diner.data().dine_name
				details.location = diner.data().dine_location
				details.distance = that.getDistance(that.location, latLng)

				console.log(that.location)

				_diners.push(details)
			})
		})
		.then( _=> {
			that.userHasOrdered()
			that.addDinerMarkers()
		})
		.catch( error => {
			that.alertCtrl.create({
				title: "Error",
				message: error.message,
				buttons: [{
					text: "Got it!"
				}]
			}).present()
		})
		return _diners
	}

	userHasOrdered(){
		let that = this

		this.dinerList.forEach( diner => {
			that.dinersCollectionRef.doc(diner.id).collection('orders').ref.where("customer", "==", that.uid).where("cleared", "==", false).get()
			.then( orders => {
				orders.forEach( order =>{
					that.ordered = orders.size >= 1 
					that.orderID = order.id
					that.dinerID = diner.id
				}) 
			})
		})
	}

	orderHere(id){
		if (this.ordered == undefined) {
			this.userHasOrdered()
			
			this.toastCtrl.create({
				message: "Give us a second.",
				dismissOnPageChange: true,
				position: "bottom",
				duration: 3000
			}).present()
		} else if (!this.ordered) {
			let that = this
			this.navCtrl.push(CustScanPage, {
				data: id
			})
		} else {
			this.toastCtrl.create({
				message: "You can't order again! You still have ongoing orders.",
				dismissOnPageChange: true,
				position: "bottom",
				duration: 3000
			}).present()
		}
	}

	viewMyOrder(){
		this.navCtrl.push(CustViewOrderPage, { dinerID: this.dinerID, orderID: this.orderID })
	}

	viewDiner(id){
		this.navCtrl.push(CustViewDinerPage, { dinerID: id })
	}

	openProfile(){
		this.navCtrl.push(CustProfilePage)
	}

	openFavorites(){
		this.navCtrl.push(CustFavoritesPage)
	}

	openNotifications(){
		this.navCtrl.push(CustNotificationPage)
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

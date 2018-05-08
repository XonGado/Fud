import { Component, ViewChild, ElementRef } from '@angular/core'
import { IonicPage, NavController, NavParams, MenuController, ToastController } from 'ionic-angular'

import { CustProfilePage } from '../cust-profile/cust-profile'
import { MenusPage } from '../menus/menus'
import { OrderPage } from '../order/order'
import { ComboPage } from '../combo/combo'
import { CustViewOrderPage } from '../cust-view-order/cust-view-order'

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

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
  	dinerID: any
  	orderID: any
  	ordered: boolean

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public menu: MenuController,
				public toastCtrl: ToastController,
				private fire: AngularFireAuth, 
				private firestore: AngularFirestore,
				public geolocation: Geolocation) {
		menu.enable(true)

		this.uid = fire.auth.currentUser.uid
		this.dinersCollectionRef = this.firestore.collection('diners')
		this.dinerList = this.retrieveDiners()
	}

	ionViewWillEnter() { 
		this.userHasOrdered()
		this.menu.enable(true) 
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomeCustPage')
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

			let marker = new google.maps.Marker({
			  	map: this.map,
			  	animation: google.maps.Animation.DROP,
			  	position: latLng
			})

			let content = "<h4 style='color:black!important'>Information!</h4>"         
			this.addInfoWindow(marker, content)

			marker.setMap(this.map)

			var cityCircle = new google.maps.Circle({
	            strokeColor: '#00FF00',
	            strokeOpacity: 0.8,
	            strokeWeight: 2,
	            fillColor: 'transparent',
	            map: this.map,
	            center: latLng,
	            radius: 1500
	        })

		}, (err) => {
			console.log(err)
	    })
	 
	}

	// addMarker(){
 
	// 	var latLng

	// 	this.geolocation.getCurrentPosition().then((position) => {
	// 		latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
	// 		console.log(latLng)
			

	// 	}, (err) => {
	// 		console.log(err)
	// 	})

	// }

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
		}).then( _=> {
			that.userHasOrdered()
			// console.log(that.ordered)
		})
		return _diners
	}

	userHasOrdered(){
		let that = this
		let order: any[] = []

		for (var i = 0; i < this.diner_ids.length; i++) {
			let id = this.diner_ids[i]

			this.firestore.collection('diners').doc(id).collection('orders').ref.where("customer_id", "==", that.uid).where("cleared", "==", false).get()
			.then( querySnapshot => {
				querySnapshot.forEach( doc => {
					// console.log(doc.data())
					order.push(doc.data())
					that.dinerID = id
					that.orderID = doc.id
				})
			}).then( _ => {
				// console.log(order.length)
				that.ordered = order.length >= 1
			})
		}
	}

	orderHere(index){
		if (this.ordered == undefined) {
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
		this.fire.auth.signOut()
	}

}

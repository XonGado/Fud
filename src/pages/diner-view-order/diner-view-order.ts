import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'

import { Geolocation } from '@ionic-native/geolocation'

import { Order } from '../../models/order.interface'

declare var google

@IonicPage()
@Component({
  selector: 'page-diner-view-order',
  templateUrl: 'diner-view-order.html',
})
export class DinerViewOrderPage {
  order_id: any
  orderDocRef: AngularFirestoreDocument<Order>
  orderedItemsColRef: any
  name: string
  items: any[] = []
  cost: any
  orderLocation: any = null
  orderType: any
  lock: boolean

  @ViewChild('map') mapElement: ElementRef
  map: any
  marker: any

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public geolocation: Geolocation,
    private fire: AngularFireAuth, 
    private firestore: AngularFirestore) {
  	this.order_id = this.navParams.get('orderID')
  	this.orderDocRef = this.firestore.collection('diners').doc(this.fire.auth.currentUser.uid).collection('orders').doc(this.order_id)
    this.orderedItemsColRef = this.orderDocRef.collection('orderedItems')
  	this.getOrderDetails()
  }

  getOrderDetails() {
  	let that = this
  	this.orderDocRef.ref.get()
  	.then(order => {
      that.firestore.collection("customers").doc(order.data().customer).ref.get().then( doc=> that.name = doc.data().cust_name)
  		that.cost = order.data().cost
      that.orderType = order.data().type

      if (order.data().type == 2) {
        that.orderLocation = order.data().location
        that.loadMap()
      }
    })
    this.orderedItemsColRef.ref.get()
    .then(items => {
      items.forEach(item => {
        let details = {id: "", name: "", price: 0, ordered: 0, lock: false}

        details.id = item.id
        details.name = item.data().item_name
        details.price = item.data().item_price
        details.ordered = item.data().item_ordered
        details.lock = item.data().lock

        that.items.push(details)
      })
  	})
  }

  clearOrder() {
    let that = this

  	this.orderDocRef.ref.update({
  		cleared: true
  	}).then( _=> {
      let id: string

      that.orderDocRef.ref.get().then( order=> id = order.data().customer ).then( _=> {
        that.firestore.collection("customers").doc(id).collection("notifications").add({
          from: that.fire.auth.currentUser.uid,
          type: 0,
          new: true,
          seen: false,
          cleared: false,
          timestamp: new Date() 
        })
      })

    	that.navCtrl.pop()
    })
  }

  ionViewDidLoad() {
  	console.log('ionViewDidLoad OrderDetailsPage');
  }

  changeLock(item){
    this.orderedItemsColRef.doc(item.id).ref.update({ lock: item.lock })
  }

  loadMap(){
 
      var latLng = new google.maps.LatLng(this.orderLocation.latitude, this.orderLocation.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)

      this.marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      })

      this.marker.setMap(this.map)

      console.log("map is set")
  }

  locksEnabled(){
    for(var item of this.items){
      if (item.lock == false) {
        return false
      }
    }
    return true
  }
}

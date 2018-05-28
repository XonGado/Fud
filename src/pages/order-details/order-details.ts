import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'

import { Geolocation } from '@ionic-native/geolocation'

import { Order } from '../../models/order.interface'

declare var google

/**
 * Generated class for the OrderDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {
  order_id: any
  orderDocRef: AngularFirestoreDocument<Order>
  orderedItemsColRef: any
  customer_name: string
  items: any[] = []
  order_cost: any
  ordereditems_id: any[] = []
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
  	this.order_id = this.navParams.get('data')
  	this.orderDocRef = this.firestore.collection('diners').doc(this.fire.auth.currentUser.uid).collection('orders').doc(this.order_id)
    this.orderedItemsColRef = this.orderDocRef.collection('OrderedItems')
  	this.getOrderDetails()
  }

  getOrderDetails() {
  	let that = this
  	this.orderDocRef.ref.get()
  	.then(doc => {
  		that.customer_name = doc.data().customer_name
  		that.order_cost = doc.data().order_cost
      that.lock = doc.data().lock
      that.orderType = doc.data().order_type

      if (doc.data().order_type == 2) {
        console.log(that.orderType)
        that.orderLocation = doc.data().location
        that.loadMap()
      } else {
        // Hide map here
      }
    })
    this.orderedItemsColRef.ref.get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        that.items.push(doc.data())
        that.ordereditems_id.push(doc.id)
      })
      for (var i = 0; i < that.items.length; i++) {
        that.items[i].lock = false
      }
  	})
  }

  clearOrder() {
  	this.orderDocRef.ref.update({
  		cleared: true
  	})
  	this.navCtrl.pop()
  }

  ionViewDidLoad() {
  	console.log('ionViewDidLoad OrderDetailsPage');
  }

  changeLock(item, index){
    let ordereditemsid = this.ordereditems_id[index]
    this.orderedItemsColRef.doc(ordereditemsid).ref.update({
      lock: item.lock
    })
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
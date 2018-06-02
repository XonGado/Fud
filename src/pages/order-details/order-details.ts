import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'

import { Geolocation } from '@ionic-native/geolocation'

import { Order } from '../../models/order.interface'

declare var google

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
  cost: any
  orderLocation: any = null
  orderType: any
  lock: boolean
  timestamp: any = {time: "", day: ""}

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
    this.orderedItemsColRef = this.orderDocRef.collection('orderedItems')
  	this.getOrderDetails()
  }

  getOrderDetails() {
  	let that = this
  	this.orderDocRef.ref.get()
  	.then(order => {
      that.firestore.collection("customers").doc(order.data().customer).ref.get().then( doc=> that.customer_name = doc.data().cust_name)
  		that.cost = order.data().cost
      that.orderType = order.data().type
      that.timestamp = that.dateParser(order.data().timestamp)

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

  dateParser(timestamp){
    var elements = timestamp.toString().split(" ")
    let time = elements[4].split(":")
    let day: any = []

    time.pop()

    if (time[0] > 12){
        time[0] -= 12
        time = time.join(":")
        time += " PM"
    } else if (time[0] == 0){
        time[0] = 12
        time = time.join(":")
        time += " AM"
    } else {
        time = time.join(":")
        time += " AM"
    }

    day.push(elements[2])
    day.push(elements[1])
    day = day.join(" ")

    return {day: day, time: time}
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
  }

  ionViewDidLoad() {
    console.log('Order details.');
  }
}
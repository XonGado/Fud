import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DinerMenuPage } from'../diner-menu/diner-menu';
import { DinerScanPage } from '../diner-scan/diner-scan';
import { DinerProfilePage } from '../diner-profile/diner-profile';
import { OrderDetailsPage } from '../order-details/order-details';

import { Order } from '../../models/order.interface'
import { DinerDetails } from '../../models/dinerdetails.interface'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

/**
 * Generated class for the HomeDinerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-diner',
  templateUrl: 'home-diner.html',
})
export class HomeDinerPage {
  uid: string
  ordersCollectionRef: AngularFirestoreCollection<Order>
  ordersList: any[] = []
  itemsList: any[] = []
  itemCount: number
  diner: AngularFirestoreDocument<DinerDetails>
  orderFilter: string = "all"

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public modalCtrl: ModalController, 
              private fire: AngularFireAuth, 
              private firestore: AngularFirestore) {
    this.uid = this.fire.auth.currentUser.uid
    this.diner = this.firestore.collection('diners').doc(this.uid)
    this.ordersCollectionRef = this.diner.collection('orders')
    this.getOrders()

  }

  ionViewDidLoad() {
    console.log(this.uid)
    console.log('ionViewDidLoad HomeDinerPage');
  }

  getOrders() {
    let that = this
    this.ordersCollectionRef.ref.get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        that.ordersList.push(doc.data())
      })
      that.getItems()
    })
  }

  correctOrderType(type){
    if (this.orderFilter == "all") {
      return true
    }

    return this.convertType(type) == this.orderFilter
  }

  convertType(type){
    if (type == 0) {
      return "dine-in"
    } else if (type == 1) {
      return "take-out"
    } else if (type == 2) {
      return "delivery"
    }
  }

  getItems() {
    let that = this
    let count: number = 0
    this.ordersList.forEach(doc => {
      that.itemsList = doc.items
    })
    this.itemsList.forEach(doc => {
      count = count + Number(doc.item_ordered)
    })
    this.itemCount = count
  }

  logout(){
    this.fire.auth.signOut();
  	this.navCtrl.pop();
  }

  openProfile(){
  	this.navCtrl.push(DinerProfilePage);
  }

  openMenu(){
  	this.navCtrl.push(DinerMenuPage);
  }

  openScanner(){
  	this.navCtrl.push(DinerScanPage);
  }

  openOrderDetails(){
    this.navCtrl.push(OrderDetailsPage);
  }
}

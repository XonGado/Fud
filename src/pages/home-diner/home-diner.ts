import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, MenuController } from 'ionic-angular';
import { DinerMenuPage } from'../diner-menu/diner-menu';
import { DinerScanPage } from '../diner-scan/diner-scan';
import { DinerProfilePage } from '../diner-profile/diner-profile';
import { OrderDetailsPage } from '../order-details/order-details';
import { DinerOrderHistoryPage } from '../diner-order-history/diner-order-history'

import { Order } from '../../models/order.interface'
import { DinerDetails } from '../../models/dinerdetails.interface'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'

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
  order_ids: any[] = []
  user: object = {
    name: 'sample',
    email: 'sample'
  }

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public menu: MenuController,
              public modalCtrl: ModalController, 
              private fire: AngularFireAuth, 
              private firestore: AngularFirestore) {
    this.menu.enable(true)
    this.uid = this.fire.auth.currentUser.uid
    this.diner = this.firestore.collection('diners').doc(this.uid)
    this.diner.ref.get().then( doc => { 
      this.user = { 
        name: doc.data().dine_owner_name, 
        email: doc.data().dine_email 
      }
    })
    this.ordersCollectionRef = this.diner.collection('orders')
  }

  ionViewWillEnter() { 
    this.getOrders()
    this.menu.enable(true)
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeDinerPage');
    this.menu.enable(true)
  }

  getOrders() {
    let that = this
    this.ordersList = []
    this.order_ids = []

    this.ordersCollectionRef.ref.where("cleared", "==", false).orderBy("orderNumber", "asc").get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        that.ordersList.push(doc.data())
        that.order_ids.push(doc.id)
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

  openOrderDetails(index){
    let that = this
    this.navCtrl.push(OrderDetailsPage, {
      data: that.order_ids[index]
    });
  }

  openOrderHistory(){
    this.navCtrl.push(DinerOrderHistoryPage)
  }
}

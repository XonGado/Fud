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
  selector: 'page-diner-home',
  templateUrl: 'diner-home.html',
})
export class DinerHomePage {
  uid: string
  ordersCollectionRef: AngularFirestoreCollection<Order>
  orderedItemsColRef: any
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
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeDinerPage');
    this.menu.enable(true)
  }

  menuToggle(){
    this.menu.enable(true)
    this.menu.toggle()
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

  logout(){
    this.fire.auth.signOut();
  }

  openProfile(){
  	this.navCtrl.push(DinerProfilePage);
  }

  openMenu(){
  	this.navCtrl.push(DinerMenuPage);
  }

  openGenerator(){
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
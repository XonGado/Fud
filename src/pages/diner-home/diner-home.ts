import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ModalController, MenuController } from 'ionic-angular'
import { DinerMenuPage } from'../diner-menu/diner-menu'
import { DinerScanPage } from '../diner-scan/diner-scan'
import { DinerProfilePage } from '../diner-profile/diner-profile'
import { OrderDetailsPage } from '../order-details/order-details'
import { DinerOrderHistoryPage } from '../diner-order-history/diner-order-history'
import { DinerNotificationPage } from '../diner-notification/diner-notification'

import { Order } from '../../models/order.interface'
import { DinerDetails } from '../../models/dinerdetails.interface'
import { Notification } from '../../models/notification.interface'

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
  selector: 'page-diner-home',
  templateUrl: 'diner-home.html',
})
export class DinerHomePage {
  uid: string
  ordersCollectionRef: AngularFirestoreCollection<Order>
  ordersCollectionRef$: Observable<Order[]>
  notifsCollectionRef: AngularFirestoreCollection<Notification>
  notifsCollectionRef$: Observable<Notification[]>
  newNotificationCount: any = ""
  diner: AngularFirestoreDocument<DinerDetails>
  ordersList: any[] = []
  orderFilter: string = "all"
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
    let that = this

    this.uid = this.fire.auth.currentUser.uid
    this.diner = this.firestore.collection('diners').doc(this.uid)
    this.diner.ref.get().then( doc => { 
      this.user = { 
        name: doc.data().dine_owner_name, 
        email: doc.data().dine_email 
      }
    })
    this.ordersCollectionRef = this.diner.collection('orders')
    this.ordersCollectionRef$ = this.ordersCollectionRef.valueChanges()
    this.ordersCollectionRef$.subscribe( collection => {
      this.ordersCollectionRef.ref.where("cleared", "==", false).orderBy("orderNumber", "asc").get()
      .then( orders=> {
        let list = []

        orders.forEach( order=> {
          let details = { id: "", customer: "", cost: 0, cleared: true, type: 0, totalItems: 0, orderNumber: 0 }

          details.id = order.id
          details.type = order.data().type
          details.cost = order.data().cost
          details.cleared = order.data().cleared
          details.totalItems = order.data().totalItems
          details.orderNumber = order.data().orderNumber
          that.firestore.collection("customers").doc(order.data().customer).ref.get().then( doc => { details.customer = doc.data().cust_name}).then( _=> {
            list.push(details)
          })
        })

        that.ordersList = list
      })
    })

    this.notifsCollectionRef = this.diner.collection('notifications')
    this.notifsCollectionRef$ = this.notifsCollectionRef.valueChanges()
    this.notifsCollectionRef$.subscribe( collection => {
      this.newNotificationCount = collection.length
    })
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeDinerPage');
    this.menu.enable(true)
  }

  menuToggle(){
    this.menu.enable(true)
    this.menu.toggle()
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
  	this.navCtrl.push(DinerProfilePage)
  }

  openNotifications(){
    this.navCtrl.push(DinerNotificationPage)
  }

  openMenu(){
  	this.navCtrl.push(DinerMenuPage);
  }

  openGenerator(){
  	this.navCtrl.push(DinerScanPage);
  }

  openOrderDetails(id){
    this.navCtrl.push(OrderDetailsPage, { data: id })
  }

  openOrderHistory(){
    this.navCtrl.push(DinerOrderHistoryPage)
  }
}

import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ModalController, MenuController, ToastController } from 'ionic-angular'
import { DinerMenuPage } from'../diner-menu/diner-menu'
import { DinerScanPage } from '../diner-scan/diner-scan'
import { DinerProfilePage } from '../diner-profile/diner-profile'
import { OrderDetailsPage } from '../order-details/order-details'
import { DinerOrderHistoryPage } from '../diner-order-history/diner-order-history'
import { DinerNotificationPage } from '../diner-notification/diner-notification'
import { DinerFanbasePage } from '../diner-fanbase/diner-fanbase'

import { Order } from '../../models/order.interface'
import { DinerDetails } from '../../models/dinerdetails.interface'
import { Notification } from '../../models/notification.interface'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

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
  fansCollectionRef: AngularFirestoreCollection<any>
  fansCollectionRef$: Observable<any[]>
  diner: AngularFirestoreDocument<DinerDetails>
  newNotificationCount: number = 0
  orderFilter: string = "all"
  ordersList: any[] = []
  fans: number = 0
  user: object = {
    name: 'sample',
    email: 'sample'
  }

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public menu: MenuController,
              public modalCtrl: ModalController, 
              public toastCtrl: ToastController,
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
          let details = { id: "", customer: "", cost: 0, cleared: true, type: 0, totalItems: 0, orderNumber: 0 , timestamp: {}}

          details.id = order.id
          details.type = order.data().type
          details.cost = order.data().cost
          details.cleared = order.data().cleared
          details.totalItems = order.data().totalItems
          details.orderNumber = order.data().orderNumber
          details.timestamp = that.dateParser(order.data().timestamp)
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
      this.notifsCollectionRef.ref.where("seen", "==", false).get().then( newNotifications => {
        console.log(newNotifications.size)
        that.newNotificationCount = newNotifications.size
        if (newNotifications.size > 0) {
          that.toastCtrl.create({
            message: "New notification!",
            duration: 3000,
            position: "bottom",
            showCloseButton: true
          }).present()
        }
      })
    })

    this.fansCollectionRef = this.diner.collection('fans')
    this.fansCollectionRef$ = this.fansCollectionRef.valueChanges()
    this.fansCollectionRef$.subscribe( fans => {
      if (fans != undefined) {
        that.fans = fans.length
      }
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

  dateParser(timestamp){
    console.log(timestamp.toString())
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

    // Mon May 28 2018 
    console.log(elements)

    return {day: day, time: time}
  }

  logout(){
    this.fire.auth.signOut();
  }

  openProfile(){
  	this.navCtrl.push(DinerProfilePage)
  }

  openFanbase(){
    this.navCtrl.push(DinerFanbasePage)
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

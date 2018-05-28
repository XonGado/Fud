import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreModule, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

import { Notification } from '../../models/notification.interface'
import { Customer } from '../../models/customer.interface'
import { Diner } from '../../models/diner.interface'

/**
 * Generated class for the CustNotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cust-notification',
  templateUrl: 'cust-notification.html',
})
export class CustNotificationPage {

    // Database references
    notificationsCol: AngularFirestoreCollection<Notification>
    customerDoc: AngularFirestoreDocument<Customer>
    dinerDoc: AngularFirestoreDocument<Diner>

    // User credentials
    name: string
    email: string
    username: string

    // Notification list
    notifications: Notification[]

	constructor(public navCtrl: NavController,
   			public navParams: NavParams,
   			private fire: AngularFireAuth,
   			private firestore: AngularFirestore) {
            
            this.retrieveUser()
            this.notifications = this.retrieveNotifications()
    }

    retrieveUser(){
        let that = this
		let id = this.fire.auth.currentUser.uid

        this.customerDoc = this.firestore.collection("customers").doc(id)
        this.customerDoc.ref.get().then( doc => {
            if (doc.exists) {
                that.name = doc.data().cust_name
                that.email = doc.data().cust_email
                that.username = doc.data().cust_username
            }
        })
    }

    // Load notifications function
    retrieveNotifications(){
        let that = this
        let notifications: Notification[] = []
        let id = this.fire.auth.currentUser.uid

        this.customerDoc = this.firestore.collection("customers").doc(id)
        this.notificationsCol = this.customerDoc.collection("notifications")
        this.notificationsCol.ref.where("cleared", "==", false).get().then( collection => {
            collection.forEach( notification => {
                notification.ref.update({ seen: true })

                let details: Notification = {id: "", type: 0, from: "", new: true, seen: false, cleared: false, timestamp: ""}

                this.firestore.collection("diners").doc(notification.data().from).ref.get().then( doc=> { details.from = doc.data().dine_name }) 
                details.id = notification.id
                details.new = notification.data().new
                details.type = notification.data().type
                details.seen = notification.data().seen
                details.cleared = notification.data().cleared
                details.timestamp = notification.data().timestamp

                notifications.push(details)
            })
        })

        return notifications
    }

    clear(id, index){
        this.firestore.collection("customers").doc(this.fire.auth.currentUser.uid).collection("notifications").doc(id).ref.update({ cleared: true })
        this.notifications[index].cleared = true
    }

    ionViewDidLoad() {
        console.log("Loaded user's notifications.");
    }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreModule, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

import { Notification } from '../../models/notification.interface'
import { Customer } from '../../models/customer.interface'
import { Diner } from '../../models/diner.interface'

@IonicPage()
@Component({
  selector: 'page-diner-notification',
  templateUrl: 'diner-notification.html',
})
export class DinerNotificationPage {

    // Database references
    notificationsCol: AngularFirestoreCollection<Notification>
    dinerDoc: AngularFirestoreDocument<Diner>

    // Diner credentials
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

        this.dinerDoc = this.firestore.collection("diners").doc(id)
        this.dinerDoc.ref.get().then( doc => {
            if (doc.exists) {
                that.name = doc.data().dine_name
                that.email = doc.data().dine_email
                that.username = doc.data().dine_username
            }
        })
    }

    // Load notifications function
    retrieveNotifications(){
        let that = this
        let notifications: Notification[] = []
        let id = this.fire.auth.currentUser.uid

        this.dinerDoc = this.firestore.collection("diners").doc(id)
        this.notificationsCol = this.dinerDoc.collection("notifications")
        this.notificationsCol.ref.where("cleared", "==", false).get().then( collection => {
            collection.forEach( notification => {

                let details: any = {id: "", type: 0, from: "", new: true, seen: false, cleared: false, timestamp: {}}

                this.firestore.collection("customers").doc(notification.data().from).ref.get().then( doc=> { details.from = doc.data().cust_name }) 
                    details.id = notification.id
                    details.new = notification.data().new
                    details.type = notification.data().type
                    details.seen = notification.data().seen
                    details.cleared = notification.data().cleared
                    details.timestamp = that.dateParser(notification.data().timestamp)

                    notification.ref.update({ seen: true })
                    notifications.push(details)
            })
        })

        return notifications
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

    clear(id, index){
        this.firestore.collection("diners").doc(this.fire.auth.currentUser.uid).collection("notifications").doc(id).ref.update({ cleared: true })
        this.notifications[index].cleared = true
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DinerNotificationPage');
    }

}

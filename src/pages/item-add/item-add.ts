import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { Item } from '../../models/item.model';
import { Customer } from '../../models/customer.interface';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the ItemAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item-add',
  templateUrl: 'item-add.html',
})
export class ItemAddPage {
  @ViewChild('item_name') item_name;
  @ViewChild('item_type') item_type;
  @ViewChild('item_price') item_price;
  @ViewChild('item_description') item_description;

  items: Observable<Item[]>;
  itemsCollectionRef: AngularFirestoreCollection<Item>;
  customers: AngularFirestoreCollection<Customer>
  customer: AngularFirestoreCollection<Customer>
  uid: string

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private firestore: AngularFirestore, 
    private fire: AngularFireAuth){
    this.uid = this.fire.auth.currentUser.uid
    this.itemsCollectionRef = this.firestore.collection('diners').doc(this.uid).collection('items')
    this.items = this.itemsCollectionRef.valueChanges()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemAddPage');
  }

  addItem(){
    let that = this
    let loading = this.loadingCtrl.create({content: `<ion-spinner name="cresent"></ion-spinner>`})
    loading.present()

    let id = this.firestore.createId()
    this.itemsCollectionRef.doc(id).set({
      item_id: id,
      item_name: this.item_name.value,
      item_description: this.item_description.value,
      item_price: this.item_price.value,
      item_type: this.item_type.value,
      item_availability: true,
      item_visibility: true,
      lock: false
    })
    .then(_=>{
      let alert = that.alertCtrl.create({
        title: "Food added!",
        message: "The customers can't wait to try this out.",
        buttons: [{
          text: "Nice!",
          handler: _=>{ that.navCtrl.pop() }
        }]
      })

      loading.dismiss()
      alert.present()
    })

    this.firestore.collection("diners").doc(this.uid).collection("fans").ref.get().then( fans => {
      fans.forEach( fan => {
        let notificationID = that.firestore.createId()
        that.firestore.collection("customers").doc(fan.id).collection("notifications").doc(notificationID).set({
          id: notificationID,
          from: that.uid,
          type: 1,
          new: true,
          seen: false,
          cleared: false,
          timestamp: new Date()
        }).catch(error => {
          that.alertCtrl.create({
            title: "Error",
            message: error.message,
            buttons: [{ text: "Got it" }]
          }).present()
        })
      })
    })

    .catch(function (error){
      console.log("Error: ", error.code)
    })
  }
}

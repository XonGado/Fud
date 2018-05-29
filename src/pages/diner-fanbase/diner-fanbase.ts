import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Order } from '../../models/order.interface'
import { DinerDetails } from '../../models/dinerdetails.interface'
import { Notification } from '../../models/notification.interface'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

@IonicPage()
@Component({
  selector: 'page-diner-fanbase',
  templateUrl: 'diner-fanbase.html',
})
export class DinerFanbasePage {

	fansCollectionRef: AngularFirestoreCollection<any>
  fansCollectionRef$: Observable<any[]>
  fans: any = []

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	private fire: AngularFireAuth,
  	private firestore: AngularFirestore) {
  	let that = this

  	this.fansCollectionRef = this.firestore.collection("diners").doc(this.fire.auth.currentUser.uid).collection('fans')
    this.fansCollectionRef$ = this.fansCollectionRef.valueChanges()
    this.fansCollectionRef$.subscribe( fans => {
    	fans.forEach( fan => {
    		let details = {id: "", name: ""}

	    	details.id = fan.id
	    	that.firestore.collection("customers").doc(fan.id).ref.get().then( customer => { details.name = customer.data().cust_name })
    		
    		that.fans.push(details)
    	})

    	console.log(fans)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DinerFanbasePage');
  }

}

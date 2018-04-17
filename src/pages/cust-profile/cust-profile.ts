import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'

import { AngularFirestore, AngularFirestoreModule, AngularFirestoreCollection } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

import { Customer } from '../../models/customer.model'

/**
 * Generated class for the CustProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-cust-profile',
	templateUrl: 'cust-profile.html',
})
export class CustProfilePage {
	uid: string
	user: Customer
	customerCollectionRef: AngularFirestoreCollection<Customer>

	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
				private fire: AngularFireAuth,
				private firestore: AngularFirestore) {

		this.uid = fire.auth.currentUser.uid
		this.customerCollectionRef = this.firestore.collection('customers')

		let that = this
		this.firestore.collection('customers').doc(this.uid).ref.get()
		.then(function(doc){
			if (doc.exists) {
				that.user = doc.data()
				console.log(that.user)
			} else {
				console.log("No such user with this ID.")
			}
		})
		.catch(error => {
			console.log(error.message)
		})
		
	}

	async retrieveUser(){
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CustProfilePage')
	}

}

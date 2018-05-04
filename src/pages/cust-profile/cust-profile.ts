import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular'

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
	customerCollectionRef: AngularFirestoreCollection<Customer>
	user: Customer

	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
				public loadingCtrl: LoadingController,
				private fire: AngularFireAuth,
				private firestore: AngularFirestore) {

		this.user.cust_name = ''
		this.user.cust_email = ''
		this.user.cust_username = ''

		let that = this

		let loading = this.loadingCtrl.create({
			dismissOnPageChange: true,
			content: `<ion-spinner name="cresent"></ion-spinner>`
	    });

		loading.present()
		.then(function(){
			that.uid = fire.auth.currentUser.uid
			that.customerCollectionRef = that.firestore.collection('customers')

			that.firestore.collection('customers').doc(that.uid).ref.get()
			.then(function(doc){
				if (doc.exists) {
					that.user.cust_name = doc.data().cust_name
					that.user.cust_email = doc.data().cust_email
					that.user.cust_username = doc.data().cust_username
					console.log(that.user)
					loading.dismiss();
				} else {
					console.log("No such user with this ID.")
					loading.dismiss();
				}
			})
			.catch(error => {
				console.log(error.code)
				console.log(error.message)
				loading.dismiss();
			})
		})
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CustProfilePage')
	}

}

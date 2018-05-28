import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreModule, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

import { CustViewDinerPage } from '../cust-view-diner/cust-view-diner'

import { Diner } from '../../models/diner.interface'
import { Customer } from '../../models/customer.interface'

@IonicPage()
@Component({
  selector: 'page-cust-favorites',
  templateUrl: 'cust-favorites.html',
})
export class CustFavoritesPage {

	favorites: AngularFirestoreCollection<Diner>
	user: AngularFirestoreDocument<Customer>
	diners: any[] = []

	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
  				private fire: AngularFireAuth,
   				private firestore: AngularFirestore) {
		let that = this

		this.firestore.collection("customers").doc(this.fire.auth.currentUser.uid).collection("favorites").ref.get().then( favorites=> {
			favorites.forEach( diner=> {
				let details = {name: "", id: ""}

				details.id = diner.id
				that.firestore.collection("diners").doc(diner.id).ref.get().then( doc=> { details.name = doc.data().dine_name })

				that.diners.push(details)
			})
		})
	}

	viewDiner(id){
		this.navCtrl.push(CustViewDinerPage, { dinerID: id })
	}

	ionViewDidLoad() {
		console.log('Here are your favorites');
	}	

}

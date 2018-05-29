import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ComboAddPage } from '../combo-add/combo-add'

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Diner } from '../../models/diner.model'

/**
 * Generated class for the ComboSelectDinerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-combo-select-diner',
  templateUrl: 'combo-select-diner.html',
})
export class ComboSelectDinerPage {

	uid: string
	dinerList: Diner[];
  	dinersCollectionRef: AngularFirestoreCollection<Diner>

	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
				private fire: AngularFireAuth, 
				private firestore: AngularFirestore) {
		this.uid = fire.auth.currentUser.uid
		this.dinersCollectionRef = this.firestore.collection('diners')
		this.dinerList = this.retrieveDiners()
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ComboSelectDinerPage');
	}

	retrieveDiners(){
		let diners: any[] = []
		let that = this

		this.firestore.collection("customers").doc(this.fire.auth.currentUser.uid).collection("favorites").ref.get()
		.then( favorites => {
			favorites.forEach( favorite => {
				this.dinersCollectionRef.doc(favorite.id).ref.get().then( diner => {
					let details = { id: "", name: ""}
					details.id = diner.id
					details.name = diner.data().dine_name
					diners.push(details)
				})
			})
		})
		return diners
	}

	loadDinerMenu(id){
		this.navCtrl.push(ComboAddPage, { dinerID: id })
	}

}

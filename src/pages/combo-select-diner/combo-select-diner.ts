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
  	diner_ids: any[] = []

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
		let _diners: any[] = []
		let that = this
		this.dinersCollectionRef.ref.get()
		.then(function(querySnapshot){
			querySnapshot.forEach(function(doc){
				_diners.push(doc.data())
				that.diner_ids.push(doc.id)
			})
		})
		return _diners
	}

	loadDinerMenu(index){
		let that = this
		this.navCtrl.push(ComboAddPage, {
			data: that.diner_ids[index]
		})
	}

}

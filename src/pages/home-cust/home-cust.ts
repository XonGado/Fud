import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular'

import { CustProfilePage } from '../cust-profile/cust-profile'
import { MenusPage } from '../menus/menus'
import { OrderPage } from '../order/order'
import { ComboPage } from '../combo/combo'

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
// import { Observable } from 'rxjs/Observable'

import { Diner } from '../../models/diner.model'

/**
 * Generated class for the HomeCustPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-cust',
  templateUrl: 'home-cust.html',
})
export class HomeCustPage {
	uid: string
	dinerList: Diner[];
  	dinersCollectionRef: AngularFirestoreCollection<Diner>
  	diner_ids: any[] = []

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public menu: MenuController,
				private fire: AngularFireAuth, 
				private firestore: AngularFirestore) {
		menu.enable(true)

		this.uid = fire.auth.currentUser.uid
		this.dinersCollectionRef = this.firestore.collection('diners')
		this.dinerList = this.retrieveDiners()
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

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomeCustPage')
		this.openCombo()
	}

	openProfile(){
		this.navCtrl.push(CustProfilePage)
	}

	openCombo(){
		this.navCtrl.push(ComboPage)
	}

	orderHere(index){
		let that = this
		this.navCtrl.push(OrderPage, {
			data: that.diner_ids[index]
		})
	}

	openMenus(){
		this.navCtrl.push(MenusPage)
	}

	logout(){
		this.navCtrl.pop()
	}


}

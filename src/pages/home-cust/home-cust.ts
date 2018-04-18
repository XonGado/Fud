import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular'

import { CustProfilePage } from '../cust-profile/cust-profile'
import { MenusPage } from '../menus/menus'
import { OrderPage } from '../order/order'
import { ComboPage } from '../combo/combo'

import { AngularFirestore, AngularFirestoreModule, AngularFirestoreCollection } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

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
	diners: Observable<Diner[]>
  	dinersCollectionRef: AngularFirestoreCollection<Diner>

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public menu: MenuController,
				private fire: AngularFireAuth, 
				private firestore: AngularFirestore) {
		menu.enable(true)

		this.uid = fire.auth.currentUser.uid
		this.dinersCollectionRef = this.firestore.collection('diners')
		this.diners = this.dinersCollectionRef.valueChanges()
		this.dinerList = this.retrieveDiners()
	}

	retrieveDiners(){
		let _diners: any[] = []
		this.dinersCollectionRef.ref.get()
		.then(function(querySnapshot){
			querySnapshot.forEach(function(doc){
				_diners.push(doc.data());
			})
		})

		return _diners
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomeCustPage')
		this.orderHere()
	}

	openProfile(){
		this.navCtrl.push(CustProfilePage)
	}

	openCombo(){
		this.navCtrl.push(ComboPage)
	}

	orderHere(){
		this.navCtrl.push(OrderPage)
	}

	openMenus(){
		this.navCtrl.push(MenusPage)
	}

	logout(){
		this.navCtrl.pop()
	}


}

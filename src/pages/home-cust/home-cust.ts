import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { CustProfilePage } from '../cust-profile/cust-profile';
import { MenusPage } from '../menus/menus';
import { OrderPage } from '../order/order';
import { ComboPage } from '../combo/combo';

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

	constructor(public navCtrl: NavController, public navParams: NavParams, menu: MenuController) {
		menu.enable(true);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomeCustPage');
		this.orderHere();
	}

	openProfile(){
		this.navCtrl.push(CustProfilePage);
	}

	openCombo(){
		this.navCtrl.push(ComboPage);
	}

	orderHere(){
		this.navCtrl.push(OrderPage);
	}

	openMenus(){
		this.navCtrl.push(MenusPage);
	}

	logout(){
		this.navCtrl.pop();
	}


}

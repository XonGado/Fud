import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreModule, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable'

import { Item } from '../../models/item.model';

/**
 * Generated class for the ItemEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item-edit',
  templateUrl: 'item-edit.html',
})
export class ItemEditPage {
	item_id: string;

	
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.item_id = navParams.get('data');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ItemEditPage');
	}

	closePage(){
		this.navCtrl.pop();
	}
}

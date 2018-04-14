import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { ItemEditPage } from "../item-edit/item-edit";
import { ItemAddPage } from "../item-add/item-add";

import { AngularFirestore, AngularFirestoreModule, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { Item } from '../../models/item.model'

/**
 * Generated class for the DinerMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-diner-menu',
  templateUrl: 'diner-menu.html',
})
export class DinerMenuPage {
	uid: string;
	searchQuery: string = '';
	item: Item[];
  	items: Observable<Item[]>;
  	itemsCollectionRef: AngularFirestoreCollection<Item>

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private fire: AngularFireAuth, private firestore: AngularFirestore) {
		this.uid = fire.auth.currentUser.uid
		this.itemsCollectionRef = this.firestore.collection('diners').doc(this.uid).collection('items')
		this.items = this.itemsCollectionRef.valueChanges()
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DinerMenuPage');
	}

	getItems(ev: any) {
		let val = ev.target.value;
	    if (val && val.trim() != '') {
	      this.item = this.item.filter((item) => {
	        return (item.item_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
	      })
	    }
	 }

	addItem(){
		this.navCtrl.push(ItemAddPage);
	}

	editItem(item_id){
		console.log(item_id)
		this.navCtrl.push(ItemEditPage, {
			data: item_id
		});
	}

	deleteItem(item_id){
		console.log("Id: " + item_id);

		let confirm = this.alertCtrl.create({
	      title: 'Farewell delicious food',
	      message: 'Do you want to remove from the menu?',
	      buttons: [
	        {
	          text: 'Remove',
	          handler: () => {
	            console.log('Disagree clicked');
	            // Insert database queries here.
	          }
	        },
	        {
	          text: 'No!',
	          handler: () => {
	            console.log('Agree clicked');
	            // Insert database queries here.
	          }
	        }
	      ]
	    });

	    confirm.present();
	}

	closePage(){
		this.navCtrl.pop();
	}
}

interface Diner{
	name: string,
	phone: string
	address: string, 
	description: string,
}

interface Menu{
	id: string
}
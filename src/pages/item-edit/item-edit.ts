import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

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
	item_name: string;
	item_type: string;
	item_price: string;
	item_description: string;

	availability: boolean;
	visibility: boolean;

	itemsCollectionRef: AngularFirestoreCollection<Item>

	@ViewChild('name') name;
	@ViewChild('type') type;
	@ViewChild('price') price;
	@ViewChild('description') description;

	constructor(public navCtrl: NavController, 
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public navParams: NavParams, 
		private firestore: AngularFirestore, 
		private fire: AngularFireAuth) {
		this.item_id = navParams.get('data');
		this.itemsCollectionRef = this.firestore.collection('diners').doc(this.fire.auth.currentUser.uid).collection('items')
	}

	ionViewDidLoad() {
		this.fetchData(this.item_id)
		console.log('ionViewDidLoad ItemEditPage');
	}

	fetchData(item_id){
		let that = this
		this.itemsCollectionRef.doc(item_id).ref.get()
		.then(doc => {
			that.item_id = doc.data().item_id
			that.item_name = doc.data().item_name
			that.item_type = doc.data().item_type
			that.item_price = doc.data().item_price
			that.item_description = doc.data().item_description
			that.visibility = doc.data().item_visibility
			that.availability = doc.data().item_availability

			console.log("Fetched data:")
			console.log("Visibility: " + that.visibility)
			console.log("Availability: " + that.availability)
		})
		.catch(error => {
			console.log("Error: ", error.code)
		})
	}

	updateItem(){
		let that = this
		let loading = this.loadingCtrl.create({content: `<ion-spinner name="cresent"></ion-spinner>`})
		loading.present()

		this.itemsCollectionRef.doc(this.item_id).update({
			item_id: this.item_id,
			item_name: this.name.value,
			item_type: this.type.value,
			item_price: this.price.value,
			item_description: this.description.value,
			item_visibility: this.visibility,
			item_availability: this.availability
		})
		.then(_=>{
			let alert = this.alertCtrl.create({
				title: "Changed Item!",
				message: "We'll see if the customers like it!",
				buttons: [{
					text: "Okay!",
					handler: _=>{
						that.navCtrl.pop()
					}
				}]
			})

			loading.dismiss()
			alert.present()
		})
		.catch(error=>{ 
			loading.dismiss()
			that.errorAlert(error) 
		})
	}

	errorAlert(error){
		console.log(error.message)

		let errorAlert = this.alertCtrl.create({
			title: "ERROR",
			message: error.message,
			buttons: [{
				text: "Oops",
				handler: _=>{ console.log("Error alert closed.") }
			}]
		})

		errorAlert.present()
	}
}

import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { BarcodeScanner } from '@ionic-native/barcode-scanner'

@IonicPage()
@Component({
  selector: 'page-diner-scan',
  templateUrl: 'diner-scan.html',
})
export class DinerScanPage {

	qrData = null
	createdCode = null
	scannedCode = null
	dinerCode = null
	codeType: string = "favorite"

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public alertCtrl: AlertController,
				private barcodeScanner: BarcodeScanner,
				private fire: AngularFireAuth,
				private firestore: AngularFirestore) {
		let id = this.fire.auth.currentUser.uid
		this.dinerCode = id + ";0"
	  	this.codeType = "favorite"
	}

	createCode(){
		this.createdCode = this.qrData
	}

	scanCode(){
		let that = this
		let id = this.fire.auth.currentUser.uid

		this.barcodeScanner.scan().then(barcodedData =>{
			this.scannedCode = id + ";1;" + barcodedData.text
		}).catch( error => {
			that.alertCtrl.create({
				title: "Something went wrong",
				message: error.message,
				buttons:[{
					text: "Okay"
				}]
			})
		})
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DinerScanPage');
	}

}

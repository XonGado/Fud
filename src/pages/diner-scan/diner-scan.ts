import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';

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

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public alertCtrl: AlertController,
				private barcodeScanner: BarcodeScanner) {
	}

	createCode(){
		this.createdCode = this.qrData
	}

	scanCode(){
		this.barcodeScanner.scan().then(barcodedData =>{
			this.scannedCode = barcodedData.text
		})
	}

	errorAlert(error){
		let errorAlert = this.alertCtrl.create({
			title: "ERROR",
			message: error.message,
			buttons: [{
				text: "Okay",
				handler: _=>{
					console.log("Hay nako.")
				}
			}]
		})
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DinerScanPage');
	}

}

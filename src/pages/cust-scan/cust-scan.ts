import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner'

@IonicPage()
@Component({
  selector: 'page-cust-scan',
  templateUrl: 'cust-scan.html',
})
export class CustScanPage {

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
		this.scanCode()
	}

}

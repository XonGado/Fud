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

	order: any

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public alertCtrl: AlertController,
		private barcodeScanner: BarcodeScanner) {

		this.order = navParams.get('data')
		this.scannedCode = this.scanCode()
	}

	scanCode(){
		this.barcodeScanner.scan().then(barcodedData =>{
			return barcodedData.text
		})
	}

	

	ionViewDidLoad() {
		console.log('ionViewDidLoad DinerScanPage');
		this.scanCode()
	}

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner'

import { OrderPage } from '../order/order'

@IonicPage()
@Component({
  selector: 'page-cust-scan',
  templateUrl: 'cust-scan.html',
})
export class CustScanPage {

	qrData = null
	createdCode = null
	scannedCode = null

	id: any = ""

	order: any

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public alertCtrl: AlertController,
		private barcodeScanner: BarcodeScanner) {
		this.id = navParams.get('data')
	}

	scanCode(){
		let that = this
		this.barcodeScanner.scan().then(barcodedData =>{
			that.scannedCode = barcodedData.text
		}).then(() => {
			that.navCtrl.push(OrderPage, {
				data: {
					id: that.id,
					code: that.scannedCode
				}
			})
		})	
	}



	ionViewDidLoad() {
		console.log('ionViewDidLoad DinerScanPage');
		this.scanCode()
	}

}

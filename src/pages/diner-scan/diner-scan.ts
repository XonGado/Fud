import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
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

	// scanCode(){
	// 	let that = this

	// 	this.qrScanner.prepare() // show the prompt
	// 	.then(status => {
	// 		if (status.authorized) {
	// 			// Start a scan. Scanning will continue until something is detected or
	// 			// `QRScanner.cancelScan()` is called.
	// 			that.scanQRCode()
	// 		} else if (status.denied) {
	// 		// The video preview will remain black, and scanning is disabled. We can
	// 		// try to ask the user to change their mind, but we'll have to send them
	// 		// to their device settings with `QRScanner.openSettings()`.
	// 		} else {
	// 		// we didn't get permission, but we didn't get permanently denied. (On
	// 		// Android, a denial isn't permanent unless the user checks the "Don't
	// 		// ask again" box.) We can ask again at the next relevant opportunity.
	// 		}
	// 	})
	// 	.catch(error => {
	// 		this.errorAlert(error)
	// 	})
	// }

	// scanQRCode(){
	// 	this.qrScanner.scan().subscribe((text: string) => {
	// 		let alert = this.alertCtrl.create({
	// 			title: 'Scanned something!',
	// 			message: 'content: ' + text,
	// 			buttons: [{
	// 				text: "Nice! Hooray!",
	// 				handler: _=>{}
	// 			}]
	// 		})
					
	// 		alert.present()
	// 	})

	// 	// Make the webview transparent so the video preview is visible behind it.
	// 	// Be sure to make any opaque HTML elements transparent here to avoid
	// 	// covering the video.
	// 	window.document.querySelector('ion-app').classList.add('transparentBody');
	// 	this.qrScanner.show();
	// }

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

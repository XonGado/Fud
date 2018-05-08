import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
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
				private qrScanner: QRScanner,
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

	ionViewDidLoad() {
		console.log('ionViewDidLoad DinerScanPage');

		// Optionally request the permission early
		// this.qrScanner.prepare()
		// .then((status: QRScannerStatus) => {
		// 	if (status.authorized) {
		// 		console.log("You have access to the camera.");
		// 		// camera permission was granted


		// 		// start scanning
		// 		let scanSub = this.qrScanner.scan().subscribe((text: string) => {
		// 			console.log('Scanned something', text);

		// 			this.qrScanner.hide(); // hide camera preview
		// 			scanSub.unsubscribe(); // stop scanning
		// 		});

		// 		// show camera preview
		// 		this.qrScanner.show();
		// 		window.document.querySelector('ion-app').classList.add('transparent-body');

		// 		// wait for user to scan something, then the observable callback will be called

		// 	} else if (status.denied) {
		// 		console.log("You will no longer be able to access camera.")
		// 		// camera permission was permanently denied
		// 		// you must use QRScanner.openSettings() method to guide the user to the settings page
		// 		// then they can grant the permission from there
		// 	} else {
		// 		console.log("Permission denied. Ask again later.")
		// 		// permission was denied, but not permanently. You can ask for permission again at a later time.
		// 	}
		// })
		// .catch((e: any) => console.log('Error is', e));
	}

}

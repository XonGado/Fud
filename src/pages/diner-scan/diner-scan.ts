import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@IonicPage()
@Component({
  selector: 'page-diner-scan',
  templateUrl: 'diner-scan.html',
})
export class DinerScanPage {

	constructor(public navCtrl: NavController, public navParams: NavParams, private qrScanner: QRScanner) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DinerScanPage');

		// Optionally request the permission early
		this.qrScanner.prepare()
		.then((status: QRScannerStatus) => {
			if (status.authorized) {
				// camera permission was granted


				// start scanning
				let scanSub = this.qrScanner.scan().subscribe((text: string) => {
					console.log('Scanned something', text);

					this.qrScanner.hide(); // hide camera preview
					scanSub.unsubscribe(); // stop scanning
				});

				// show camera preview
				this.qrScanner.show();

				// wait for user to scan something, then the observable callback will be called

			} else if (status.denied) {
				// camera permission was permanently denied
				// you must use QRScanner.openSettings() method to guide the user to the settings page
				// then they can grant the permission from there
			} else {
				// permission was denied, but not permanently. You can ask for permission again at a later time.
			}
		})
		.catch((e: any) => console.log('Error is', e));
		/**
		* Generated class for the DinerScanPage page.
		*
		* See https://ionicframework.com/docs/components/#navigation for more info on
		* Ionic pages and navigation.
		*/
	}

}

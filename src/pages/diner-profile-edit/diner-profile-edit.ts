import { Component, ViewChild, ElementRef } from '@angular/core'
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController, LoadingController } from 'ionic-angular'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { storage, initializeApp } from 'firebase'
import { Camera, CameraOptions } from '@ionic-native/camera'
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer'

import { DinerLocatePage } from '../diner-locate/diner-locate'

import { DinerDetails } from '../../models/dinerdetails.interface'

import { Geolocation } from '@ionic-native/geolocation'

/**
 * Generated class for the DinerProfileEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google

@IonicPage()
@Component({
  selector: 'page-diner-profile-edit',
  templateUrl: 'diner-profile-edit.html',
})
export class DinerProfileEditPage {
	
	@ViewChild('map') mapElement: ElementRef
	map: any

	@ViewChild('dine_name') dine_name;
	@ViewChild('dine_username') dine_username;
	@ViewChild('dine_owner_name') dine_owner_name;
	@ViewChild('dine_email') dine_email;
	@ViewChild('dine_weblink') dine_weblink;
	@ViewChild('dine_number') dine_number;
	@ViewChild('dine_address') dine_address;
	@ViewChild('dine_password') dine_password;
	@ViewChild('dine_new_password') dine_new_password;
	@ViewChild('dine_retypePassword') dine_retypePassword;

	unsaved: boolean = false

	name: string; 
	owner_name: string; 
	username: string; 
	email: string; 
	weblink: string; 
	number: string; 
	address: string;
	dinerDocRef: AngularFirestoreDocument<DinerDetails>
	uid:string

	imageURI:any
	imageFileName:any

	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
  				public modalCtrl: ModalController,
  				public alertCtrl: AlertController,
  				public toastCtrl: ToastController,
  				public loadingCtrl: LoadingController,
  				public geolocation: Geolocation,
  				private fire: AngularFireAuth,
  				private firestore: AngularFirestore,
  				private camera: Camera,
  				private transfer: FileTransfer) {
		// initializeApp(FIREBASE_CONFIG)
  		this.uid = fire.auth.currentUser.uid
  		this.dinerDocRef = this.firestore.collection('diners').doc(this.uid)
		this.loadMap()
	}

	ionViewDidLoad() {
		this.fetchData()
  		console.log('ionViewDidLoad DinerProfileEditPage');
	}

	fetchData() {
		let that = this
		this.dinerDocRef.ref.get()
		.then(doc => {
			console.log(doc.data())
			that.address = doc.data().dine_address
			that.email = doc.data().dine_email
			that.name = doc.data().dine_name
			that.number = doc.data().dine_number
			that.owner_name = doc.data().dine_owner_name
			that.username = doc.data().dine_username
			that.weblink = doc.data().dine_weblink
		})
	}

	mapSettingsModal(){
		let locateModal = this.modalCtrl.create(DinerLocatePage);
		locateModal.present();
	}

	loadMap(){
 
	    this.geolocation.getCurrentPosition().then((position) => {
 
			let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)

			let mapOptions = {
				center: latLng,
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}

			this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)

			console.log("map is set")

		}, (err) => {
			console.log(err)
	    })
	 
	}

	saveChanges() {
		if (this.unsaved) {
			let save = this.alertCtrl.create({
				title: "Unsaved changes",
				message: 'The following were changed',
				buttons: [
				    {
				    	text: 'No',
				    	handler: () => {
				    		console.log("User doesn't want to save.");
				    	}
				    },
				    {
				    	text: 'Save',
				    	handler: () => {
				        	console.log('User wants to save.');
				    	}
				    }
			]});
			save.present();
		}
	}

	async takePhoto(){
		try {
			const options: CameraOptions = {
				quality: 50,
				targetHeight: 600,
				targetWidth: 600,
				destinationType: this.camera.DestinationType.DATA_URL,
				encodingType: this.camera.EncodingType.JPEG,
				mediaType: this.camera.MediaType.PICTURE,
				correctOrientation: true
			}

			const result = await this.camera.getPicture(options)

			const image = 'data:image/jpeg;base64,${result}'

			const pictures = storage().ref('pictures')
			pictures.putString(image, 'data_url')

		} catch (e) {
			console.error(e)
		}
	}

	getImage() {
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.FILE_URI,
			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
		}

		this.camera.getPicture(options).then((imageData) => {
			this.imageURI = imageData;
		}, (err) => {
			console.log(err);
			this.presentToast(err);
		});
	}

	uploadFile() {
		let loader = this.loadingCtrl.create({
			content: "Uploading..."
		});
		loader.present();
		const fileTransfer: FileTransferObject = this.transfer.create();

		let options: FileUploadOptions = {
			fileKey: 'ionicfile',
			fileName: 'ionicfile',
			chunkedMode: false,
			mimeType: "image/jpeg",
			headers: {}
		}

		fileTransfer.upload(this.imageURI, 'http://192.168.0.7:8100/api/uploadImage', options)
		.then((data) => {
			console.log(data+" Uploaded Successfully");
			this.imageFileName = "http://192.168.0.7:8100/static/images/ionicfile.jpg"
			loader.dismiss();
			this.presentToast("Image uploaded successfully");
		}, (err) => {
			console.log(err);
			loader.dismiss();
			this.presentToast(err);
		});
	}

	presentToast(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 3000,
			position: 'bottom'
		});

		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});

		toast.present();
	}

}

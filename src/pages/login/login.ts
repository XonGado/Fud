import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, LoadingController, MenuController, ToastController } from 'ionic-angular';

import { RegisterPage } from '../register/register';
import { DinerHomePage } from '../diner-home/diner-home';
import { CustHomePage } from '../cust-home/cust-home';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore'
import { AngularFireStorageModule } from 'angularfire2/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	@ViewChild('email') email;
	@ViewChild('password') password;

	uid: string
	enabled: boolean = false
	user: any

	constructor(
		public navCtrl: NavController,
		public menu: MenuController,
		private fire: AngularFireAuth, 
		private firestore: AngularFirestore,
		public loadingCtrl: LoadingController, 
		public toastCtrl: ToastController) { 
		this.user = this.fire.auth.currentUser
	}

	authenticateLogin() {

		let loading = this.loadingCtrl.create({
			content: `<ion-spinner name="cresent"></ion-spinner>`,
			dismissOnPageChange: true
		})

		loading.present()

		var email = this.email.value
		var password = this.password.value

		if (email != '' && password != '') {
			let that = this
			this.fire.auth.signInAndRetrieveDataWithEmailAndPassword(this.email.value, this.password.value)
			.then( data => {
				console.log(data)

				that.uid = that.fire.auth.currentUser.uid
				that.firestore.collection('users').doc(that.uid).ref.get()
				.then( user => {
					if(user.data().type == 'diners'){
						that.navCtrl.push(DinerHomePage)
					} else {
						that.navCtrl.push(CustHomePage)
					}
				})
				.catch( error => {
					that.showError(error.message);
					loading.dismiss();
				})
			})
			.catch( error => {
				that.showError(error.message);
				loading.dismiss();
			})
		} else if (email == '' && password != '') {
			this.showError("Please enter your email.");
			loading.dismiss();
		} else if (email != '' && password == '') {
			this.showError("Please enter you password.");
			loading.dismiss();
		} else {
			this.showError("Enter your credentials first.");
			loading.dismiss();
		}
	}

  showError(message) {
    let toast = this.toastCtrl.create({
    	message: message,
    	duration: 5000,
    	position: 'top',
    	cssClass: 'danger',
    	showCloseButton: true,
    	closeButtonText: 'X',
    	dismissOnPageChange: true
    })

    toast.onDidDismiss(() => {
    	console.log('Dismissed error');
    })

    toast.present();
  }

  enableButton(){
    if (this.email.value != "" && this.password.value.length >= 8) {
      this.enabled = true
    }

    this.enabled = false
  }

  login(email, password){

    this.email.value = email;
    this.password.value = password;

    this.authenticateLogin();
  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage)
  }

  ionViewDidLoad() {
    console.log('Welcome to the login page.');
  }
}



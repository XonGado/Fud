import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { RegisterPage } from '../register/register';
import { HomeCustPage } from '../home-cust/home-cust';
import { HomeDinerPage } from '../home-diner/home-diner';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore'

import { AuthProvider } from '../../providers/auth/auth'

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	@ViewChild('email') email;
	@ViewChild('password') password;

  uid: string

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private fire: AngularFireAuth, 
    private firestore: AngularFirestore, 
    public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController,
    private auth: AuthProvider) {
  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage)
  }

  authenticateLogin() {

    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: `<ion-spinner name="cresent"></ion-spinner>`
    });

    loading.present();

    var email = this.email.value; 
    var password = this.password.value;

    if (email != '' && password != '') {
      let that = this
      this.fire.auth.signInAndRetrieveDataWithEmailAndPassword(this.email.value, this.password.value)
      .then(function (data){
        that.uid = that.fire.auth.currentUser.uid
        that.firestore.collection('users').doc(that.uid).ref.get()
        .then(doc => {
          if(doc.data().type == 'diners'){
            that.navCtrl.push(HomeDinerPage)
          }else{
            that.navCtrl.push(HomeCustPage)
          }
        })
        .catch(error => {
          that.showError(error.message);
          loading.dismiss();
        })
      })
      .catch(function (error){
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
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed error');
    });

    toast.present();
  }

  ionViewDidLoad() {
    console.log('Loaded LoginPage');
  }
}



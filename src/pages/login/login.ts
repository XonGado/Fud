import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController, ToastController } from 'ionic-angular';

import { RegisterPage } from '../register/register';
import { HomeDinerPage } from '../home-diner/home-diner';
import { HomeCustPage } from '../home-cust/home-cust';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore'

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
  enabled: boolean = false

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public menu: MenuController,
    private fire: AngularFireAuth, 
    private firestore: AngularFirestore, 
    public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController) {
    this.menu.enable(true)
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

  ionViewDidLoad() {
    console.log('Loaded LoginPage');
  }
}



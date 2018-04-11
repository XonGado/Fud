import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { RegisterPage } from '../register/register';
import { HomeCustPage } from '../home-cust/home-cust';
import { HomeDinerPage } from '../home-diner/home-diner';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
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
	@ViewChild('email') email: ElementRef;
	@ViewChild('password') password: ElementRef;

  uid: string

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private fire: AngularFireAuth, 
    private firestore: AngularFirestore, 
    public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController) {
  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage)
  }

  authenticateLogin() {

    let loading = this.loadingCtrl.create({
      content: ``
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    loading.present();

    var email = this.email.nativeElement.value; 
    var password = this.password.nativeElement.value;

    // console.log(this.email.nativeElement.value);
    // console.log(this.password.nativeElement.value);

    console.log(email);
    console.log(password);

    console.log(email != '');
    console.log(password != '');
    console.log(email != '' && password != '');
    
    // console.log(this.email);
    // console.log(this.password);

    if (email != '' && password != '') {
      let that = this
      this.fire.auth.signInAndRetrieveDataWithEmailAndPassword(this.email.nativeElement.value, this.password.nativeElement.value)
      .then(function (data){
        that.uid = that.fire.auth.currentUser.uid
        that.firestore.collection('users').doc(that.uid).ref.get()
        .then(doc => {
          if(doc.data().type == 'diners'){
            loading.dismiss();
            that.navCtrl.push(HomeDinerPage)
          }else{
            loading.dismiss();
            that.navCtrl.push(HomeCustPage)
          }
        })
        .catch(error => {
          console.log(error.code);
          that.showError(error.code);
          loading.dismiss();
        })
      })
      .catch(function (error){
        console.log(error.code);
        that.showError(error.code);
        loading.dismiss();
      })
    } else if (email == '' && password != '') {
      this.showError("You forgot to enter your email!");
      loading.dismiss();
    } else if (email != '' && password == '') {
      this.showError("Haha. You need to enter your password.");
      loading.dismiss();
    } else {
      this.showError("Enter your credentials first.");
      loading.dismiss();
    }

  }

  showError(message) {
    if (message == "auth/wrong-password") {
      message = "Hhmm. You are entering a wrong password.";
    } else if (message == "auth/invalid-email") {
      message = "The email isn't a registered user in Fud.";
    } 

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



import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { RegisterPage } from '../register/register';
// import { HomeCustPage } from '../home-cust/home-cust';
// import { HomeDinerPage } from '../home-diner/home-diner';
// import { MenusPage } from '../menus/menus';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import firebase from 'firebase';

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

  customerList = firebase.database().ref('customers/')

  constructor(public navCtrl: NavController, public navParams: NavParams, private fire: AngularFireAuth, private database: AngularFireDatabase) {
  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage)
  }

  authenticateLogin() {
    var user = this.fire.auth.signInAndRetrieveDataWithEmailAndPassword(this.email.nativeElement.value, this.password.nativeElement.value)
    console.log("Customers: ", this.customerList)
  }

  ionViewDidLoad() {
    console.log('Loaded LoginPage');
  }
}



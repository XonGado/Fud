import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { RegisterPage } from '../register/register';
import { HomeCustPage } from '../home-cust/home-cust';
import { HomeDinerPage } from '../home-diner/home-diner';
import { MenusPage } from '../menus/menus';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private fire: AngularFireAuth, private database: AngularFireDatabase) {
  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

  authenticateLogin() {
    console.log("Handle login here");
    console.log(this.email.value);
    this.fire.auth.signInAndRetrieveDataWithEmailAndPassword(this.email.value, this.password.value)
    .then( data => {
      console.log("User logged in: ", this.fire.auth.currentUser);
      // this.navCtrl.setRoot(TempHomePage);
    })
    .catch( error => {
      console.log("Error: ", error);
    })

    // this.navCtrl.push(HomeDinerPage);
    // this.navCtrl.push(HomeCustPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    // this.navCtrl.push(RegisterPage);
  }
}



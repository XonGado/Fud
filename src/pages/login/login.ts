import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { RegisterPage } from '../register/register';
import { HomeCustPage } from '../home-cust/home-cust';
import { HomeDinerPage } from '../home-diner/home-diner';
import { MenusPage } from '../menus/menus';
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
	@ViewChild('username') username;
	@ViewChild('password') password;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

  authenticateLogin() {
    var username = this.username.value;
    var password = this.password.value;

    console.log("Username: " + username + "; Password: " + password);
    this.navCtrl.push(HomeDinerPage);
    // this.navCtrl.push(HomeCustPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    // this.navCtrl.push(RegisterPage);
  }
}



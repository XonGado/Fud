import { Component, ViewChild, ElementRef } from '@angular/core';
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
	@ViewChild('username') username: ElementRef;
	@ViewChild('password') password: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

  authenticateLogin() {
    var username = this.username.nativeElement.value;
    var password = this.password.nativeElement.value;

    console.log("Username: " + username + "; Password: " + password);
    this.navCtrl.push(HomeDinerPage);
    // this.navCtrl.push(HomeCustPage);
  }

  ionViewDidLoad() {
    console.log(this.username.nativeElement.value);
    console.log('ionViewDidLoad LoginPage');
    // this.navCtrl.push(RegisterPage);
  }
}



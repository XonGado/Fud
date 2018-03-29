import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

	// Customer form variables
	@ViewChild('cust_name') cust_name;
	@ViewChild('cust_username') cust_username;
	@ViewChild('cust_email') cust_email;
	@ViewChild('cust_password') cust_password;
	@ViewChild('cust_retypePassword') cust_retypePassword;

	// Diner form variables
	@ViewChild('dine_name') dine_name;
	@ViewChild('dine_username') dine_username;
	@ViewChild('dine_email') dine_email;
	@ViewChild('dine_password') dine_password;
	@ViewChild('dine_retypePassword') dine_retypePassword;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  closePage(){
  	this.navCtrl.pop();
  }

}

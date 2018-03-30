import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { RegisterCustomer } from '../../models/registercustomer.interface';
import { RegisterDiner } from '../../models/registerdiner.interface'

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

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
	@ViewChild('dine_owner_name') dine_owner_name;
	@ViewChild('dine_username') dine_username;
	@ViewChild('dine_email') dine_email;
	@ViewChild('dine_weblink') dine_weblink;
	@ViewChild('dine_number') dine_number;
	@ViewChild('dine_address') dine_address;
	@ViewChild('dine_password') dine_password;
	@ViewChild('dine_retypePassword') dine_retypePassword;

	registerCustomer = {} as RegisterCustomer;
	registerDiner = {} as RegisterDiner;

	registerCustomerRef$: AngularFireList<RegisterCustomer>
	registerDinerRef$: AngularFireList<RegisterDiner>

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: AngularFireDatabase, private fire: AngularFireAuth) {
  	this.registerCustomerRef$ = this.database.list('customers');
  	this.registerDinerRef$ = this.database.list('diners');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  createCustomer(registerCustomer: RegisterCustomer) {
  	// console.log(registerCustomer);
  	this.fire.auth.createUserWithEmailAndPassword(this.cust_email.value, this.cust_password.value)

  	.then((data) => {
  		console.log("Data: ", data);
  	})
  	.catch(error => {
  		console.log("Error: ", error);
  	})


  	this.registerCustomerRef$.push({
  		cust_name: this.registerCustomer.cust_name,
  		cust_username: this.registerCustomer.cust_username,
  		cust_email: this.registerCustomer.cust_email,
  		cust_password: this.registerCustomer.cust_password,
  		cust_retypePassword: this.registerCustomer.cust_retypePassword
  	})
  }

  createDiner(registerDiner: RegisterDiner){
  	// console.log(registerDiner);
  	this.registerDinerRef$.push({
  		dine_name: this.registerDiner.dine_name,
  		dine_owner_name: this.registerDiner.dine_owner_name,
  		dine_username: this.registerDiner.dine_username,
  		dine_email: this.registerDiner.dine_email,
  		dine_weblink: this.registerDiner.dine_weblink,
  		dine_number: this.registerDiner.dine_number,
  		dine_address: this.registerDiner.dine_address,
  		dine_password: this.registerDiner.dine_password,
  		dine_retypePassword: this.registerDiner.dine_address
  	})
  }

  closePage(){
  	this.navCtrl.pop();
  }

}

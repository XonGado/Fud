import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { RegisterCustomer } from '../../models/registercustomer.interface';
import { RegisterDiner } from '../../models/registerdiner.interface';

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
	@ViewChild('cust_email') cust_email;
	@ViewChild('cust_password') cust_password;
	@ViewChild('cust_retypePassword') cust_retypePassword;

	// Diner form variables
	@ViewChild('dine_email') dine_email;
	@ViewChild('dine_password') dine_password;
	@ViewChild('dine_retypePassword') dine_retypePassword;

	registerCustomer = {} as RegisterCustomer;
	registerDiner = {} as RegisterDiner;

	registerCustomerRef$: AngularFireList<RegisterCustomer>
	registerDinerRef$: AngularFireList<RegisterDiner>

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: AngularFireDatabase, private fire: AngularFireAuth) {
  	this.registerCustomerRef$ = this.database.list('customers')
  	this.registerDinerRef$ = this.database.list('diners')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  createCustomer(registerCustomer: RegisterCustomer) {
    if ((this.cust_password.value == this.cust_retypePassword.value) && (this.cust_password.value.length >= 8 && this.cust_password.value.length <= 20)){
      let that = this
    	this.fire.auth.createUserWithEmailAndPassword(this.cust_email.value, this.cust_password.value)
    	.then(function (data) {
        that.fire.auth.signInAndRetrieveDataWithEmailAndPassword(that.cust_email.value, that.cust_password.value)
        .then(function (data){
          console.log("Data: ", data)
          // that.navCtrl.push(HomeCustPage)
        })
        .catch(function (error){
          console.log("Error: ", error)
        })
        that.registerCustomerRef$.push({
          uid: that.fire.auth.currentUser.uid,
          cust_name: that.registerCustomer.cust_name,
          cust_username: that.registerCustomer.cust_username,
          cust_email: that.registerCustomer.cust_email
        })
    	})
    	.catch(function (error) {
        console.log("Error: ", error)
    	})
    }
    else{
      if (this.cust_password.value != this.cust_retypePassword.value){
        console.log("Passwords do not match.")
      }
      if (this.cust_password.value.length < 8 || this.cust_password.value.length > 20){
       
        console.log("Password should be 8 characters.");
      }
    }
  }

  createDiner(registerDiner: RegisterDiner){
    if ((this.dine_password.value == this.dine_retypePassword.value) && (this.dine_password.value.length >=8 && this.dine_password.value.length <= 20)){
      let that = this
    	this.fire.auth.createUserWithEmailAndPassword(this.dine_email.value, this.dine_password.value)
    	.then(function (data) {
        that.fire.auth.signInAndRetrieveDataWithEmailAndPassword(that.dine_email.value, that.dine_password.value)
        .then(function (data){
          console.log("Data: ", data)
          // that.navCtrl.push(HomeDinerPage)
        })
        .catch( function (error){
          console.log("Error: ", error)
        })
        that.registerDinerRef$.push({
          uid: that.fire.auth.currentUser.uid,
          dine_name: that.registerDiner.dine_name,
          dine_owner_name: that.registerDiner.dine_owner_name,
          dine_username: that.registerDiner.dine_username,
          dine_email: that.registerDiner.dine_email,
          dine_weblink: that.registerDiner.dine_weblink,
          dine_number: that.registerDiner.dine_number,
          dine_address: that.registerDiner.dine_address
        })
    	})
    	.catch(error => {
    		console.log("Error: ", error)
    	})
    }
    else{
      if (this.dine_password.value != this.dine_retypePassword.value){
        console.log("Passwords do not match.")
      }
      if (this.dine_password.value.length < 8 || this.dine_retypePassword.value.length > 20 ){
        console.log("Password should be 8 characters.");
      }
    }
  }

  closePage(){
  	this.navCtrl.pop();
  }
}
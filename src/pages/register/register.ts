import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

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
	@ViewChild('dine_owner_name') dine_owner_name;
	@ViewChild('dine_email') dine_email;
	@ViewChild('dine_weblink') dine_weblink;
	@ViewChild('dine_number') dine_number;
	@ViewChild('dine_address') dine_address;
	@ViewChild('dine_password') dine_password;
	@ViewChild('dine_retypePassword') dine_retypePassword;

  uid: string;
  acctype: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private firestore: AngularFirestore, 
              private fire: AngularFireAuth, 
              public toastCtrl: ToastController) {
  	this.acctype = "customer";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  createCustomer() {
    if ((this.cust_password.value == this.cust_retypePassword.value) && (this.cust_password.value.length >= 8 && this.cust_password.value.length <= 20)){
      let that = this
      this.fire.auth.createUserWithEmailAndPassword(this.cust_email.value, this.cust_password.value)
      .then(function (data) {
        that.fire.auth.signInAndRetrieveDataWithEmailAndPassword(that.cust_email.value, that.cust_password.value)
        .then(function (data){
          that.uid = that.fire.auth.currentUser.uid
          that.firestore.doc('customers/'+that.uid).set({
            cust_name: that.cust_name.value,
            cust_username: that.cust_username.value,
            cust_email: that.cust_email.value
          })
          that.firestore.doc('users/'+that.uid).set({
            type: 'customers'
          })
          that.showToast("You have successfully created an account!");
        })
        .catch(function (error){
          that.showToast(error.message);
          console.log("Error: ", error)
        })
      })
      .catch(function (error) {
        that.showToast(error.message);
        console.log("Error: ", error)
      })
    }
    else{
      if (this.cust_password.value != this.cust_retypePassword.value){
        this.showToast("Passwords do not match.");
        console.log("Passwords do not match.")
      }
      if (this.cust_password.value.length < 8 || this.cust_password.value.length > 20){
        this.showToast("Password should be 8 characters.");
        console.log("Password should be 8 characters.");
      }
    }
  }

  createDiner(){
    if ((this.dine_password.value == this.dine_retypePassword.value) && (this.dine_password.value.length >=8 && this.dine_password.value.length <= 20)){
      let that = this
      this.fire.auth.createUserWithEmailAndPassword(this.dine_email.value, this.dine_password.value)
      .then(function (data) {
        that.fire.auth.signInAndRetrieveDataWithEmailAndPassword(that.dine_email.value, that.dine_password.value)
        .then(function (data){
          that.uid = that.fire.auth.currentUser.uid
          that.firestore.doc('diners/'+that.uid).set({
            dine_name: that.dine_name.value,
            dine_username: that.dine_username.value,
            dine_owner_name: that.dine_owner_name.value,
            dine_email: that.dine_email.value,
            dine_weblink: that.dine_weblink.value,
            dine_number: that.dine_number.value,
            dine_address: that.dine_address.value,
            dine_location: { 
              latitude: 0,
              longitude: 0 
            }
          })
          that.firestore.doc('users/'+that.uid).set({
            type: 'diners'
          })

          that.showToast("You have successfully created an account!");
        })
        .catch( function (error){
          that.showToast(error.message)
          console.log("Error: ", error)
        })
      })
      .catch(error => {
        that.showToast(error.message)
        console.log("Error: ", error)
      })
    }
    else{
      if (this.dine_password.value != this.dine_retypePassword.value){
        this.showToast("Passwords do not match.")
        console.log("Passwords do not match.")
      }
      if (this.dine_password.value.length < 8 || this.dine_retypePassword.value.length > 20 ){
        this.showToast("Password should be 8 characters.");
        console.log("Password should be 8 characters.");
      }
    }
  }

  showToast(message) {

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

  closePage(){
  	this.navCtrl.pop();
  }
}
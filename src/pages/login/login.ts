import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { RegisterPage } from '../register/register';
import { HomeCustPage } from '../home-cust/home-cust';
import { HomeDinerPage } from '../home-diner/home-diner';
import { MenusPage } from '../menus/menus';

import { CustomerDetails } from '../../models/customerdetails.interface';
import { DinerDetails } from '../../models/dinerdetails.interface';
import { UserType } from '../../models/usertype.interface';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestoreModule, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private fire: AngularFireAuth, private database: AngularFireDatabase, private firestore: AngularFirestore) {
  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage)
  }

  authenticateLogin() {
    let that = this
    this.fire.auth.signInAndRetrieveDataWithEmailAndPassword(this.email.nativeElement.value, this.password.nativeElement.value)
    .then(function (data){
      console.log("Data ", data)
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
        console.log('Error', error.code)
      })
    })
    .catch(function (error){
      console.log("Error ", error.code)
    })
  }

  ionViewDidLoad() {
    console.log('Loaded LoginPage');
  }
}



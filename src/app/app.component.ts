import { Component } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login'
import { HomeDinerPage } from '../pages/home-diner/home-diner'
import { HomeCustPage } from '../pages/home-cust/home-cust'

import { UserType } from '../models/usertype.interface'

import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore } from 'angularfire2/firestore'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              private fire: AngularFireAuth,
              private firestore: AngularFirestore) {
    platform.ready().then(() => {
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();  
    });

    let that = this
    this.fire.auth.onAuthStateChanged(user => {
      if (user){
        console.log(user.uid)
        that.redirectUser(user.uid)
      }
      else{
        that.rootPage = LoginPage
      }
    })
  }

  redirectUser(uid) {
    let that = this
    this.firestore.collection('users').doc(uid).ref.get()
    .then(doc => {
      if (doc.data().type == 'diners'){
        console.log("diners")
        that.rootPage = HomeDinerPage
      }else{
        console.log("customers")
        that.rootPage = HomeCustPage
      }
    })
  }
}
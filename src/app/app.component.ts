import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoadingPage } from '../pages/loading/loading'
import { LoginPage } from '../pages/login/login'
import { DinerHomePage } from '../pages/diner-home/diner-home'
import { CustHomePage } from '../pages/cust-home/cust-home'

import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore } from 'angularfire2/firestore'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoadingPage;

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
        that.rootPage = DinerHomePage
      }else{
        that.rootPage = CustHomePage
      }
    })
  }
}
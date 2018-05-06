import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'

import { HomeDinerPage } from '../../pages/home-diner/home-diner'
import { HomeCustPage } from '../../pages/home-cust/home-cust'

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  userSignedIn: string
  constructor(private fire: AngularFireAuth, private firestore: AngularFirestore) {
    let that = this
  	this.fire.auth.onAuthStateChanged(user => {
  		if(user) {
        that.userSignedIn = user.uid    
      }else{
        that.userSignedIn = null
      }
  	})
  }
}

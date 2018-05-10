import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ComboSelectDinerPage } from '../combo-select-diner/combo-select-diner'
import { ComboEditPage } from '../combo-edit/combo-edit'
import { Combo } from '../../models/combo.interface'

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'

/**
 * Generated class for the ComboPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-combo',
  templateUrl: 'combo.html',
})
export class ComboPage {

  uid: string
  combosList: any[] = []
  itemsList: any[] = []
  combosCollectionRef: AngularFirestoreCollection<Combo>
  diner: string
  itemCount: number

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private firestore: AngularFirestore,
              private fire: AngularFireAuth) {
    this.uid = this.fire.auth.currentUser.uid
    this.combosCollectionRef = this.firestore.collection('customers').doc(this.uid).collection('combos')
  }

  ionViewWillEnter() { 
    this.getCombos()
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ComboPage');
  }

  getCombos() {
    let that = this
    this.combosList = []
    this.combosCollectionRef.ref.get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(doc => {
        that.combosList.push(doc.data())
      })
      that.getItems()
    })
  }

  getItems() {
    let that = this
    let count: number = 0
    this.combosList.forEach(doc => {
      that.itemsList = doc.items
    })
    this.itemsList.forEach(doc => {
      count = count + Number(doc.item_ordered)
    })
    this.itemCount = count
  }

  openAddComboModal(){
      this.navCtrl.push(ComboSelectDinerPage)
      console.log("Opening add combo modal.");
  }

  openEditComboModal(i) {
    let combosList:any[] = this.combosList
    this.navCtrl.push(ComboEditPage,{
      data: combosList[i]
    })
  }
}

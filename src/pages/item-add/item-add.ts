import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item.model';

import { AngularFirestoreModule, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the ItemAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item-add',
  templateUrl: 'item-add.html',
})
export class ItemAddPage {
  @ViewChild('item_name') item_name: ElementRef;
  @ViewChild('item_type') item_type: ElementRef;
  @ViewChild('item_price') item_price: ElementRef;
  @ViewChild('item_description') item_description: ElementRef;

  items: Observable<Item[]>;
  itemsCollectionRef: AngularFirestoreCollection<Item>;
  uid: string

  constructor(public navCtrl: NavController, public navParams: NavParams, private firestore: AngularFirestore, private fire: AngularFireAuth){
    this.uid = this.fire.auth.currentUser.uid
    this.itemsCollectionRef = this.firestore.collection('diners').doc(this.uid).collection('items')
    this.items = this.itemsCollectionRef.valueChanges()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemAddPage');
  }

  addItem(){
    let item_name = this.item_name.nativeElement.value
    let item_type = this.item_type.nativeElement.value
    let item_description = this.item_description.nativeElement.value

    this.itemsCollectionRef.add({
      item_name: this.item_name.nativeElement.value,
      item_description: this.item_description.nativeElement.value,
      item_price: this.item_price.nativeElement.value,
      item_type: this.item_type.nativeElement.value
    }).then(function (data){
      console.log("Data: ", data)
    }).catch(function (error){
      console.log("Error: ", error.code)
    })
  }
}

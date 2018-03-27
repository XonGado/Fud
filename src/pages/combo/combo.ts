import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComboPage');
  }

  closePage(){
  	this.navCtrl.pop();
  }

  openAddComboModal(){
  	console.log("Oppening add combo modal.");
  }

}

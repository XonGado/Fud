import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ItemEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item-edit',
  templateUrl: 'item-edit.html',
})
export class ItemEditPage {

	id: string;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.id = navParams.get('data');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ItemEditPage');
		console.log('Editing item of with ' + this.id + ' as ID.');
	}

	closePage(){
		this.navCtrl.pop();
	}
}

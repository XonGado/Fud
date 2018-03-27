import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenusPage } from '../menus/menus';

/**
 * Generated class for the HomeDinerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-diner',
  templateUrl: 'home-diner.html',
})
export class HomeDinerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeDinerPage');
  }

  logout(){
  	this.navCtrl.pop();
  }

  openMenus(){
  	this.navCtrl.push(MenusPage);
  }

}

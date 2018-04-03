import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenusPage } from '../menus/menus';
import { DinerScanPage } from '../diner-scan/diner-scan';
import { DinerProfilePage } from '../diner-profile/diner-profile';

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

  openProfile(){
  	this.navCtrl.push(DinerProfilePage);
  }

  openMenus(){
  	this.navCtrl.push(MenusPage);
  }

  openScanner(){
  	this.navCtrl.push(DinerScanPage);
  }

}

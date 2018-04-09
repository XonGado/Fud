import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DinerMenuPage } from'../diner-menu/diner-menu';
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

  openMenu(){
  	this.navCtrl.push(DinerMenuPage);
  }

  openScanner(){
  	this.navCtrl.push(DinerScanPage);
  }

}

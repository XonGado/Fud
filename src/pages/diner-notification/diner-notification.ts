import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-diner-notification',
  templateUrl: 'diner-notification.html',
})
export class DinerNotificationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  // Create Load Notifications function(){}

  loadNotifications(){
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DinerNotificationPage');
  }

}

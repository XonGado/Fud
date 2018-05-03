import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ComboSelectDinerPage } from '../combo-select-diner/combo-select-diner'
import { ComboEditPage } from '../combo-edit/combo-edit'

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

    constructor(public navCtrl: NavController, 
                public navParams: NavParams) {
       
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ComboPage');
    }
  
    /* 
    openAddComboModal() will open the menu of the selected menu.
    Parameters such as diner ID is passed here to be used to
    query the diner's menu.    
    */
    openAddComboModal(){
        this.navCtrl.push(ComboSelectDinerPage)
        console.log("Opening add combo modal.");
    }


    openEditComboModal(){
        this.navCtrl.push(ComboEditPage)
        console.log("Opening combo edit modal");
    }

}

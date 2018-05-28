import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustViewDinerPage } from './cust-view-diner';

@NgModule({
  declarations: [
    CustViewDinerPage,
  ],
  imports: [
    IonicPageModule.forChild(CustViewDinerPage),
  ],
})
export class CustViewCafePageModule {}

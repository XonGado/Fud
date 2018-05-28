import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustViewOrderPage } from './cust-view-order';

@NgModule({
  declarations: [
    CustViewOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(CustViewOrderPage),
  ],
})
export class CustViewOrderPageModule {}

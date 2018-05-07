import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustViewCafePage } from './cust-view-cafe';

@NgModule({
  declarations: [
    CustViewCafePage,
  ],
  imports: [
    IonicPageModule.forChild(CustViewCafePage),
  ],
})
export class CustViewCafePageModule {}

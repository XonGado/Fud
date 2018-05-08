import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustViewItemPage } from './cust-view-item';

@NgModule({
  declarations: [
    CustViewItemPage,
  ],
  imports: [
    IonicPageModule.forChild(CustViewItemPage),
  ],
})
export class CustViewItemPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustSearchCafePage } from './cust-search-cafe';

@NgModule({
  declarations: [
    CustSearchCafePage,
  ],
  imports: [
    IonicPageModule.forChild(CustSearchCafePage),
  ],
})
export class CustSearchCafePageModule {}

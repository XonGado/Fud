import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustScanPage } from './cust-scan';

@NgModule({
  declarations: [
    CustScanPage,
  ],
  imports: [
    IonicPageModule.forChild(CustScanPage),
  ],
})
export class CustScanPageModule {}

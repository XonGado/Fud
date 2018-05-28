import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustLocatePage } from './cust-locate';

@NgModule({
  declarations: [
    CustLocatePage,
  ],
  imports: [
    IonicPageModule.forChild(CustLocatePage),
  ],
})
export class CustLocatePageModule {}

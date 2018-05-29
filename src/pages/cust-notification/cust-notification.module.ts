import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustNotificationPage } from './cust-notification';

@NgModule({
  declarations: [
    CustNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(CustNotificationPage),
  ],
})
export class CustNotificationPageModule {}

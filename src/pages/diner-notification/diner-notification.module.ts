import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerNotificationPage } from './diner-notification';

@NgModule({
  declarations: [
    DinerNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(DinerNotificationPage),
  ],
})
export class DinerNotificationPageModule {}

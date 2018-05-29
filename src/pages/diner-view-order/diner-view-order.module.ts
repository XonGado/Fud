import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerViewOrderPage } from './diner-view-order';

@NgModule({
  declarations: [
    DinerViewOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(DinerViewOrderPage),
  ],
})
export class DinerViewOrderPageModule {}

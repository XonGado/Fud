import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerViewCustomerPage } from './diner-view-customer';

@NgModule({
  declarations: [
    DinerViewCustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(DinerViewCustomerPage),
  ],
})
export class DinerViewCustomerPageModule {}

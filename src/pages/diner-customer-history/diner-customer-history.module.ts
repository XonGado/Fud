import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerCustomerHistoryPage } from './diner-customer-history';

@NgModule({
  declarations: [
    DinerCustomerHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(DinerCustomerHistoryPage),
  ],
})
export class DinerCustomerHistoryPageModule {}

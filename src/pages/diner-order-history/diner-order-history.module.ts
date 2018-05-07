import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerOrderHistoryPage } from './diner-order-history';

@NgModule({
  declarations: [
    DinerOrderHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(DinerOrderHistoryPage),
  ],
})
export class DinerOrderHistoryPageModule {}

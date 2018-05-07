import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerCurrentCustomersPage } from './diner-current-customers';

@NgModule({
  declarations: [
    DinerCurrentCustomersPage,
  ],
  imports: [
    IonicPageModule.forChild(DinerCurrentCustomersPage),
  ],
})
export class DinerCurrentCustomersPageModule {}

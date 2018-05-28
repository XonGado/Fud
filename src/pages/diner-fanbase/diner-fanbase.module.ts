import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerFanbasePage } from './diner-fanbase';

@NgModule({
  declarations: [
    DinerFanbasePage,
  ],
  imports: [
    IonicPageModule.forChild(DinerFanbasePage),
  ],
})
export class DinerFanbasePageModule {}

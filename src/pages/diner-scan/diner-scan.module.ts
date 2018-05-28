import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerScanPage } from './diner-scan';

@NgModule({
  declarations: [
    DinerScanPage,
  ],
  imports: [
    IonicPageModule.forChild(DinerScanPage),
  ],
})
export class DinerScanPageModule {}

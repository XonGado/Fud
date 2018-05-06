import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerLocatePage } from './diner-locate';

@NgModule({
  declarations: [
    DinerLocatePage,
  ],
  imports: [
    IonicPageModule.forChild(DinerLocatePage),
  ],
})
export class DinerLocatePageModule {}

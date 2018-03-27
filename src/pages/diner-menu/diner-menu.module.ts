import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerMenuPage } from './diner-menu';

@NgModule({
  declarations: [
    DinerMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(DinerMenuPage),
  ],
})
export class DinerMenuPageModule {}

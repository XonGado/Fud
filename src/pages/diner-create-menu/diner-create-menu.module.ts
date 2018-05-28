import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerCreateMenuPage } from './diner-create-menu';

@NgModule({
  declarations: [
    DinerCreateMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(DinerCreateMenuPage),
  ],
})
export class DinerCreateMenuPageModule {}

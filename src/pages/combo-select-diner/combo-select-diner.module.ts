import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComboSelectDinerPage } from './combo-select-diner';

@NgModule({
  declarations: [
    ComboSelectDinerPage,
  ],
  imports: [
    IonicPageModule.forChild(ComboSelectDinerPage),
  ],
})
export class ComboSelectDinerPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComboAddPage } from './combo-add';

@NgModule({
  declarations: [
    ComboAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ComboAddPage),
  ],
})
export class ComboAddPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComboEditPage } from './combo-edit';

@NgModule({
  declarations: [
    ComboEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ComboEditPage),
  ],
})
export class ComboEditPageModule {}

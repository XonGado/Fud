import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerProfileEditPage } from './diner-profile-edit';

@NgModule({
  declarations: [
    DinerProfileEditPage,
  ],
  imports: [
    IonicPageModule.forChild(DinerProfileEditPage),
  ],
})
export class DinerProfileEditPageModule {}

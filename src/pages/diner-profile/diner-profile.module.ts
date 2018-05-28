import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerProfilePage } from './diner-profile';

@NgModule({
  declarations: [
    DinerProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(DinerProfilePage),
  ],
})
export class DinerProfilePageModule {}

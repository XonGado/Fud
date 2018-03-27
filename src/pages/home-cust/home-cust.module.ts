import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeCustPage } from './home-cust';

@NgModule({
  declarations: [
    HomeCustPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeCustPage),
  ],
})
export class HomeCustPageModule {}

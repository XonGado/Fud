import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerHomePage } from './diner-home';

@NgModule({
  declarations: [
    DinerHomePage,
  ],
  imports: [
    IonicPageModule.forChild(DinerHomePage),
  ],
})
export class HomeDinerPageModule {}

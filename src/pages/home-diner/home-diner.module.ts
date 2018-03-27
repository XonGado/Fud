import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeDinerPage } from './home-diner';

@NgModule({
  declarations: [
    HomeDinerPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeDinerPage),
  ],
})
export class HomeDinerPageModule {}

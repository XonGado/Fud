import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustFavoritesPage } from './cust-favorites';

@NgModule({
  declarations: [
    CustFavoritesPage,
  ],
  imports: [
    IonicPageModule.forChild(CustFavoritesPage),
  ],
})
export class CustFavoritesPageModule {}

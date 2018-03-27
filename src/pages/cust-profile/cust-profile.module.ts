import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustProfilePage } from './cust-profile';

@NgModule({
  declarations: [
    CustProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(CustProfilePage),
  ],
})
export class CustProfilePageModule {}

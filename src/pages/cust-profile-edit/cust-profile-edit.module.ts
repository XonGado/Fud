import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustProfileEditPage } from './cust-profile-edit';

@NgModule({
  declarations: [
    CustProfileEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CustProfileEditPage),
  ],
})
export class CustProfileEditPageModule {}

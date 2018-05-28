import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuEditPage } from './menu-edit';

@NgModule({
  declarations: [
    MenuEditPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuEditPage),
  ],
})
export class MenuEditPageModule {}

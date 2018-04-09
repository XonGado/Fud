import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuCreatePage } from './menu-create';

@NgModule({
  declarations: [
    MenuCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(MenuCreatePage),
  ],
})
export class MenuCreatePageModule {}

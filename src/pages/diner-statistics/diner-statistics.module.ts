import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerStatisticsPage } from './diner-statistics';

@NgModule({
  declarations: [
    DinerStatisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(DinerStatisticsPage),
  ],
})
export class DinerStatisticsPageModule {}

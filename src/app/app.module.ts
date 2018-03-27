import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { HomeCustPage } from '../pages/home-cust/home-cust'; 

import { ComboPage } from '../pages/combo/combo';
import { CustProfilePage } from '../pages/cust-profile/cust-profile';
import { DinerProfilePage } from '../pages/diner-profile/diner-profile';
import { DinerCreateMenuPage } from '../pages/diner-create-menu/diner-create-menu';
import { DinerMenuPage } from '../pages/diner-menu/diner-menu';
import { HomeDinerPage } from '../pages/home-diner/home-diner';
import { MenuPage } from '../pages/menu/menu';
import { MenusPage } from '../pages/menus/menus';
import { OrderPage } from '../pages/order/order';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    HomeCustPage,
    ComboPage,
    CustProfilePage,
    DinerCreateMenuPage,
    DinerMenuPage,
    DinerProfilePage,
    HomeDinerPage,
    MenuPage,
    MenusPage,
    OrderPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    HomeCustPage,
    ComboPage,
    CustProfilePage,
    DinerCreateMenuPage,
    DinerMenuPage,
    DinerProfilePage,
    HomeDinerPage,
    MenuPage,
    MenusPage,
    OrderPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

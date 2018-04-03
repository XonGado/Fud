var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
// firebase & angularfire2
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FIREBASE_CONFIG } from './firebase.config';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
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
                IonicModule.forRoot(MyApp),
                AngularFireModule.initializeApp(FIREBASE_CONFIG),
                AngularFireDatabaseModule,
                AngularFireAuthModule
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
                { provide: ErrorHandler, useClass: IonicErrorHandler }
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map
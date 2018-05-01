import { BrowserModule } from '@angular/platform-browser'
import { ErrorHandler, NgModule } from '@angular/core'
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular'
import { SplashScreen } from '@ionic-native/splash-screen'
import { StatusBar } from '@ionic-native/status-bar'
import { Camera } from '@ionic-native/camera'
import { QRScanner } from '@ionic-native/qr-scanner'

// import { Materialize } from '../assets/css/materialize'

import { MyApp } from './app.component'
import { HomePage } from '../pages/home/home'
import { LoginPage } from '../pages/login/login'
import { RegisterPage } from '../pages/register/register'
import { HomeCustPage } from '../pages/home-cust/home-cust' 
import { ComboPage } from '../pages/combo/combo'
import { ComboAddPage } from '../pages/combo-add/combo-add'
import { ComboEditPage } from '../pages/combo-edit/combo-edit'
import { ComboSelectDinerPage } from '../pages/combo-select-diner/combo-select-diner'
import { CustProfilePage } from '../pages/cust-profile/cust-profile'
import { DinerProfilePage } from '../pages/diner-profile/diner-profile'
import { DinerCreateMenuPage } from '../pages/diner-create-menu/diner-create-menu'
import { DinerMenuPage } from '../pages/diner-menu/diner-menu'
import { HomeDinerPage } from '../pages/home-diner/home-diner'
import { MenuPage } from '../pages/menu/menu'
import { MenusPage } from '../pages/menus/menus'
import { OrderPage } from '../pages/order/order'
import { BasketPage } from '../pages/basket/basket'
import { DinerScanPage } from '../pages/diner-scan/diner-scan'
import { ItemPage } from '../pages/item/item'
import { ItemEditPage } from '../pages/item-edit/item-edit'
import { ItemAddPage } from '../pages/item-add/item-add'
import { MenuCreatePage } from '../pages/menu-create/menu-create'
import { OrderDetailsPage } from '../pages/order-details/order-details'

// firebase & angularfire2
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { FIREBASE_CONFIG } from './firebase.config'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    HomeCustPage,
    ComboPage,
    ComboAddPage,
    ComboEditPage,
    ComboSelectDinerPage,
    CustProfilePage,
    DinerCreateMenuPage,
    DinerMenuPage,
    DinerProfilePage,
    HomeDinerPage,
    MenuPage,
    MenusPage,
    OrderPage,
    BasketPage,
    DinerScanPage,
    ItemPage,
    ItemAddPage,
    ItemEditPage,
    OrderDetailsPage,
    MenuCreatePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
        mode: 'md'
    }),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    HomeCustPage,
    ComboPage,
    ComboAddPage,
    ComboEditPage,
    ComboSelectDinerPage,
    CustProfilePage,
    DinerCreateMenuPage,
    DinerMenuPage,
    DinerProfilePage,
    HomeDinerPage,
    MenuPage,
    MenusPage,
    OrderPage,
    BasketPage,
    DinerScanPage,
    ItemPage,
    ItemEditPage,
    ItemAddPage,
    OrderDetailsPage,
    MenuCreatePage
  ],
  providers: [
    Camera,
    QRScanner,
    StatusBar,
    SplashScreen,
    AngularFirestore,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

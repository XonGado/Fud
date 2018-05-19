import { BrowserModule } from '@angular/platform-browser'
import { ErrorHandler, NgModule } from '@angular/core'
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular'
import { SplashScreen } from '@ionic-native/splash-screen'
import { StatusBar } from '@ionic-native/status-bar'
import { Camera } from '@ionic-native/camera'
import { QRScanner } from '@ionic-native/qr-scanner'
import { NgxQRCodeModule } from 'ngx-qrcode2'
import { BarcodeScanner } from '@ionic-native/barcode-scanner'

// import { Materialize } from '../assets/css/materialize'

import { MyApp } from './app.component'
import { HomePage } from '../pages/home/home'
import { RegisterPage } from '../pages/register/register'
import { LoadingPage } from '../pages/loading/loading'
import { LoginPage } from '../pages/login/login'

import { CustHomePage } from '../pages/cust-home/cust-home' 
import { CustProfilePage } from '../pages/cust-profile/cust-profile'
import { CustViewOrderPage } from '../pages/cust-view-order/cust-view-order'
import { CustViewDinerPage } from '../pages/cust-view-diner/cust-view-diner'
import { CustLocatePage } from '../pages/cust-locate/cust-locate'
import { CustScanPage } from '../pages/cust-scan/cust-scan'
import { ComboPage } from '../pages/combo/combo'
import { ComboAddPage } from '../pages/combo-add/combo-add'
import { ComboEditPage } from '../pages/combo-edit/combo-edit'
import { ComboSelectDinerPage } from '../pages/combo-select-diner/combo-select-diner'
import { OrderPage } from '../pages/order/order'

import { DinerHomePage } from '../pages/diner-home/diner-home'
import { DinerProfilePage } from '../pages/diner-profile/diner-profile'
import { DinerProfileEditPage } from '../pages/diner-profile-edit/diner-profile-edit'
import { DinerCreateMenuPage } from '../pages/diner-create-menu/diner-create-menu'
import { DinerMenuPage } from '../pages/diner-menu/diner-menu'
import { DinerLocatePage } from '../pages/diner-locate/diner-locate'
import { DinerScanPage } from '../pages/diner-scan/diner-scan'
import { DinerOrderHistoryPage } from '../pages/diner-order-history/diner-order-history'
import { MenuPage } from '../pages/menu/menu'
import { MenusPage } from '../pages/menus/menus'
import { BasketPage } from '../pages/basket/basket'
import { ItemPage } from '../pages/item/item'
import { ItemEditPage } from '../pages/item-edit/item-edit'
import { ItemAddPage } from '../pages/item-add/item-add'
import { MenuCreatePage } from '../pages/menu-create/menu-create'
import { OrderDetailsPage } from '../pages/order-details/order-details'

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer'
import { File } from '@ionic-native/file'

// Firebase & Angularfire2
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore'
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth'
import { FIREBASE_CONFIG } from './firebase.config'

// Google Map API
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    CustHomePage,
    ComboPage,
    ComboAddPage,
    ComboEditPage,
    ComboSelectDinerPage,
    CustProfilePage,
    DinerHomePage,
    DinerCreateMenuPage,
    DinerMenuPage,
    DinerProfilePage,
    DinerProfileEditPage,
    DinerLocatePage,
    DinerOrderHistoryPage,
    CustViewOrderPage,
    CustViewDinerPage,
    CustLocatePage,
    CustScanPage,
    LoadingPage,
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
    NgxQRCodeModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    CustHomePage,
    ComboPage,
    ComboAddPage,
    ComboEditPage,
    ComboSelectDinerPage,
    CustProfilePage,
    DinerHomePage,
    DinerCreateMenuPage,
    DinerMenuPage,
    DinerProfileEditPage,
    DinerProfilePage,
    DinerLocatePage,
    DinerOrderHistoryPage,  
    CustViewOrderPage,
    CustViewDinerPage,
    CustLocatePage,
    CustScanPage,
    LoadingPage,
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
    Geolocation,
    FileTransfer,
    FileTransferObject,
    BarcodeScanner,
    AngularFirestore,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

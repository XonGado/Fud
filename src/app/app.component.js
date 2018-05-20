var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingPage } from '../pages/loading/loading';
import { LoginPage } from '../pages/login/login';
import { DinerHomePage } from '../pages/diner-home/diner-home';
import { CustHomePage } from '../pages/cust-home/cust-home';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, fire, firestore) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.fire = fire;
        this.firestore = firestore;
        this.rootPage = LoadingPage;
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
        var that = this;
        this.fire.auth.onAuthStateChanged(function (user) {
            if (user) {
                that.redirectUser(user.uid);
            }
            else {
                that.rootPage = LoginPage;
            }
        });
    }
    MyApp.prototype.redirectUser = function (uid) {
        var that = this;
        this.firestore.collection('users').doc(uid).ref.get()
            .then(function (doc) {
            if (doc.data().type == 'diners') {
                that.rootPage = DinerHomePage;
            }
            else {
                that.rootPage = CustHomePage;
            }
        });
    };
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform,
            StatusBar,
            SplashScreen,
            AngularFireAuth,
            AngularFirestore])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map
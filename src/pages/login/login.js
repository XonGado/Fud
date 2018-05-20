var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController, ToastController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { DinerHomePage } from '../diner-home/diner-home';
import { CustHomePage } from '../cust-home/cust-home';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, menu, fire, firestore, loadingCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.menu = menu;
        this.fire = fire;
        this.firestore = firestore;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.enabled = false;
        // this.retrieveFudAvatar()    
    }
    LoginPage.prototype.openRegisterPage = function () {
        this.navCtrl.push(RegisterPage);
    };
    LoginPage.prototype.authenticateLogin = function () {
        var loading = this.loadingCtrl.create({
            content: "<ion-spinner name=\"cresent\"></ion-spinner>",
            dismissOnPageChange: true
        });
        loading.present();
        var email = this.email.value;
        var password = this.password.value;
        if (email != '' && password != '') {
            var that_1 = this;
            this.fire.auth.signInAndRetrieveDataWithEmailAndPassword(this.email.value, this.password.value)
                .then(function (data) {
                that_1.uid = that_1.fire.auth.currentUser.uid;
                that_1.firestore.collection('users').doc(that_1.uid).ref.get()
                    .then(function (doc) {
                    if (doc.data().type == 'diners') {
                        that_1.navCtrl.push(DinerHomePage);
                    }
                    else {
                        that_1.navCtrl.push(CustHomePage);
                    }
                })
                    .catch(function (error) {
                    that_1.showError(error.message);
                    loading.dismiss();
                });
            })
                .catch(function (error) {
                that_1.showError(error.message);
                loading.dismiss();
            });
        }
        else if (email == '' && password != '') {
            this.showError("Please enter your email.");
            loading.dismiss();
        }
        else if (email != '' && password == '') {
            this.showError("Please enter you password.");
            loading.dismiss();
        }
        else {
            this.showError("Enter your credentials first.");
            loading.dismiss();
        }
    };
    LoginPage.prototype.showError = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 5000,
            position: 'top',
            cssClass: 'danger',
            showCloseButton: true,
            closeButtonText: 'X',
            dismissOnPageChange: true
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed error');
        });
        toast.present();
    };
    LoginPage.prototype.enableButton = function () {
        if (this.email.value != "" && this.password.value.length >= 8) {
            this.enabled = true;
        }
        this.enabled = false;
    };
    LoginPage.prototype.login = function (email, password) {
        this.email.value = email;
        this.password.value = password;
        this.authenticateLogin();
    };
    LoginPage.prototype.ionViewDidLoad = function () {
        console.log('Loaded LoginPage');
    };
    __decorate([
        ViewChild('email'),
        __metadata("design:type", Object)
    ], LoginPage.prototype, "email", void 0);
    __decorate([
        ViewChild('password'),
        __metadata("design:type", Object)
    ], LoginPage.prototype, "password", void 0);
    LoginPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-login',
            templateUrl: 'login.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            MenuController,
            AngularFireAuth,
            AngularFirestore,
            LoadingController,
            ToastController])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, fire, database) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.fire = fire;
        this.database = database;
    }
    LoginPage.prototype.openRegisterPage = function () {
        this.navCtrl.push(RegisterPage);
    };
    LoginPage.prototype.authenticateLogin = function () {
        var _this = this;
        this.fire.auth.signInAndRetrieveDataWithEmailAndPassword(this.email.nativeElement.value, this.password.nativeElement.value)
            .then(function (data) {
            // console.log("Data: ",data)
            console.log("User ID: ", _this.fire.auth.currentUser.uid);
        })
            .catch(function (error) {
            console.log("Error: ", error);
        });
    };
    LoginPage.prototype.ionViewDidLoad = function () {
        console.log('Loaded LoginPage');
        // this.navCtrl.push(RegisterPage);
    };
    __decorate([
        ViewChild('email'),
        __metadata("design:type", ElementRef)
    ], LoginPage.prototype, "email", void 0);
    __decorate([
        ViewChild('password'),
        __metadata("design:type", ElementRef)
    ], LoginPage.prototype, "password", void 0);
    LoginPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-login',
            templateUrl: 'login.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AngularFireAuth, AngularFireDatabase])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map
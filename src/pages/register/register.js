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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var RegisterPage = /** @class */ (function () {
    function RegisterPage(navCtrl, navParams, database, fire) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.database = database;
        this.fire = fire;
        this.registerCustomer = {};
        this.registerDiner = {};
        this.registerCustomerRef$ = this.database.list('customers');
        this.registerDinerRef$ = this.database.list('diners');
    }
    RegisterPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad RegisterPage');
    };
    RegisterPage.prototype.createCustomer = function (registerCustomer) {
        if ((this.cust_password.value == this.cust_retypePassword.value) && (this.cust_password.value.length >= 8 && this.cust_password.value.length <= 20)) {
            var that_1 = this;
            this.fire.auth.createUserWithEmailAndPassword(this.cust_email.value, this.cust_password.value)
                .then(function (data) {
                that_1.fire.auth.signInAndRetrieveDataWithEmailAndPassword(that_1.cust_email.value, that_1.cust_password.value)
                    .then(function (data) {
                    // console.log("Data: ", data)
                    console.log("UID: ", that_1.fire.auth.currentUser.uid);
                })
                    .catch(function (error) {
                    console.log("Error: ", error);
                });
                // that.registerCustomerRef$.push({
                //   cust_name: that.registerCustomer.cust_name,
                //   cust_username: that.registerCustomer.cust_username,
                //   cust_email: that.registerCustomer.cust_email
                // })
            })
                .catch(function (error) {
                console.log("Error: ", error);
            });
        }
        else {
            if (this.cust_password.value != this.cust_retypePassword.value) {
                console.log("Passwords do not match.");
            }
            if (this.cust_password.value.length < 8 || this.cust_password.value.length > 20) {
                console.log("Password should be 8 characters.");
            }
        }
    };
    RegisterPage.prototype.createDiner = function (registerDiner) {
        if ((this.dine_password.value == this.dine_retypePassword.value) && (this.dine_password.value.length >= 8 && this.dine_password.value.length <= 20)) {
            var that_2 = this;
            this.fire.auth.createUserWithEmailAndPassword(this.dine_email.value, this.dine_password.value)
                .then(function (data) {
                that_2.fire.auth.signInAndRetrieveDataWithEmailAndPassword(that_2.dine_email.value, that_2.dine_password.value)
                    .then(function (data) {
                    // console.log("Data: ", data)
                    console.log("UID: ", that_2.fire.auth.currentUser.uid);
                })
                    .catch(function (error) {
                    console.log("Error: ", error);
                });
                // that.registerDinerRef$.push({
                //   dine_name: that.registerDiner.dine_name,
                //   dine_owner_name: that.registerDiner.dine_owner_name,
                //   dine_username: that.registerDiner.dine_username,
                //   dine_email: that.registerDiner.dine_email,
                //   dine_weblink: that.registerDiner.dine_weblink,
                //   dine_number: that.registerDiner.dine_number,
                //   dine_address: that.registerDiner.dine_address
                // })
            })
                .catch(function (error) {
                console.log("Error: ", error);
            });
        }
        else {
            if (this.dine_password.value != this.dine_retypePassword.value) {
                console.log("Passwords do not match.");
            }
            if (this.dine_password.value.length < 8 || this.dine_retypePassword.value.length > 20) {
                console.log("Password should be 8 characters.");
            }
        }
    };
    RegisterPage.prototype.closePage = function () {
        this.navCtrl.pop();
    };
    __decorate([
        ViewChild('cust_email'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "cust_email", void 0);
    __decorate([
        ViewChild('cust_password'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "cust_password", void 0);
    __decorate([
        ViewChild('cust_retypePassword'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "cust_retypePassword", void 0);
    __decorate([
        ViewChild('dine_email'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "dine_email", void 0);
    __decorate([
        ViewChild('dine_password'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "dine_password", void 0);
    __decorate([
        ViewChild('dine_retypePassword'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "dine_retypePassword", void 0);
    RegisterPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-register',
            templateUrl: 'register.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AngularFireDatabase, AngularFireAuth])
    ], RegisterPage);
    return RegisterPage;
}());
export { RegisterPage };
//# sourceMappingURL=register.js.map
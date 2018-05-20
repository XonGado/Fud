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
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var RegisterPage = /** @class */ (function () {
    function RegisterPage(navCtrl, navParams, firestore, fire, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.firestore = firestore;
        this.fire = fire;
        this.toastCtrl = toastCtrl;
        this.acctype = "customer";
    }
    RegisterPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad RegisterPage');
    };
    RegisterPage.prototype.createCustomer = function () {
        if ((this.cust_password.value == this.cust_retypePassword.value) && (this.cust_password.value.length >= 8 && this.cust_password.value.length <= 20)) {
            var that_1 = this;
            this.fire.auth.createUserWithEmailAndPassword(this.cust_email.value, this.cust_password.value)
                .then(function (data) {
                that_1.fire.auth.signInAndRetrieveDataWithEmailAndPassword(that_1.cust_email.value, that_1.cust_password.value)
                    .then(function (data) {
                    that_1.uid = that_1.fire.auth.currentUser.uid;
                    that_1.firestore.doc('customers/' + that_1.uid).set({
                        cust_name: that_1.cust_name.value,
                        cust_username: that_1.cust_username.value,
                        cust_email: that_1.cust_email.value
                    });
                    that_1.firestore.doc('users/' + that_1.uid).set({
                        type: 'customers'
                    });
                    that_1.showToast("You have successfully created an account!");
                })
                    .catch(function (error) {
                    that_1.showToast(error.message);
                    console.log("Error: ", error);
                });
            })
                .catch(function (error) {
                that_1.showToast(error.message);
                console.log("Error: ", error);
            });
        }
        else {
            if (this.cust_password.value != this.cust_retypePassword.value) {
                this.showToast("Passwords do not match.");
                console.log("Passwords do not match.");
            }
            if (this.cust_password.value.length < 8 || this.cust_password.value.length > 20) {
                this.showToast("Password should be 8 characters.");
                console.log("Password should be 8 characters.");
            }
        }
    };
    RegisterPage.prototype.createDiner = function () {
        if ((this.dine_password.value == this.dine_retypePassword.value) && (this.dine_password.value.length >= 8 && this.dine_password.value.length <= 20)) {
            var that_2 = this;
            this.fire.auth.createUserWithEmailAndPassword(this.dine_email.value, this.dine_password.value)
                .then(function (data) {
                that_2.fire.auth.signInAndRetrieveDataWithEmailAndPassword(that_2.dine_email.value, that_2.dine_password.value)
                    .then(function (data) {
                    that_2.uid = that_2.fire.auth.currentUser.uid;
                    that_2.firestore.doc('diners/' + that_2.uid).set({
                        dine_name: that_2.dine_name.value,
                        dine_username: that_2.dine_username.value,
                        dine_owner_name: that_2.dine_owner_name.value,
                        dine_email: that_2.dine_email.value,
                        dine_weblink: that_2.dine_weblink.value,
                        dine_number: that_2.dine_number.value,
                        dine_address: that_2.dine_address.value,
                        dine_location: {
                            latitude: 0,
                            longitude: 0
                        }
                    });
                    that_2.firestore.doc('users/' + that_2.uid).set({
                        type: 'diners'
                    });
                    that_2.showToast("You have successfully created an account!");
                })
                    .catch(function (error) {
                    that_2.showToast(error.message);
                    console.log("Error: ", error);
                });
            })
                .catch(function (error) {
                that_2.showToast(error.message);
                console.log("Error: ", error);
            });
        }
        else {
            if (this.dine_password.value != this.dine_retypePassword.value) {
                this.showToast("Passwords do not match.");
                console.log("Passwords do not match.");
            }
            if (this.dine_password.value.length < 8 || this.dine_retypePassword.value.length > 20) {
                this.showToast("Password should be 8 characters.");
                console.log("Password should be 8 characters.");
            }
        }
    };
    RegisterPage.prototype.showToast = function (message) {
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
    RegisterPage.prototype.closePage = function () {
        this.navCtrl.pop();
    };
    __decorate([
        ViewChild('cust_name'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "cust_name", void 0);
    __decorate([
        ViewChild('cust_username'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "cust_username", void 0);
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
        ViewChild('dine_name'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "dine_name", void 0);
    __decorate([
        ViewChild('dine_username'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "dine_username", void 0);
    __decorate([
        ViewChild('dine_owner_name'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "dine_owner_name", void 0);
    __decorate([
        ViewChild('dine_email'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "dine_email", void 0);
    __decorate([
        ViewChild('dine_weblink'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "dine_weblink", void 0);
    __decorate([
        ViewChild('dine_number'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "dine_number", void 0);
    __decorate([
        ViewChild('dine_address'),
        __metadata("design:type", Object)
    ], RegisterPage.prototype, "dine_address", void 0);
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
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AngularFirestore,
            AngularFireAuth,
            ToastController])
    ], RegisterPage);
    return RegisterPage;
}());
export { RegisterPage };
//# sourceMappingURL=register.js.map
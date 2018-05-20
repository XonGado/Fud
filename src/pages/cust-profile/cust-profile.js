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
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the CustProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CustProfilePage = /** @class */ (function () {
    function CustProfilePage(navCtrl, navParams, loadingCtrl, fire, firestore) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.fire = fire;
        this.firestore = firestore;
        this.user = {};
        var that = this;
        var loading = this.loadingCtrl.create({
            dismissOnPageChange: true,
            content: "<ion-spinner name=\"cresent\"></ion-spinner>"
        });
        loading.present()
            .then(function () {
            that.uid = fire.auth.currentUser.uid;
            that.customerCollectionRef = that.firestore.collection('customers');
            that.firestore.collection('customers').doc(that.uid).ref.get()
                .then(function (doc) {
                if (doc.exists) {
                    that.user.cust_name = doc.data().cust_name;
                    that.user.cust_email = doc.data().cust_email;
                    that.user.cust_username = doc.data().cust_username;
                    console.log(that.user);
                    loading.dismiss();
                }
                else {
                    console.log("No such user with this ID.");
                    loading.dismiss();
                }
            })
                .catch(function (error) {
                console.log(error.code);
                console.log(error.message);
                loading.dismiss();
            });
        });
    }
    CustProfilePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CustProfilePage');
    };
    CustProfilePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-cust-profile',
            templateUrl: 'cust-profile.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            AngularFireAuth,
            AngularFirestore])
    ], CustProfilePage);
    return CustProfilePage;
}());
export { CustProfilePage };
//# sourceMappingURL=cust-profile.js.map
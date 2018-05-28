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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ComboAddPage } from '../combo-add/combo-add';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the ComboSelectDinerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ComboSelectDinerPage = /** @class */ (function () {
    function ComboSelectDinerPage(navCtrl, navParams, fire, firestore) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.fire = fire;
        this.firestore = firestore;
        this.diner_ids = [];
        this.uid = fire.auth.currentUser.uid;
        this.dinersCollectionRef = this.firestore.collection('diners');
        this.dinerList = this.retrieveDiners();
    }
    ComboSelectDinerPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ComboSelectDinerPage');
    };
    ComboSelectDinerPage.prototype.retrieveDiners = function () {
        var _diners = [];
        var that = this;
        this.dinersCollectionRef.ref.get()
            .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                _diners.push(doc.data());
                that.diner_ids.push(doc.id);
            });
        });
        return _diners;
    };
    ComboSelectDinerPage.prototype.loadDinerMenu = function (index) {
        var that = this;
        this.navCtrl.push(ComboAddPage, {
            data: that.diner_ids[index]
        });
    };
    ComboSelectDinerPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-combo-select-diner',
            templateUrl: 'combo-select-diner.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AngularFireAuth,
            AngularFirestore])
    ], ComboSelectDinerPage);
    return ComboSelectDinerPage;
}());
export { ComboSelectDinerPage };
//# sourceMappingURL=combo-select-diner.js.map
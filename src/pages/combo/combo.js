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
import { ComboSelectDinerPage } from '../combo-select-diner/combo-select-diner';
import { ComboEditPage } from '../combo-edit/combo-edit';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the ComboPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ComboPage = /** @class */ (function () {
    function ComboPage(navCtrl, navParams, firestore, fire) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.firestore = firestore;
        this.fire = fire;
        this.combosList = [];
        this.itemsList = [];
        this.uid = this.fire.auth.currentUser.uid;
        this.combosCollectionRef = this.firestore.collection('customers').doc(this.uid).collection('combos');
    }
    ComboPage.prototype.ionViewWillEnter = function () {
        this.getCombos();
    };
    ComboPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ComboPage');
    };
    ComboPage.prototype.getCombos = function () {
        var that = this;
        this.combosList = [];
        this.combosCollectionRef.ref.get()
            .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                that.combosList.push(doc.data());
            });
            that.getItems();
        });
    };
    ComboPage.prototype.getItems = function () {
        var that = this;
        var count = 0;
        this.combosList.forEach(function (doc) {
            that.itemsList = doc.items;
        });
        this.itemsList.forEach(function (doc) {
            count = count + Number(doc.item_ordered);
        });
        this.itemCount = count;
    };
    ComboPage.prototype.openAddComboModal = function () {
        this.navCtrl.push(ComboSelectDinerPage);
        console.log("Opening add combo modal.");
    };
    ComboPage.prototype.openEditComboModal = function (i) {
        var combosList = this.combosList;
        this.navCtrl.push(ComboEditPage, {
            data: combosList[i]
        });
    };
    ComboPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-combo',
            templateUrl: 'combo.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AngularFirestore,
            AngularFireAuth])
    ], ComboPage);
    return ComboPage;
}());
export { ComboPage };
//# sourceMappingURL=combo.js.map
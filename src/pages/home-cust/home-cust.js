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
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { CustProfilePage } from '../cust-profile/cust-profile';
import { MenusPage } from '../menus/menus';
import { OrderPage } from '../order/order';
import { ComboPage } from '../combo/combo';
/**
 * Generated class for the HomeCustPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var HomeCustPage = /** @class */ (function () {
    function HomeCustPage(navCtrl, navParams, menu) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        menu.enable(true);
    }
    HomeCustPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad HomeCustPage');
    };
    HomeCustPage.prototype.openProfile = function () {
        this.navCtrl.push(CustProfilePage);
    };
    HomeCustPage.prototype.openCombo = function () {
        this.navCtrl.push(ComboPage);
    };
    HomeCustPage.prototype.order = function () {
        this.navCtrl.push(OrderPage);
    };
    HomeCustPage.prototype.openMenus = function () {
        this.navCtrl.push(MenusPage);
    };
    HomeCustPage.prototype.logout = function () {
        this.navCtrl.pop();
    };
    HomeCustPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-home-cust',
            templateUrl: 'home-cust.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, MenuController])
    ], HomeCustPage);
    return HomeCustPage;
}());
export { HomeCustPage };
//# sourceMappingURL=home-cust.js.map
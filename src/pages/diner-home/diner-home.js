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
import { IonicPage, NavController, NavParams, ModalController, MenuController } from 'ionic-angular';
import { DinerMenuPage } from '../diner-menu/diner-menu';
import { DinerScanPage } from '../diner-scan/diner-scan';
import { DinerProfilePage } from '../diner-profile/diner-profile';
import { OrderDetailsPage } from '../order-details/order-details';
import { DinerOrderHistoryPage } from '../diner-order-history/diner-order-history';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the HomeDinerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DinerHomePage = /** @class */ (function () {
    function DinerHomePage(navCtrl, navParams, menu, modalCtrl, fire, firestore) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.menu = menu;
        this.modalCtrl = modalCtrl;
        this.fire = fire;
        this.firestore = firestore;
        this.ordersList = [];
        this.itemsList = [];
        this.orderFilter = "all";
        this.order_ids = [];
        this.user = {
            name: 'sample',
            email: 'sample'
        };
        this.uid = this.fire.auth.currentUser.uid;
        this.diner = this.firestore.collection('diners').doc(this.uid);
        this.diner.ref.get().then(function (doc) {
            _this.user = {
                name: doc.data().dine_owner_name,
                email: doc.data().dine_email
            };
        });
        this.ordersCollectionRef = this.diner.collection('orders');
    }
    DinerHomePage.prototype.ionViewWillEnter = function () {
        this.getOrders();
    };
    DinerHomePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad HomeDinerPage');
        this.menu.enable(true);
    };
    DinerHomePage.prototype.menuToggle = function () {
        this.menu.enable(true);
        this.menu.toggle();
    };
    DinerHomePage.prototype.getOrders = function () {
        var that = this;
        this.ordersList = [];
        this.order_ids = [];
        this.ordersCollectionRef.ref.where("cleared", "==", false).orderBy("orderNumber", "asc").get()
            .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                that.ordersList.push(doc.data());
                that.order_ids.push(doc.id);
            });
        });
    };
    DinerHomePage.prototype.correctOrderType = function (type) {
        if (this.orderFilter == "all") {
            return true;
        }
        return this.convertType(type) == this.orderFilter;
    };
    DinerHomePage.prototype.convertType = function (type) {
        if (type == 0) {
            return "dine-in";
        }
        else if (type == 1) {
            return "take-out";
        }
        else if (type == 2) {
            return "delivery";
        }
    };
    DinerHomePage.prototype.logout = function () {
        this.fire.auth.signOut();
    };
    DinerHomePage.prototype.openProfile = function () {
        this.navCtrl.push(DinerProfilePage);
    };
    DinerHomePage.prototype.openMenu = function () {
        this.navCtrl.push(DinerMenuPage);
    };
    DinerHomePage.prototype.openGenerator = function () {
        this.navCtrl.push(DinerScanPage);
    };
    DinerHomePage.prototype.openOrderDetails = function (index) {
        var that = this;
        this.navCtrl.push(OrderDetailsPage, {
            data: that.order_ids[index]
        });
    };
    DinerHomePage.prototype.openOrderHistory = function () {
        this.navCtrl.push(DinerOrderHistoryPage);
    };
    DinerHomePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-diner-home',
            templateUrl: 'diner-home.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            MenuController,
            ModalController,
            AngularFireAuth,
            AngularFirestore])
    ], DinerHomePage);
    return DinerHomePage;
}());
export { DinerHomePage };
//# sourceMappingURL=diner-home.js.map
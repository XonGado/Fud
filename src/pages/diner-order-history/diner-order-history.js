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
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
var DinerOrderHistoryPage = /** @class */ (function () {
    function DinerOrderHistoryPage(navCtrl, navParams, fire, firestore) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.fire = fire;
        this.firestore = firestore;
        this.ordersList = [];
        this.itemsList = [];
        this.orderFilter = "all";
        this.order_ids = [];
        this.uid = this.fire.auth.currentUser.uid;
        this.diner = this.firestore.collection('diners').doc(this.uid);
        this.ordersCollectionRef = this.diner.collection('orders');
    }
    DinerOrderHistoryPage.prototype.ionViewWillEnter = function () {
        this.getOrders();
    };
    DinerOrderHistoryPage.prototype.getOrders = function () {
        var that = this;
        this.ordersList = [];
        this.order_ids = [];
        this.ordersCollectionRef.ref.where("cleared", "==", true).get()
            .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                that.ordersList.push(doc.data());
                that.order_ids.push(doc.id);
                console.log(doc.data().customer_name);
                console.log(doc.id);
            });
            that.getItems();
        });
    };
    DinerOrderHistoryPage.prototype.getItems = function () {
        var that = this;
        var count = 0;
        this.ordersList.forEach(function (doc) {
            that.itemsList = doc.items;
        });
        this.itemsList.forEach(function (doc) {
            count = count + Number(doc.item_ordered);
        });
        this.itemCount = count;
    };
    DinerOrderHistoryPage.prototype.hasHistory = function () {
        return this.ordersList.length > 0;
    };
    DinerOrderHistoryPage.prototype.ionViewDidLoad = function () {
        this.getOrders();
        console.log('ionViewDidLoad DinerOrderHistoryPage');
    };
    DinerOrderHistoryPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-diner-order-history',
            templateUrl: 'diner-order-history.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AngularFireAuth,
            AngularFirestore])
    ], DinerOrderHistoryPage);
    return DinerOrderHistoryPage;
}());
export { DinerOrderHistoryPage };
//# sourceMappingURL=diner-order-history.js.map
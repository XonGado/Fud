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
// import * as item from '../assets/js/item';
// import * as order from '../assets/js/order';
// import * as orderController from '../assets/js/orderController';
// import * as orderModel from '../assets/js/orderModel';
/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var OrderPage = /** @class */ (function () {
    function OrderPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.itemList = [
            { id: '0', name: 'Choco Chip Waffle', image: 'samplePP.jpg', description: 'This is a description.', price: '60', type: 'waffle' },
            { id: '1', name: 'Caramel Waffle', image: 'samplePP.jpg', description: 'This is a description.', price: '60', type: 'waffle' },
            { id: '2', name: 'Blueberry Waffle', image: 'samplePP.jpg', description: 'This is a description.', price: '60', type: 'waffle' },
            { id: '3', name: 'Strawberry Waffle', image: 'samplePP.jpg', description: 'This is a description.', price: '60', type: 'waffle' }
        ];
    }
    OrderPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad OrderPage');
    };
    OrderPage.prototype.confirmQR = function () {
        console.log("Open confirm modal.");
    };
    OrderPage.prototype.addItemToOrder = function () {
        console.log("Added item to order.");
    };
    OrderPage.prototype.subtractItemFromOrder = function () {
        console.log("Subtract item from order.");
    };
    OrderPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-order',
            templateUrl: 'order.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams])
    ], OrderPage);
    return OrderPage;
}());
export { OrderPage };
//# sourceMappingURL=order.js.map
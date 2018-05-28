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
import { IonicPage, NavController, ActionSheetController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
/**
 * Generated class for the CustViewOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CustViewOrderPage = /** @class */ (function () {
    function CustViewOrderPage(navCtrl, navParams, actionSheetCtrl, firestore) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.actionSheetCtrl = actionSheetCtrl;
        this.firestore = firestore;
        this.items = [];
        this.order_cost = 0;
        this.ordereditems_ids = [];
        this.diner_id = this.navParams.get('dinerID');
        this.order_id = this.navParams.get('orderID');
        this.orderDocRef = this.firestore.collection('diners').doc(this.diner_id).collection('orders').doc(this.order_id);
        this.orderedItemsRef = this.orderDocRef.collection('OrderedItems');
        this.getOrderDetails();
    }
    CustViewOrderPage.prototype.getOrderDetails = function () {
        var that = this;
        this.orderDocRef.ref.get()
            .then(function (doc) {
            that.customer_name = doc.data().customer_name;
            that.order_cost = doc.data().order_cost;
        });
        this.orderedItemsRef.ref.get()
            .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                that.items.push(doc.data());
                that.ordereditems_ids.push(doc.id);
            });
        });
    };
    CustViewOrderPage.prototype.deleteOrderedItem = function (item, i) {
        var ordereditem_id = this.ordereditems_ids[i];
        var price = 0;
        var that = this;
        if (this.items[i].lock == false) {
            this.orderedItemsRef.doc(ordereditem_id).delete()
                .then(function () {
                console.log("Ordered items successfully deleted.");
            })
                .catch(function (error) {
                console.log("Some error occured.");
            });
            this.orderedItemsRef.ref.get()
                .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    console.log(doc.data());
                    price = price + (Number(doc.data().item_price) * Number(doc.data().item_ordered));
                });
                that.order_cost = price;
                that.orderDocRef.update({
                    order_cost: that.order_cost
                });
            });
        }
        else {
            console.log("The ordered item cannot be deleted because it is being processed now.");
        }
    };
    CustViewOrderPage.prototype.moreOptions = function () {
        var _this = this;
        var flag = false;
        this.items.forEach(function (item) {
            if (item.lock == true) {
                flag = true;
            }
        });
        if (flag == false) {
            var actionSheet = this.actionSheetCtrl.create({
                title: 'More options',
                buttons: [
                    {
                        cssClass: 'danger',
                        icon: 'close',
                        text: 'Cancel Order',
                        handler: function () {
                            _this.orderDocRef.delete()
                                .then(function () {
                                console.log("Order successfully cancelled.");
                            })
                                .catch(function (error) {
                                console.log("Some error occured.");
                            });
                        }
                    }
                ]
            });
            actionSheet.present();
        }
        else {
            console.log("You cannot cancel your order anymore.");
        }
    };
    CustViewOrderPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CustViewOrderPage');
    };
    CustViewOrderPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-cust-view-order',
            templateUrl: 'cust-view-order.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, ActionSheetController, AngularFirestore])
    ], CustViewOrderPage);
    return CustViewOrderPage;
}());
export { CustViewOrderPage };
//# sourceMappingURL=cust-view-order.js.map
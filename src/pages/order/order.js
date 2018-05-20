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
import { IonicPage, NavController, NavParams, AlertController, Events, ModalController, Platform, LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { BasketPage } from '../basket/basket';
import { CustLocatePage } from '../cust-locate/cust-locate';
/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var OrderPage = /** @class */ (function () {
    function OrderPage(navCtrl, navParams, alertCtrl, events, modalCtrl, loadingCtrl, platform, fire, firestore) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.loadingCtrl = loadingCtrl;
        this.platform = platform;
        this.fire = fire;
        this.firestore = firestore;
        this.searchQuery = '';
        this.categoryList = [];
        this.orderedItemsList = [];
        this.orderNumber = 1;
        this.loading = this.loadingCtrl.create({
            dismissOnPageChange: true,
            content: "<ion-spinner name=\"cresent\"></ion-spinner>"
        });
        this.diner_id = this.navParams.get('data');
        this.dinerCollectionRef = this.firestore.collection('diners');
        this.itemCollectionRef = this.dinerCollectionRef.doc(this.diner_id).collection('items');
        this.diner = this.dinerCollectionRef.doc(this.diner_id);
        this.ordersCollectionRef = this.dinerCollectionRef.doc(this.diner_id).collection('orders');
        this.customerDocRef = this.firestore.collection('customers').doc(this.fire.auth.currentUser.uid);
        this.diner.ref.get().then(function (doc) { _this.diner_name = doc.data().dine_name; });
    }
    OrderPage.prototype.getCategoryList = function () {
        var categories = [];
        for (var i = this.itemList.length - 1; i >= 0; i--) {
            if (!(categories.includes(this.itemList[i].item_type))) {
                console.log(this.itemList[i].item_type);
                categories.push(this.itemList[i].item_type);
            }
        }
        return categories;
    };
    OrderPage.prototype.createCategory = function (title, items) {
        this.categoryList.push({
            title: title,
            items: items
        });
    };
    OrderPage.prototype.confirmQR = function () {
        console.log("Open confirm modal.");
    };
    OrderPage.prototype.getItems = function () {
        var that = this;
        var items = [];
        this.itemCollectionRef.ref.where("item_visibility", "==", true).get()
            .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                var _item = doc.data();
                _item.item_ordered = 0;
                _item.item_count = 0;
                items.push(_item);
            });
            var categories = that.getCategories(items);
            that.initializeCategories(categories, items);
        });
    };
    OrderPage.prototype.getCategories = function (items) {
        var _categoryList = [];
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (!(_categoryList.includes(item.item_type))) {
                _categoryList.push(item.item_type);
            }
        }
        return _categoryList;
    };
    OrderPage.prototype.initializeCategories = function (categories, items) {
        var _items = [];
        for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
            var category = categories_1[_i];
            _items = this.getItemsUnderCategory(category, items);
            this.categoryList.push({
                title: category,
                items: _items
            });
        }
    };
    OrderPage.prototype.getItemsUnderCategory = function (category, items) {
        var _items = [];
        if (category && category.trim() != '') {
            items.filter(function (item) {
                if (item.item_type.toLowerCase().indexOf(category.toLowerCase()) > -1) {
                    _items.push(item);
                }
            });
        }
        return _items;
    };
    OrderPage.prototype.viewItems = function () {
        this.orderedItemsList = this.gatherOrder();
        var count = 0;
        this.orderedItemsList.forEach(function (doc) {
            count = count + Number(doc.item_ordered);
        });
        this.itemCount = count;
        var basket = this.modalCtrl.create(BasketPage, { orderedItems: this.orderedItemsList });
        basket.present();
    };
    OrderPage.prototype.askOrderType = function () {
        var _this = this;
        var alert = this.alertCtrl.create();
        var address = '';
        alert.setTitle("Select an option");
        alert.addInput({
            type: 'radio',
            label: "I'll dine in",
            value: "0",
            checked: true
        });
        alert.addInput({
            type: 'radio',
            label: "I'll take it out",
            value: "1",
            checked: false
        });
        alert.addInput({
            type: 'radio',
            label: "Deliver it to me",
            value: "2",
            checked: false
        });
        alert.addButton('Cancel');
        alert.addButton({
            text: "Confirm",
            handler: function (data) {
                _this.orderType = data;
                if (_this.orderType == 2) {
                    var locate = _this.modalCtrl.create(CustLocatePage, { order: _this.gatherOrder(), dinerID: _this.diner_id });
                    locate.present();
                }
                else {
                    _this.placeOrder(_this.orderType);
                }
            }
        });
        alert.present();
        this.loading.dismiss();
    };
    OrderPage.prototype.placeOrder = function (orderType) {
        var _this = this;
        // // Saving to database
        this.loading.present();
        this.orderedItemsList = this.gatherOrder();
        var customer_name;
        var customer_id;
        var id = this.firestore.createId();
        var that = this;
        var price = 0;
        var count = 0;
        this.orderedItemsList.forEach(function (doc) {
            price = price + Number(doc.item_price * doc.item_ordered);
            count = count + Number(doc.item_ordered);
        });
        this.ordersCollectionRef.ref.get()
            .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                that.orderNumber += 1;
            });
        });
        this.customerDocRef.ref.get()
            .then(function (doc) {
            customer_name = doc.data().cust_name;
            customer_id = doc.id;
            that.ordersCollectionRef.doc(id).set({
                customer_id: customer_id,
                customer_name: customer_name,
                order_cost: price,
                cleared: false,
                order_type: that.orderType,
                totalItems: count,
                orderNumber: that.orderNumber
            })
                .then(function () {
                var alert = that.alertCtrl.create({
                    title: "Order Placed!",
                    subTitle: "We'll be preparing your food.",
                    buttons: [{
                            text: "Okay!",
                            handler: function () {
                                that.popPage();
                            }
                        }]
                });
                that.loading.dismiss();
                alert.present();
            });
        })
            .then(function (doc) {
            var that = _this;
            that.orderedItemsList.forEach(function (doc) {
                var ordereditem_id = that.firestore.createId();
                that.ordersCollectionRef.doc(id).collection('OrderedItems').doc(ordereditem_id).set({
                    item_id: doc.item_id,
                    item_name: doc.item_name,
                    item_description: doc.item_description,
                    item_price: doc.item_price,
                    item_type: doc.item_type,
                    item_count: doc.item_count,
                    item_ordered: doc.item_ordered,
                    item_availability: doc.item_availability,
                    item_visibility: doc.item_visibility,
                    lock: false
                });
            });
        });
    };
    OrderPage.prototype.popPage = function () {
        this.navCtrl.pop();
    };
    OrderPage.prototype.itemPanned = function (e, item) {
        if (e.additionalEvent == "panright") {
            item.item_count++;
        }
        else if (e.additionalEvent == "panleft") {
            item.item_count--;
        }
        if (item.item_count < 0) {
            item.item_count = 0;
        }
        this.itemIsOrdered(e, item);
        item.item_ordered = Math.floor(item.item_count / 5);
    };
    OrderPage.prototype.itemTapped = function (e, item) {
        var width = this.platform.width();
        if (e.center.x >= width / 2) {
            item.item_count += 5;
            item.item_ordered++;
        }
        else if (e.center.x < width / 2 && item.item_ordered > 0) {
            item.item_count -= 5;
            item.item_ordered--;
        }
        if (item.item_ordered < 0) {
            item.item_ordered = 0;
        }
        this.itemIsOrdered(e, item);
    };
    OrderPage.prototype.itemIsOrdered = function (e, item) {
        var className = "item item-block item-md";
        if (item.item_count > 0) {
            e.target.offsetParent.className = className + " ordered";
        }
        else {
            e.target.offsetParent.className = className;
        }
    };
    OrderPage.prototype.gatherOrder = function () {
        var _list = [];
        for (var _i = 0, _a = this.categoryList; _i < _a.length; _i++) {
            var category = _a[_i];
            for (var _b = 0, _c = category.items; _b < _c.length; _b++) {
                var item = _c[_b];
                if (item.item_ordered > 0) {
                    _list.push(item);
                }
            }
        }
        return _list;
    };
    OrderPage.prototype.clearItem = function () {
    };
    OrderPage.prototype.filter = function (name, keyword) {
        var _filter = new RegExp(keyword, 'gi');
        if (_filter.test(name)) {
            return true;
        }
        return false;
    };
    OrderPage.prototype.isEmpty = function (items, keyword) {
        var _filter = new RegExp(keyword, 'gi');
        for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
            var item = items_2[_i];
            if (_filter.test(item.item_name)) {
                return false;
            }
        }
        return true;
    };
    OrderPage.prototype.ionViewDidLoad = function () {
        this.getItems();
        console.log('ionViewDidLoad OrderPage');
    };
    OrderPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-order',
            templateUrl: 'order.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AlertController,
            Events,
            ModalController,
            LoadingController,
            Platform,
            AngularFireAuth,
            AngularFirestore])
    ], OrderPage);
    return OrderPage;
}());
export { OrderPage };
//# sourceMappingURL=order.js.map
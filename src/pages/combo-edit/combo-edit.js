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
import { IonicPage, NavController, NavParams, AlertController, ModalController, ActionSheetController, LoadingController, Events, Platform, ToastController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { BasketPage } from '../basket/basket';
/**
 * Generated class for the ComboEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ComboEditPage = /** @class */ (function () {
    function ComboEditPage(navCtrl, navParams, alertCtrl, events, modalCtrl, actionSheetCtrl, platform, loadingCtrl, fire, firestore, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.platform = platform;
        this.loadingCtrl = loadingCtrl;
        this.fire = fire;
        this.firestore = firestore;
        this.toastCtrl = toastCtrl;
        this.searchQuery = '';
        this.categoryList = [];
        this.orderedItemsList = [];
        this.comboItems = [];
        this.diner_ids = [];
        this.dinerList = [];
        this.customerCount = [];
        this.loading = this.loadingCtrl.create({
            dismissOnPageChange: true,
            content: "<ion-spinner name=\"cresent\"></ion-spinner>"
        });
        this.uid = fire.auth.currentUser.uid;
        this.combo_data = this.navParams.get('data');
        this.combo_id = this.combo_data.combo_id;
        this.comboItems = this.combo_data.items;
        this.diner_id = this.combo_data.diner_id;
        this.itemsCollectionRef = this.firestore.collection('diners').doc(this.diner_id).collection('items');
        this.ordersCollectionRef = this.firestore.collection('diners').doc(this.diner_id).collection('orders');
        this.orderedItemsColRef = this.ordersCollectionRef.doc(this.combo_id).collection('OrderedItems');
        this.customer = this.fire.auth.currentUser.uid;
        this.customerDocRef = this.firestore.collection('customers').doc(this.customer);
        this.combosCollectionRef = this.firestore.collection('customers').doc(this.customer).collection('combos');
        this.dinerList = this.retrieveDiners();
    }
    ComboEditPage.prototype.ionViewDidLoad = function () {
        console.log(this.combo_data);
        this.getItems();
        console.log('ionViewDidLoad ComboEditPage');
    };
    ComboEditPage.prototype.userHasOrdered = function () {
        var that = this;
        var order = [];
        var _loop_1 = function () {
            var id = this_1.diner_ids[i];
            this_1.firestore.collection('diners').doc(id).collection('orders').ref.where("customer_id", "==", that.uid).where("cleared", "==", false).get()
                .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    order.push(doc.data());
                    that.dinerID = id;
                    that.orderID = doc.id;
                });
            }).then(function (_) {
                that.ordered = order.length >= 1;
            });
        };
        var this_1 = this;
        for (var i = 0; i < this.diner_ids.length; i++) {
            _loop_1();
        }
    };
    ComboEditPage.prototype.retrieveDiners = function () {
        var _diners = [];
        var that = this;
        this.firestore.collection('diners').ref.get()
            .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                _diners.push(doc.data());
                that.diner_ids.push(doc.id);
            });
        })
            .then(function () {
            that.userHasOrdered();
        });
        return _diners;
    };
    ComboEditPage.prototype.deleteCombo = function () {
        var combo_id = this.combo_data.combo_id;
        this.combosCollectionRef.doc(combo_id).delete()
            .then(function () {
            console.log("Combo deleted successfully!");
        })
            .catch(function (error) {
            console.error("Error deleting the combo. Please try again.");
        });
    };
    ComboEditPage.prototype.updateCombo = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({ content: "<ion-spinner name=\"cresent\"></ion-spinner>" });
        loading.present();
        // Saving to database
        this.orderedItemsList = this.gatherOrder();
        var that = this;
        var cost = 0;
        var name = this.combo_name.value;
        if (name == "") {
            name = "Combo";
        }
        this.orderedItemsList.forEach(function (doc) {
            cost = cost + Number(doc.item_price);
        });
        var combo_id = this.combo_data.combo_id;
        this.combosCollectionRef.doc(combo_id).update({
            combo_id: combo_id,
            combo_name: that.combo_name.value,
            diner_id: that.diner_id,
            combo_cost: cost,
            items: that.orderedItemsList
        })
            .then(function (_) {
            var alert = _this.alertCtrl.create({
                title: "Combo Changed!",
                message: "Let's try this combination you made.",
                buttons: [{
                        text: "Alright!",
                        handler: function (_) { _this.navCtrl.pop(); }
                    }]
            });
            loading.dismiss();
            alert.present();
        })
            .catch(function (error) {
            loading.dismiss();
            that.errorAlert(error);
        });
    };
    ComboEditPage.prototype.getCategoryList = function () {
        var categories = [];
        for (var i = this.itemList.length - 1; i >= 0; i--) {
            if (!(categories.includes(this.itemList[i].item_type))) {
                console.log(this.itemList[i].item_type);
                categories.push(this.itemList[i].item_type);
            }
        }
        return categories;
    };
    ComboEditPage.prototype.createCategory = function (title, items) {
        this.categoryList.push({
            title: title,
            items: items
        });
    };
    ComboEditPage.prototype.confirmQR = function () {
        console.log("Open confirm modal.");
    };
    ComboEditPage.prototype.askOrderType = function () {
        var _this = this;
        if (this.ordered == undefined) {
            this.userHasOrdered();
            var orderedMsg = this.toastCtrl.create({
                message: "Give us a second.",
                dismissOnPageChange: true,
                position: "bottom",
                duration: 3000
            });
            orderedMsg.present();
        }
        else if (!this.ordered) {
            var alert_1 = this.alertCtrl.create();
            var address = '';
            alert_1.setTitle("Select an option");
            alert_1.addInput({
                type: 'radio',
                label: "I'll dine in",
                value: "0",
                checked: true
            });
            alert_1.addInput({
                type: 'radio',
                label: "I'll take it out",
                value: "1",
                checked: false
            });
            alert_1.addInput({
                type: 'radio',
                label: "Deliver it to me",
                value: "2",
                checked: false
            });
            alert_1.addButton('Cancel');
            alert_1.addButton({
                text: "Confirm",
                handler: function (data) {
                    _this.orderType = data;
                    console.log(_this.orderType);
                    _this.placeOrder(_this.orderType);
                    // if (this.orderType == 2) {
                    // Get location. Tasked to Clyde.
                    // }
                }
            });
            alert_1.present();
            this.loading.dismiss();
        }
        else {
            var orderedMsg = this.toastCtrl.create({
                message: "You can't order again! You still have ongoing orders.",
                dismissOnPageChange: true,
                position: "bottom",
                duration: 3000
            });
            orderedMsg.present();
        }
    };
    ComboEditPage.prototype.placeOrder = function (orderType) {
        var _this = this;
        // // Saving to database
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
                                that.navCtrl.pop();
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
    ComboEditPage.prototype.getItems = function () {
        var that = this;
        var items = [];
        this.itemsCollectionRef.ref.get()
            .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                var _item = doc.data();
                _item.item_ordered = 0;
                that.comboItems.forEach(function (item) {
                    if (_item.item_name == item.item_name) {
                        _item.item_ordered = item.item_ordered;
                    }
                });
                _item.item_count = 0;
                items.push(_item);
            });
            var categories = that.getCategories(items);
            that.initializeCategories(categories, items);
        });
    };
    ComboEditPage.prototype.getCategories = function (items) {
        var _categoryList = [];
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (!(_categoryList.includes(item.item_type))) {
                _categoryList.push(item.item_type);
            }
        }
        return _categoryList;
    };
    ComboEditPage.prototype.initializeCategories = function (categories, items) {
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
    ComboEditPage.prototype.getItemsUnderCategory = function (category, items) {
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
    ComboEditPage.prototype.viewItems = function () {
        this.orderedItemsList = this.gatherOrder();
        var basket = this.modalCtrl.create(BasketPage, { orderedItems: this.orderedItemsList });
        basket.present();
    };
    ComboEditPage.prototype.itemPanned = function (e, item) {
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
    ComboEditPage.prototype.itemTapped = function (e, item) {
        console.log(e.center);
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
    ComboEditPage.prototype.itemIsOrdered = function (e, item) {
        // Function under renovation.
        // var className = "item item-block item-md"
        // if (item.item_count > 0) {
        // 	e.target.offsetParent.className = className + " ordered"
        // } else {
        // 	e.target.offsetParent.className = className
        // }
    };
    ComboEditPage.prototype.gatherOrder = function () {
        var _list = [];
        for (var _i = 0, _a = this.categoryList; _i < _a.length; _i++) {
            var category = _a[_i];
            console.log(category.items);
            for (var _b = 0, _c = category.items; _b < _c.length; _b++) {
                var item = _c[_b];
                if (item.item_ordered > 0) {
                    _list.push(item);
                }
            }
        }
        return _list;
    };
    ComboEditPage.prototype.presentActionSheet = function () {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: 'More options',
            buttons: [
                {
                    cssClass: 'danger',
                    icon: 'close',
                    text: 'Delete',
                    handler: function () {
                        _this.deleteCombo();
                        _this.navCtrl.pop();
                    }
                }
            ]
        });
        actionSheet.present();
    };
    ComboEditPage.prototype.filter = function (name, keyword) {
        var _filter = new RegExp(keyword, 'gi');
        if (_filter.test(name)) {
            return true;
        }
        return false;
    };
    ComboEditPage.prototype.isEmpty = function (items, keyword) {
        var _filter = new RegExp(keyword, 'gi');
        for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
            var item = items_2[_i];
            if (_filter.test(item.item_name)) {
                return false;
            }
        }
        return true;
    };
    ComboEditPage.prototype.errorAlert = function (error) {
        console.log(error.message);
        var errorAlert = this.alertCtrl.create({
            title: "ERROR",
            message: error.message,
            buttons: [
                {
                    text: "Oops",
                    handler: function (_) {
                        console.log("Error alert closed.");
                    }
                }
            ]
        });
        errorAlert.present();
    };
    __decorate([
        ViewChild('combo_name'),
        __metadata("design:type", Object)
    ], ComboEditPage.prototype, "combo_name", void 0);
    ComboEditPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-combo-edit',
            templateUrl: 'combo-edit.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AlertController,
            Events,
            ModalController,
            ActionSheetController,
            Platform,
            LoadingController,
            AngularFireAuth,
            AngularFirestore,
            ToastController])
    ], ComboEditPage);
    return ComboEditPage;
}());
export { ComboEditPage };
//# sourceMappingURL=combo-edit.js.map
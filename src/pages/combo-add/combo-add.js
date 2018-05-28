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
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController, LoadingController, Events, Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { BasketPage } from '../basket/basket';
/*
 *  This page will show the items inside the selected menu.
 *  This will be the last page in the process of adding a combo.
 *  The functions are similar with placing an order but instead,
 *  the combinations of the items are saved instead along with
 *  a name that is provided by the user.
 */
var ComboAddPage = /** @class */ (function () {
    function ComboAddPage(navCtrl, navParams, alertCtrl, events, modalCtrl, toastCtrl, loadingCtrl, platform, fire, firestore) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.platform = platform;
        this.fire = fire;
        this.firestore = firestore;
        this.totalItemCount = 0;
        this.categoryList = [];
        this.orderedItemsList = [];
        this.diner_id = this.navParams.get('data');
        this.dinerCollectionRef = this.firestore.collection('diners');
        this.itemCollectionRef = this.dinerCollectionRef.doc(this.diner_id).collection('items');
        this.customerDocRef = this.firestore.collection('customers').doc(this.fire.auth.currentUser.uid);
        this.combosCollectionRef = this.customerDocRef.collection('combos');
    }
    ComboAddPage.prototype.getCategoryList = function () {
        var categories = [];
        for (var i = this.itemList.length - 1; i >= 0; i--) {
            if (!(categories.includes(this.itemList[i].item_type))) {
                console.log(this.itemList[i].item_type);
                categories.push(this.itemList[i].item_type);
            }
        }
        return categories;
    };
    ComboAddPage.prototype.createCategory = function (title, items) {
        this.categoryList.push({
            title: title,
            items: items
        });
        console.log("Created category: " + title);
        console.log("has the following items: ");
        console.log(items);
    };
    ComboAddPage.prototype.confirmQR = function () {
        console.log("Open confirm modal.");
    };
    ComboAddPage.prototype.getItems = function () {
        var that = this;
        var items = [];
        this.itemCollectionRef.ref.get()
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
    ComboAddPage.prototype.getCategories = function (items) {
        var _categoryList = [];
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (!(_categoryList.includes(item.item_type))) {
                _categoryList.push(item.item_type);
            }
        }
        return _categoryList;
    };
    ComboAddPage.prototype.initializeCategories = function (categories, items) {
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
    ComboAddPage.prototype.getItemsUnderCategory = function (category, items) {
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
    ComboAddPage.prototype.viewItems = function () {
        var count = 0;
        this.orderedItemsList = this.gatherOrder();
        this.orderedItemsList.forEach(function (doc) {
            count = count + Number(doc.item_ordered);
        });
        this.itemCount = count;
        var basket = this.modalCtrl.create(BasketPage, { orderedItems: this.orderedItemsList });
        basket.present();
    };
    ComboAddPage.prototype.createCombo = function () {
        var _this = this;
        this.orderedItemsList = this.gatherOrder();
        var loading = this.loadingCtrl.create({ content: "<ion-spinner name=\"cresent\"></ion-spinner>" });
        loading.present();
        var that = this;
        var cost = 0;
        var name = this.combo_name.value;
        if (name == "") {
            name = "Combo";
        }
        this.orderedItemsList.forEach(function (doc) {
            cost += Number(doc.item_price * doc.item_ordered);
        });
        this.customerDocRef.ref.get()
            .then(function (doc) {
            var id = that.firestore.createId();
            that.combosCollectionRef.doc(id).set({
                combo_id: id,
                combo_name: name,
                diner_id: that.diner_id,
                combo_cost: cost,
                items: that.orderedItemsList
            })
                .then(function (_) {
                var alert = _this.alertCtrl.create({
                    title: "Combo Added!",
                    message: "You can now try ordering you new combo.",
                    buttons: [{
                            text: "Sweet!",
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
        })
            .catch(function (error) {
            loading.dismiss();
            that.errorAlert(error);
        });
    };
    ComboAddPage.prototype.errorAlert = function (error) {
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
    ComboAddPage.prototype.itemPanned = function (e, item) {
        if (e.additionalEvent == "panright") {
            item.item_count++;
        }
        else if (e.additionalEvent == "panleft") {
            item.item_count--;
        }
        if (item.item_count < 0) {
            item.item_count = 0;
        }
        item.item_ordered = Math.floor(item.item_count / 5);
        this.totalItemCount = this.totalItemCount + item.item_ordered;
    };
    ComboAddPage.prototype.itemTapped = function (e, item) {
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
        // this.itemIsOrdered(e, item)
    };
    // itemIsOrdered(e, item){
    // 	var className = "item item-block item-md"
    // 	if (item.item_count > 0) {
    // 		e.target.offsetParent.className = className + " ordered"
    // 	} else {
    // 		e.target.offsetParent.className = className
    // 	}
    // }
    ComboAddPage.prototype.gatherOrder = function () {
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
        console.log(_list);
        return _list;
    };
    ComboAddPage.prototype.ionViewDidLoad = function () {
        this.getItems();
        console.log('ionViewDidLoad ComboPage');
    };
    ComboAddPage.prototype.filter = function (name, keyword) {
        var _filter = new RegExp(keyword, 'gi');
        if (_filter.test(name)) {
            return true;
        }
        return false;
    };
    ComboAddPage.prototype.isEmpty = function (items, keyword) {
        var _filter = new RegExp(keyword, 'gi');
        for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
            var item = items_2[_i];
            if (_filter.test(item.item_name)) {
                return false;
            }
        }
        return true;
    };
    __decorate([
        ViewChild('combo_name'),
        __metadata("design:type", Object)
    ], ComboAddPage.prototype, "combo_name", void 0);
    ComboAddPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-combo-add',
            templateUrl: 'combo-add.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AlertController,
            Events,
            ModalController,
            ToastController,
            LoadingController,
            Platform,
            AngularFireAuth,
            AngularFirestore])
    ], ComboAddPage);
    return ComboAddPage;
}());
export { ComboAddPage };
//# sourceMappingURL=combo-add.js.map
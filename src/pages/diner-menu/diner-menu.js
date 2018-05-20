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
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ItemEditPage } from "../item-edit/item-edit";
import { ItemAddPage } from "../item-add/item-add";
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the DinerMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DinerMenuPage = /** @class */ (function () {
    function DinerMenuPage(navCtrl, navParams, loadingCtrl, alertCtrl, fire, firestore) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.fire = fire;
        this.firestore = firestore;
        this.categoryList = [];
        this.loading = this.loadingCtrl.create({
            dismissOnPageChange: true,
            content: "<ion-spinner name=\"cresent\"></ion-spinner>"
        });
        this.loading.present();
        this.uid = fire.auth.currentUser.uid;
        this.diner = this.firestore.collection('diners').doc(this.uid);
        this.itemsCollectionRef = this.firestore.collection('diners').doc(this.uid).collection('items');
        this.items = this.itemsCollectionRef.valueChanges();
    }
    DinerMenuPage.prototype.ionViewWillEnter = function () {
        this.retrieveMenu();
    };
    DinerMenuPage.prototype.ionViewDidLoad = function () {
        this.getDiner();
        console.log('ionViewDidLoad DinerMenuPage');
    };
    DinerMenuPage.prototype.filter = function (name, keyword) {
        var _filter = new RegExp(keyword, 'gi');
        if (_filter.test(name)) {
            return true;
        }
        return false;
    };
    DinerMenuPage.prototype.isEmpty = function (items, keyword) {
        var _filter = new RegExp(keyword, 'gi');
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (_filter.test(item.item_name)) {
                return false;
            }
        }
        return true;
    };
    DinerMenuPage.prototype.retrieveMenu = function () {
        var items = [];
        var that = this;
        this.itemsCollectionRef.ref.get()
            .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                items.push(doc.data());
            });
            var categories = that.getAllCategories(items);
            that.initializeCategories(categories, items);
        });
    };
    DinerMenuPage.prototype.getAllCategories = function (items) {
        var _categoryList = [];
        for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
            var item = items_2[_i];
            if (!(_categoryList.includes(item.item_type))) {
                _categoryList.push(item.item_type);
            }
        }
        return _categoryList;
    };
    DinerMenuPage.prototype.initializeCategories = function (categories, items) {
        this.categoryList = [];
        var _items = [];
        for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
            var category = categories_1[_i];
            _items = this.getItemsUnderCategory(category, items);
            this.categoryList.push({
                title: category,
                items: _items
            });
        }
        this.loading.dismiss();
    };
    DinerMenuPage.prototype.getItemsUnderCategory = function (category, items) {
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
    DinerMenuPage.prototype.addItem = function () {
        this.navCtrl.push(ItemAddPage);
    };
    DinerMenuPage.prototype.editItem = function (item_id) {
        this.navCtrl.push(ItemEditPage, {
            data: item_id
        });
    };
    DinerMenuPage.prototype.deleteItem = function (item_id) {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'Farewell delicious food',
            message: 'Do you want to remove from the menu?',
            buttons: [
                {
                    text: 'Remove',
                    handler: function () {
                        console.log('Disagree clicked');
                        _this.itemsCollectionRef.doc(item_id).delete();
                    }
                },
                {
                    text: 'No!',
                    handler: function () {
                        console.log('Agree clicked');
                    }
                }
            ]
        });
        confirm.present();
    };
    DinerMenuPage.prototype.getDiner = function () {
        var that = this;
        this.diner.ref.get()
            .then(function (doc) {
            that.dinername = doc.data().dine_name + "'s Menu";
        });
    };
    DinerMenuPage.prototype.closePage = function () {
        this.navCtrl.pop();
    };
    DinerMenuPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-diner-menu',
            templateUrl: 'diner-menu.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            AlertController,
            AngularFireAuth,
            AngularFirestore])
    ], DinerMenuPage);
    return DinerMenuPage;
}());
export { DinerMenuPage };
//# sourceMappingURL=diner-menu.js.map
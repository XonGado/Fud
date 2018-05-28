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
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the ItemAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ItemAddPage = /** @class */ (function () {
    function ItemAddPage(navCtrl, navParams, loadingCtrl, alertCtrl, firestore, fire) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.firestore = firestore;
        this.fire = fire;
        this.uid = this.fire.auth.currentUser.uid;
        this.itemsCollectionRef = this.firestore.collection('diners').doc(this.uid).collection('items');
        this.items = this.itemsCollectionRef.valueChanges();
    }
    ItemAddPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ItemAddPage');
    };
    ItemAddPage.prototype.addItem = function () {
        var that = this;
        var loading = this.loadingCtrl.create({ content: "<ion-spinner name=\"cresent\"></ion-spinner>" });
        loading.present();
        var id = this.firestore.createId();
        this.itemsCollectionRef.doc(id).set({
            item_id: id,
            item_name: this.item_name.value,
            item_description: this.item_description.value,
            item_price: this.item_price.value,
            item_type: this.item_type.value,
            item_availability: true,
            item_visibility: true,
            lock: false
        })
            .then(function (_) {
            var alert = that.alertCtrl.create({
                title: "Food added!",
                message: "The customers can't wait to try this out.",
                buttons: [{
                        text: "Nice!",
                        handler: function (_) { that.navCtrl.pop(); }
                    }]
            });
            loading.dismiss();
            alert.present();
        })
            .catch(function (error) {
            console.log("Error: ", error.code);
        });
    };
    __decorate([
        ViewChild('item_name'),
        __metadata("design:type", Object)
    ], ItemAddPage.prototype, "item_name", void 0);
    __decorate([
        ViewChild('item_type'),
        __metadata("design:type", Object)
    ], ItemAddPage.prototype, "item_type", void 0);
    __decorate([
        ViewChild('item_price'),
        __metadata("design:type", Object)
    ], ItemAddPage.prototype, "item_price", void 0);
    __decorate([
        ViewChild('item_description'),
        __metadata("design:type", Object)
    ], ItemAddPage.prototype, "item_description", void 0);
    ItemAddPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-item-add',
            templateUrl: 'item-add.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            AlertController,
            AngularFirestore,
            AngularFireAuth])
    ], ItemAddPage);
    return ItemAddPage;
}());
export { ItemAddPage };
//# sourceMappingURL=item-add.js.map
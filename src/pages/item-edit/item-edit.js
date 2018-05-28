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
 * Generated class for the ItemEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ItemEditPage = /** @class */ (function () {
    function ItemEditPage(navCtrl, loadingCtrl, alertCtrl, navParams, firestore, fire) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.navParams = navParams;
        this.firestore = firestore;
        this.fire = fire;
        this.item_id = navParams.get('data');
        this.itemsCollectionRef = this.firestore.collection('diners').doc(this.fire.auth.currentUser.uid).collection('items');
    }
    ItemEditPage.prototype.ionViewDidLoad = function () {
        this.fetchData(this.item_id);
        console.log('ionViewDidLoad ItemEditPage');
    };
    ItemEditPage.prototype.fetchData = function (item_id) {
        var that = this;
        this.itemsCollectionRef.doc(item_id).ref.get()
            .then(function (doc) {
            that.item_id = doc.data().item_id;
            that.item_name = doc.data().item_name;
            that.item_type = doc.data().item_type;
            that.item_price = doc.data().item_price;
            that.item_description = doc.data().item_description;
            that.visibility = doc.data().item_visibility;
            that.availability = doc.data().item_availability;
            console.log("Fetched data:");
            console.log("Visibility: " + that.visibility);
            console.log("Availability: " + that.availability);
        })
            .catch(function (error) {
            console.log("Error: ", error.code);
        });
    };
    ItemEditPage.prototype.updateItem = function () {
        var _this = this;
        var that = this;
        var loading = this.loadingCtrl.create({ content: "<ion-spinner name=\"cresent\"></ion-spinner>" });
        loading.present();
        this.itemsCollectionRef.doc(this.item_id).update({
            item_id: this.item_id,
            item_name: this.name.value,
            item_type: this.type.value,
            item_price: this.price.value,
            item_description: this.description.value,
            item_visibility: this.visibility,
            item_availability: this.availability
        })
            .then(function (_) {
            var alert = _this.alertCtrl.create({
                title: "Changed Item!",
                message: "We'll see if the customers like it!",
                buttons: [{
                        text: "Okay!",
                        handler: function (_) {
                            that.navCtrl.pop();
                        }
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
    ItemEditPage.prototype.errorAlert = function (error) {
        console.log(error.message);
        var errorAlert = this.alertCtrl.create({
            title: "ERROR",
            message: error.message,
            buttons: [{
                    text: "Oops",
                    handler: function (_) { console.log("Error alert closed."); }
                }]
        });
        errorAlert.present();
    };
    __decorate([
        ViewChild('name'),
        __metadata("design:type", Object)
    ], ItemEditPage.prototype, "name", void 0);
    __decorate([
        ViewChild('type'),
        __metadata("design:type", Object)
    ], ItemEditPage.prototype, "type", void 0);
    __decorate([
        ViewChild('price'),
        __metadata("design:type", Object)
    ], ItemEditPage.prototype, "price", void 0);
    __decorate([
        ViewChild('description'),
        __metadata("design:type", Object)
    ], ItemEditPage.prototype, "description", void 0);
    ItemEditPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-item-edit',
            templateUrl: 'item-edit.html',
        }),
        __metadata("design:paramtypes", [NavController,
            LoadingController,
            AlertController,
            NavParams,
            AngularFirestore,
            AngularFireAuth])
    ], ItemEditPage);
    return ItemEditPage;
}());
export { ItemEditPage };
//# sourceMappingURL=item-edit.js.map
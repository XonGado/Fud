var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Geolocation } from '@ionic-native/geolocation';
var CustLocatePage = /** @class */ (function () {
    function CustLocatePage(navCtrl, navParams, geolocation, alertCtrl, loadingCtrl, fire, firestore) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.geolocation = geolocation;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.fire = fire;
        this.firestore = firestore;
        this.order = this.navParams.get('order');
        this.diner_id = this.navParams.get('dinerID');
        console.log(this.order);
        console.log(this.diner_id);
        this.uid = this.fire.auth.currentUser.uid;
        this.dinerCollectionRef = this.firestore.collection('diners');
        this.customerDocRef = this.firestore.collection('customers').doc(this.uid);
        this.ordersCollectionRef = this.dinerCollectionRef.doc(this.diner_id).collection('orders');
        this.loadMap();
    }
    CustLocatePage.prototype.loadMap = function () {
        var _this = this;
        this.geolocation.getCurrentPosition().then(function (position) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            _this.map = new google.maps.Map(_this.mapElement.nativeElement, mapOptions);
            _this.marker = new google.maps.Marker({
                draggable: true,
                map: _this.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });
            _this.marker.setMap(_this.map);
            console.log("map is set");
        }, function (err) {
            console.log(err);
        });
    };
    CustLocatePage.prototype.confirmLocation = function () {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: "Delivery",
            message: 'We will deliver your food here.',
            buttons: [{
                    text: 'No',
                    handler: function () { confirm.dismiss(); }
                },
                {
                    text: 'Yes!',
                    handler: function () {
                        _this.location = {
                            latitude: _this.marker.getPosition().lat(),
                            longitude: _this.marker.getPosition().lng()
                        };
                        _this.placeOrder();
                    }
                }
            ]
        });
        confirm.present();
    };
    CustLocatePage.prototype.placeOrder = function () {
        // Saving to database
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: "<ion-spinner name='cresent'></ion-spinner>"
        });
        loading.present();
        var customer_name;
        var customer_id;
        var id = this.firestore.createId();
        var that = this;
        var price = 0;
        var count = 0;
        var orderNumber = 0;
        this.order.forEach(function (doc) {
            price = price + Number(doc.item_price * doc.item_ordered);
            count = count + Number(doc.item_ordered);
        });
        this.ordersCollectionRef.ref.get()
            .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                orderNumber += 1;
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
                order_type: 2,
                totalItems: count,
                orderNumber: orderNumber,
                location: that.location
            })
                .then(function () {
                var alert = that.alertCtrl.create({
                    title: "Order Placed!",
                    subTitle: "We'll be delivering your food.",
                    buttons: [{
                            text: "Okay!",
                            handler: function () {
                                that.navCtrl.popToRoot();
                            }
                        }]
                });
                loading.dismiss();
                alert.present();
            });
        })
            .then(function (doc) {
            var that = _this;
            that.order.forEach(function (doc) {
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
    CustLocatePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CustLocatePage');
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], CustLocatePage.prototype, "mapElement", void 0);
    CustLocatePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-cust-locate',
            templateUrl: 'cust-locate.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Geolocation,
            AlertController,
            LoadingController,
            AngularFireAuth,
            AngularFirestore])
    ], CustLocatePage);
    return CustLocatePage;
}());
export { CustLocatePage };
//# sourceMappingURL=cust-locate.js.map
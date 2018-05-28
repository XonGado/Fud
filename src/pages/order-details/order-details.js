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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Geolocation } from '@ionic-native/geolocation';
/**
 * Generated class for the OrderDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var OrderDetailsPage = /** @class */ (function () {
    function OrderDetailsPage(navCtrl, navParams, geolocation, fire, firestore) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.geolocation = geolocation;
        this.fire = fire;
        this.firestore = firestore;
        this.items = [];
        this.ordereditems_id = [];
        this.orderLocation = null;
        this.order_id = this.navParams.get('data');
        this.orderDocRef = this.firestore.collection('diners').doc(this.fire.auth.currentUser.uid).collection('orders').doc(this.order_id);
        this.orderedItemsColRef = this.orderDocRef.collection('OrderedItems');
        this.getOrderDetails();
    }
    OrderDetailsPage.prototype.getOrderDetails = function () {
        var that = this;
        this.orderDocRef.ref.get()
            .then(function (doc) {
            that.customer_name = doc.data().customer_name;
            that.order_cost = doc.data().order_cost;
            that.lock = doc.data().lock;
            that.orderType = doc.data().order_type;
            if (doc.data().order_type == 2) {
                console.log(that.orderType);
                that.orderLocation = doc.data().location;
                that.loadMap();
            }
            else {
                // Hide map here
            }
        });
        this.orderedItemsColRef.ref.get()
            .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                that.items.push(doc.data());
                that.ordereditems_id.push(doc.id);
            });
            for (var i = 0; i < that.items.length; i++) {
                that.items[i].lock = false;
            }
        });
    };
    OrderDetailsPage.prototype.clearOrder = function () {
        this.orderDocRef.ref.update({
            cleared: true
        });
        this.navCtrl.pop();
    };
    OrderDetailsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad OrderDetailsPage');
    };
    OrderDetailsPage.prototype.changeLock = function (item, index) {
        var ordereditemsid = this.ordereditems_id[index];
        this.orderedItemsColRef.doc(ordereditemsid).ref.update({
            lock: item.lock
        });
    };
    OrderDetailsPage.prototype.loadMap = function () {
        var latLng = new google.maps.LatLng(this.orderLocation.latitude, this.orderLocation.longitude);
        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });
        this.marker.setMap(this.map);
        console.log("map is set");
    };
    OrderDetailsPage.prototype.locksEnabled = function () {
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.lock == false) {
                return false;
            }
        }
        return true;
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], OrderDetailsPage.prototype, "mapElement", void 0);
    OrderDetailsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-order-details',
            templateUrl: 'order-details.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Geolocation,
            AngularFireAuth,
            AngularFirestore])
    ], OrderDetailsPage);
    return OrderDetailsPage;
}());
export { OrderDetailsPage };
//# sourceMappingURL=order-details.js.map
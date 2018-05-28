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
import { IonicPage, NavController, NavParams, MenuController, ToastController, Slides } from 'ionic-angular';
import { CustProfilePage } from '../cust-profile/cust-profile';
import { MenusPage } from '../menus/menus';
import { OrderPage } from '../order/order';
import { ComboPage } from '../combo/combo';
import { CustViewOrderPage } from '../cust-view-order/cust-view-order';
import { CustViewDinerPage } from '../cust-view-diner/cust-view-diner';
import { CustScanPage } from '../cust-scan/cust-scan';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Geolocation } from '@ionic-native/geolocation';
var CustHomePage = /** @class */ (function () {
    function CustHomePage(navCtrl, navParams, menu, toastCtrl, fire, firestore, geolocation) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.menu = menu;
        this.toastCtrl = toastCtrl;
        this.fire = fire;
        this.firestore = firestore;
        this.geolocation = geolocation;
        this.diner_ids = [];
        this.order_ids = [];
        this.customerCount = [];
        this.dinerDistances = [];
        var that = this;
        this.view = "diner";
        this.uid = fire.auth.currentUser.uid;
        this.firestore.collection('customers').doc(this.uid).ref.get()
            .then(function (doc) {
            that.name = doc.data().cust_name;
            that.email = doc.data().cust_email;
        });
        this.dinersCollectionRef = this.firestore.collection('diners');
        this.dinerList = this.retrieveDiners();
        this.customerCount = this.getCount();
    }
    CustHomePage.prototype.ionViewWillEnter = function () {
        this.dinerList = this.retrieveDiners();
        this.userHasOrdered();
        this.loadMap();
    };
    CustHomePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad HomeCustPage');
        this.menu.enable(true);
        this.userHasOrdered();
        this.setupSlides();
    };
    CustHomePage.prototype.setupSlides = function () {
        this.slides.centeredSlides = false;
        this.slides.lockSwipes(false);
        // this.slides.direction = "vertical"
    };
    CustHomePage.prototype.slide = function (index) {
        this.slides.slideTo(index);
        // if (index == 0){
        // 	this.view = "diner"
        // 	this.slides.lockSwipes(false)
        // } else {
        // 	this.view = "map"
        // 	this.slides.lockSwipes(true)
        // }
    };
    // ionSlideDidChange(){
    // 	console.log("Swiped!")
    // 	let index = this.slides.getActiveIndex()
    // 	if (index == 0){
    // 		this.view = "diner"
    // 		this.slides.lockSwipes(false)
    // 	} else {
    // 		this.view = "map"
    // 		this.slides.lockSwipes(true)
    // 	}
    // }
    CustHomePage.prototype.menuToggle = function () {
        this.menu.enable(true);
        this.menu.toggle();
    };
    CustHomePage.prototype.rad = function (x) {
        return x * Math.PI / 180;
    };
    CustHomePage.prototype.getDistance = function (p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(p2.lat() - p1.lat());
        var dLong = this.rad(p2.lng() - p1.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return (d / 1000).toFixed(1); // returns the distance in meter
    };
    CustHomePage.prototype.loadMap = function () {
        var _this = this;
        var that = this;
        this.geolocation.getCurrentPosition().then(function (position) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            that.userLocation = latLng;
            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            _this.map = new google.maps.Map(_this.mapElement.nativeElement, mapOptions);
            var marker = new google.maps.Marker({
                map: _this.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });
            var content = "You are here";
            _this.addInfoWindow(marker, content);
            marker.setMap(_this.map);
            var cityCircle = new google.maps.Circle({
                strokeColor: '#00FF00',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: 'transparent',
                map: _this.map,
                center: latLng,
                radius: 1500
            });
        }, function (err) {
            console.log("Error!");
        });
    };
    CustHomePage.prototype.getCount = function () {
        var that = this;
        var counter = [];
        this.dinersCollectionRef.ref.get()
            .then(function (querySnapshot) {
            that.diner_ids.forEach(function (id) {
                that.dinersCollectionRef.doc(id).collection('orders').ref.where("cleared", "==", false).get()
                    .then(function (querySnapshot) {
                    counter.push(querySnapshot.size);
                });
            });
        });
        return counter;
    };
    CustHomePage.prototype.addDinerMarkers = function () {
        for (var _i = 0, _a = this.dinerList; _i < _a.length; _i++) {
            var diner = _a[_i];
            var latLng = new google.maps.LatLng(diner.dine_location.latitude, diner.dine_location.longitude);
            console.log(latLng);
            console.log(this.userLocation);
            this.dinerDistances.push(this.getDistance(this.userLocation, latLng));
            var marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });
            var content = "<h4>" + diner.dine_name + "</h4>" +
                "<span>" + diner.dine_address + "</span>";
            this.addInfoWindow(marker, content);
            marker.setMap(this.map);
        }
        console.log(this.dinerDistances);
    };
    CustHomePage.prototype.addInfoWindow = function (marker, content) {
        var _this = this;
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(_this.map, marker);
        });
    };
    CustHomePage.prototype.retrieveDiners = function () {
        var _diners = [];
        var that = this;
        this.dinersCollectionRef.ref.get()
            .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                _diners.push(doc.data());
                that.diner_ids.push(doc.id);
            });
        })
            .then(function () {
            that.userHasOrdered();
            that.addDinerMarkers();
        });
        return _diners;
    };
    CustHomePage.prototype.userHasOrdered = function () {
        var that = this;
        var order = [];
        var _loop_1 = function () {
            var id = this_1.diner_ids[i];
            this_1.dinersCollectionRef.doc(id).collection('orders').ref.where("customer_id", "==", that.uid).where("cleared", "==", false).get()
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
    CustHomePage.prototype.orderHere = function (index) {
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
            var that = this;
            this.navCtrl.push(OrderPage, {
                data: that.diner_ids[index]
            });
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
    CustHomePage.prototype.viewMyOrder = function () {
        this.navCtrl.push(CustViewOrderPage, {
            dinerID: this.dinerID,
            orderID: this.orderID
        });
    };
    CustHomePage.prototype.viewDiner = function (index) {
        this.navCtrl.push(CustViewDinerPage, {
            dinerID: this.diner_ids[index]
        });
    };
    CustHomePage.prototype.openProfile = function () {
        this.navCtrl.push(CustProfilePage);
    };
    CustHomePage.prototype.openCombo = function () {
        this.navCtrl.push(ComboPage);
    };
    CustHomePage.prototype.openScanner = function () {
        this.navCtrl.push(CustScanPage);
    };
    CustHomePage.prototype.openMenus = function () {
        this.navCtrl.push(MenusPage);
    };
    CustHomePage.prototype.logout = function () {
        this.fire.auth.signOut();
    };
    __decorate([
        ViewChild(Slides),
        __metadata("design:type", Slides)
    ], CustHomePage.prototype, "slides", void 0);
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], CustHomePage.prototype, "mapElement", void 0);
    CustHomePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-cust-home',
            templateUrl: 'cust-home.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            MenuController,
            ToastController,
            AngularFireAuth,
            AngularFirestore,
            Geolocation])
    ], CustHomePage);
    return CustHomePage;
}());
export { CustHomePage };
//# sourceMappingURL=cust-home.js.map
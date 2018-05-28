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
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Geolocation } from '@ionic-native/geolocation';
var DinerLocatePage = /** @class */ (function () {
    function DinerLocatePage(navCtrl, navParams, geolocation, alertCtrl, fire, firestore) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.geolocation = geolocation;
        this.alertCtrl = alertCtrl;
        this.fire = fire;
        this.firestore = firestore;
        this.uid = this.fire.auth.currentUser.uid;
        this.dinerDocRef = this.firestore.collection('diners').doc(this.uid);
        this.loadMap();
    }
    DinerLocatePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DinerLocatePage');
    };
    DinerLocatePage.prototype.loadMap = function () {
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
    DinerLocatePage.prototype.checkMarkerLocation = function () {
        console.log("latitude: " + this.marker.position.lat + ", longitude: " + this.marker.position.lng);
    };
    DinerLocatePage.prototype.confirmMapSetting = function () {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: "Set Location",
            message: 'Your location will be changed',
            buttons: [
                {
                    text: 'No',
                    handler: function () {
                        confirm.dismiss();
                    }
                },
                {
                    text: 'Set',
                    handler: function () {
                        _this.setLocation();
                    }
                }
            ]
        });
        confirm.present();
    };
    DinerLocatePage.prototype.setLocation = function () {
        this.dinerDocRef.update({
            dine_location: {
                latitude: this.marker.getPosition().lat(),
                longitude: this.marker.getPosition().lng()
            }
        });
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], DinerLocatePage.prototype, "mapElement", void 0);
    DinerLocatePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-diner-locate',
            templateUrl: 'diner-locate.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Geolocation,
            AlertController,
            AngularFireAuth,
            AngularFirestore])
    ], DinerLocatePage);
    return DinerLocatePage;
}());
export { DinerLocatePage };
//# sourceMappingURL=diner-locate.js.map
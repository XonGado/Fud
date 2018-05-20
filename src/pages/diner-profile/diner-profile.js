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
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { DinerProfileEditPage } from '../diner-profile-edit/diner-profile-edit';
var DinerProfilePage = /** @class */ (function () {
    function DinerProfilePage(navCtrl, navParams, fire, firestore) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.fire = fire;
        this.firestore = firestore;
        this.uid = this.fire.auth.currentUser.uid;
        this.dinerDocRef = this.firestore.collection('diners').doc(this.uid);
    }
    DinerProfilePage.prototype.ionViewDidLoad = function () {
        this.fetchData();
        console.log('ionViewDidLoad DinerProfilePage');
    };
    DinerProfilePage.prototype.fetchData = function () {
        var that = this;
        this.dinerDocRef.ref.get()
            .then(function (doc) {
            console.log(doc.data());
            that.address = doc.data().dine_address,
                that.email = doc.data().dine_email,
                that.name = doc.data().dine_name,
                that.number = doc.data().dine_number,
                that.owner_name = doc.data().dine_owner_name,
                that.username = doc.data().dine_username,
                that.weblink = doc.data().dine_weblink,
                that.location = doc.data().dine_location;
            that.loadMap();
        });
    };
    DinerProfilePage.prototype.openEditProfile = function () {
        this.navCtrl.push(DinerProfileEditPage);
    };
    DinerProfilePage.prototype.loadMap = function () {
        console.log("Loading map...");
        console.log(this.location.latitude + " " + this.location.longitude);
        var latLng = new google.maps.LatLng(this.location.latitude, this.location.longitude);
        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        var marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });
        marker.setMap(this.map);
        console.log("Map loaded.");
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], DinerProfilePage.prototype, "mapElement", void 0);
    DinerProfilePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-diner-profile',
            templateUrl: 'diner-profile.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AngularFireAuth, AngularFirestore])
    ], DinerProfilePage);
    return DinerProfilePage;
}());
export { DinerProfilePage };
//# sourceMappingURL=diner-profile.js.map
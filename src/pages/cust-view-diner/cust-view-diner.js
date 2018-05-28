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
var CustViewDinerPage = /** @class */ (function () {
    function CustViewDinerPage(navCtrl, navParams, alertCtrl, fire, firestore) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.fire = fire;
        this.firestore = firestore;
        var that = this;
        this.dinerRef = this.firestore.collection('diners').doc(this.navParams.get('dinerID'));
        this.dinerRef.ref.get().then(function (doc) {
            console.log(doc.data());
            that.name = doc.data().dine_name;
            that.email = doc.data().dine_email;
            that.address = doc.data().dine_address;
            that.number = doc.data().dine_number;
            that.location = doc.data().dine_location;
        }).then(function (_) {
            that.loadMap(that.location);
        });
    }
    CustViewDinerPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CustViewCafePage');
    };
    CustViewDinerPage.prototype.loadMap = function (location) {
        console.log("Loading map...");
        console.log(location.latitude + " " + location.longitude);
        var latLng = new google.maps.LatLng(location.latitude, location.longitude);
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
    CustViewDinerPage.prototype.favorite = function () {
        var that = this;
        var dinerID = this.navParams.get("dinerID");
        var userID = this.fire.auth.currentUser.uid;
        var user = this.firestore.collection("customers").doc(userID);
        var _favorites = [];
        user.ref.get().then(function (doc) {
            var retrievedFaves = doc.data().favorites;
            console.log(retrievedFaves);
            if (retrievedFaves != undefined) {
                _favorites = retrievedFaves;
            }
        }).then(function (_) {
            if (!_favorites.includes(dinerID)) {
                console.log("Diner id is added in your favorites.");
                _favorites.push(dinerID);
            }
        }).then({
            this: .firestore.collection("customers").doc(userID).update({
                favorites: _favorites
            }).then(function (_) {
                var alert = that.alertCtrl.create({
                    title: "Favorite",
                    message: "You will now be updated about " + that.name + ".",
                    buttons: [{
                            text: "Great!",
                            handler: function (_) {
                                console.log("Should update button.");
                            }
                        }]
                });
                alert.present();
            })
                .catch(function (error) {
                console.log(error.message);
            })
        });
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], CustViewDinerPage.prototype, "mapElement", void 0);
    CustViewDinerPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-cust-view-diner',
            templateUrl: 'cust-view-diner.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AlertController, AngularFireAuth, AngularFirestore])
    ], CustViewDinerPage);
    return CustViewDinerPage;
}());
export { CustViewDinerPage };
//# sourceMappingURL=cust-view-diner.js.map
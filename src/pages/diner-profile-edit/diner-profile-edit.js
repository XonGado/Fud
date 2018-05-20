var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { storage } from 'firebase';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { DinerLocatePage } from '../diner-locate/diner-locate';
import { Geolocation } from '@ionic-native/geolocation';
var DinerProfileEditPage = /** @class */ (function () {
    function DinerProfileEditPage(navCtrl, navParams, modalCtrl, alertCtrl, toastCtrl, loadingCtrl, geolocation, fire, firestore, camera, transfer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.fire = fire;
        this.firestore = firestore;
        this.camera = camera;
        this.transfer = transfer;
        this.unsaved = false;
        // initializeApp(FIREBASE_CONFIG)
        this.uid = fire.auth.currentUser.uid;
        this.dinerDocRef = this.firestore.collection('diners').doc(this.uid);
    }
    DinerProfileEditPage.prototype.ionViewDidLoad = function () {
        this.fetchData();
        console.log('ionViewDidLoad DinerProfileEditPage');
    };
    DinerProfileEditPage.prototype.fetchData = function () {
        var _this = this;
        var that = this;
        this.dinerDocRef.ref.get()
            .then(function (doc) {
            console.log(doc.data());
            that.address = doc.data().dine_address;
            that.email = doc.data().dine_email;
            that.name = doc.data().dine_name;
            that.number = doc.data().dine_number;
            that.owner_name = doc.data().dine_owner_name;
            that.username = doc.data().dine_username;
            that.weblink = doc.data().dine_weblink;
            that.location = doc.data().dine_location;
            _this.loadMap();
        });
    };
    DinerProfileEditPage.prototype.mapSettingsModal = function () {
        var locateModal = this.modalCtrl.create(DinerLocatePage, { userID: this.uid });
        locateModal.present();
    };
    DinerProfileEditPage.prototype.loadMap = function () {
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
    DinerProfileEditPage.prototype.saveChanges = function () {
        if (this.unsaved) {
            var save = this.alertCtrl.create({
                title: "Unsaved changes",
                message: 'The following were changed',
                buttons: [
                    {
                        text: 'No',
                        handler: function () {
                            console.log("User doesn't want to save.");
                        }
                    },
                    {
                        text: 'Save',
                        handler: function () {
                            console.log('User wants to save.');
                        }
                    }
                ]
            });
            save.present();
        }
    };
    DinerProfileEditPage.prototype.takePhoto = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, result, image, pictures, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        options = {
                            quality: 50,
                            targetHeight: 600,
                            targetWidth: 600,
                            destinationType: this.camera.DestinationType.DATA_URL,
                            encodingType: this.camera.EncodingType.JPEG,
                            mediaType: this.camera.MediaType.PICTURE,
                            correctOrientation: true
                        };
                        return [4 /*yield*/, this.camera.getPicture(options)];
                    case 1:
                        result = _a.sent();
                        image = 'data:image/jpeg;base64,${result}';
                        pictures = storage().ref('pictures');
                        pictures.putString(image, 'data_url');
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DinerProfileEditPage.prototype.getImage = function () {
        var _this = this;
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.imageURI = imageData;
        }, function (err) {
            console.log(err);
            _this.presentToast(err);
        });
    };
    DinerProfileEditPage.prototype.uploadFile = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();
        var fileTransfer = this.transfer.create();
        var options = {
            fileKey: 'ionicfile',
            fileName: 'ionicfile',
            chunkedMode: false,
            mimeType: "image/jpeg",
            headers: {}
        };
        fileTransfer.upload(this.imageURI, 'http://172.20.10.7:8100/api/uploadImage', options)
            .then(function (data) {
            console.log(data + " Uploaded Successfully");
            _this.imageFileName = "http://172.20.10.7:8100/static/images/ionicfile.jpg";
            loader.dismiss();
            _this.presentToast("Image uploaded successfully");
        }, function (err) {
            console.log(err);
            loader.dismiss();
            _this.presentToast(err);
        });
    };
    DinerProfileEditPage.prototype.presentToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    DinerProfileEditPage.prototype.getRouterIPAddress = function () {
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], DinerProfileEditPage.prototype, "mapElement", void 0);
    __decorate([
        ViewChild('dine_name'),
        __metadata("design:type", Object)
    ], DinerProfileEditPage.prototype, "dine_name", void 0);
    __decorate([
        ViewChild('dine_username'),
        __metadata("design:type", Object)
    ], DinerProfileEditPage.prototype, "dine_username", void 0);
    __decorate([
        ViewChild('dine_owner_name'),
        __metadata("design:type", Object)
    ], DinerProfileEditPage.prototype, "dine_owner_name", void 0);
    __decorate([
        ViewChild('dine_email'),
        __metadata("design:type", Object)
    ], DinerProfileEditPage.prototype, "dine_email", void 0);
    __decorate([
        ViewChild('dine_weblink'),
        __metadata("design:type", Object)
    ], DinerProfileEditPage.prototype, "dine_weblink", void 0);
    __decorate([
        ViewChild('dine_number'),
        __metadata("design:type", Object)
    ], DinerProfileEditPage.prototype, "dine_number", void 0);
    __decorate([
        ViewChild('dine_address'),
        __metadata("design:type", Object)
    ], DinerProfileEditPage.prototype, "dine_address", void 0);
    __decorate([
        ViewChild('dine_password'),
        __metadata("design:type", Object)
    ], DinerProfileEditPage.prototype, "dine_password", void 0);
    __decorate([
        ViewChild('dine_new_password'),
        __metadata("design:type", Object)
    ], DinerProfileEditPage.prototype, "dine_new_password", void 0);
    __decorate([
        ViewChild('dine_retypePassword'),
        __metadata("design:type", Object)
    ], DinerProfileEditPage.prototype, "dine_retypePassword", void 0);
    DinerProfileEditPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-diner-profile-edit',
            templateUrl: 'diner-profile-edit.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ModalController,
            AlertController,
            ToastController,
            LoadingController,
            Geolocation,
            AngularFireAuth,
            AngularFirestore,
            Camera,
            FileTransfer])
    ], DinerProfileEditPage);
    return DinerProfileEditPage;
}());
export { DinerProfileEditPage };
//# sourceMappingURL=diner-profile-edit.js.map
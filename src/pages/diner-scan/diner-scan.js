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
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
var DinerScanPage = /** @class */ (function () {
    function DinerScanPage(navCtrl, navParams, alertCtrl, barcodeScanner) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.barcodeScanner = barcodeScanner;
        this.qrData = null;
        this.createdCode = null;
        this.scannedCode = null;
    }
    DinerScanPage.prototype.createCode = function () {
        this.createdCode = this.qrData;
    };
    DinerScanPage.prototype.scanCode = function () {
        var _this = this;
        this.barcodeScanner.scan().then(function (barcodedData) {
            _this.scannedCode = barcodedData.text;
        });
    };
    DinerScanPage.prototype.errorAlert = function (error) {
        var errorAlert = this.alertCtrl.create({
            title: "ERROR",
            message: error.message,
            buttons: [{
                    text: "Okay",
                    handler: function (_) {
                        console.log("Hay nako.");
                    }
                }]
        });
    };
    DinerScanPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DinerScanPage');
    };
    DinerScanPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-diner-scan',
            templateUrl: 'diner-scan.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AlertController,
            BarcodeScanner])
    ], DinerScanPage);
    return DinerScanPage;
}());
export { DinerScanPage };
//# sourceMappingURL=diner-scan.js.map
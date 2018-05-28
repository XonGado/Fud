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
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
var CustScanPage = /** @class */ (function () {
    function CustScanPage(navCtrl, navParams, alertCtrl, barcodeScanner) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.barcodeScanner = barcodeScanner;
        this.qrData = null;
        this.createdCode = null;
        this.scannedCode = null;
    }
    CustScanPage.prototype.createCode = function () {
        this.createdCode = this.qrData;
    };
    CustScanPage.prototype.scanCode = function () {
        var _this = this;
        this.barcodeScanner.scan().then(function (barcodedData) {
            _this.scannedCode = barcodedData.text;
        });
    };
    CustScanPage.prototype.errorAlert = function (error) {
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
    CustScanPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DinerScanPage');
        this.scanCode();
    };
    CustScanPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-cust-scan',
            templateUrl: 'cust-scan.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AlertController,
            BarcodeScanner])
    ], CustScanPage);
    return CustScanPage;
}());
export { CustScanPage };
//# sourceMappingURL=cust-scan.js.map
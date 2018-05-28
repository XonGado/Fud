var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComboAddPage } from './combo-add';
var ComboAddPageModule = /** @class */ (function () {
    function ComboAddPageModule() {
    }
    ComboAddPageModule = __decorate([
        NgModule({
            declarations: [
                ComboAddPage,
            ],
            imports: [
                IonicPageModule.forChild(ComboAddPage),
            ],
        })
    ], ComboAddPageModule);
    return ComboAddPageModule;
}());
export { ComboAddPageModule };
//# sourceMappingURL=combo-add.module.js.map
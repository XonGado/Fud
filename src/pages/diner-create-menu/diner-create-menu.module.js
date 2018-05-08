var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DinerCreateMenuPage } from './diner-create-menu';
var DinerCreateMenuPageModule = /** @class */ (function () {
    function DinerCreateMenuPageModule() {
    }
    DinerCreateMenuPageModule = __decorate([
        NgModule({
            declarations: [
                DinerCreateMenuPage,
            ],
            imports: [
                IonicPageModule.forChild(DinerCreateMenuPage),
            ],
        })
    ], DinerCreateMenuPageModule);
    return DinerCreateMenuPageModule;
}());
export { DinerCreateMenuPageModule };
//# sourceMappingURL=diner-create-menu.module.js.map
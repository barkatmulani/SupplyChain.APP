"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ItemsPerPageSelectorComponent = /** @class */ (function () {
    function ItemsPerPageSelectorComponent() {
        this.itemsPerPageChanged = new core_1.EventEmitter();
        this.currentSelection = 0;
        this.itemsPerPageList = [10, 25, 50, 100];
        this.itemsPerPage = this.itemsPerPageList[0];
    }
    ItemsPerPageSelectorComponent.prototype.ngOnChanges = function () {
        this.itemsPerPage = this.itemsPerPageList[this.currentSelection];
    };
    ItemsPerPageSelectorComponent.prototype.onClick = function (i) {
        this.currentSelection = i;
        this.itemsPerPage = this.itemsPerPageList[i];
        this.itemsPerPageChanged.emit(this.itemsPerPageList[i]);
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], ItemsPerPageSelectorComponent.prototype, "itemsPerPageChanged", void 0);
    ItemsPerPageSelectorComponent = __decorate([
        core_1.Component({
            selector: "itemsperpageselector",
            moduleId: module.id,
            templateUrl: "itemsPerPageSelector.html",
        })
    ], ItemsPerPageSelectorComponent);
    return ItemsPerPageSelectorComponent;
}());
exports.ItemsPerPageSelectorComponent = ItemsPerPageSelectorComponent;
//# sourceMappingURL=itemsperpageselector.js.map
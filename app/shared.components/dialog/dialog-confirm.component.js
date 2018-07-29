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
var DialogConfirmComponent = /** @class */ (function () {
    function DialogConfirmComponent() {
        this.answerEvent = new core_1.EventEmitter();
    }
    DialogConfirmComponent.prototype.ngOnInit = function () { };
    DialogConfirmComponent.prototype.ngOnChanges = function () {
    };
    DialogConfirmComponent.prototype.onAnswerClicked = function (data) {
        this.answerEvent.emit(data);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DialogConfirmComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DialogConfirmComponent.prototype, "question", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DialogConfirmComponent.prototype, "visible", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], DialogConfirmComponent.prototype, "answerEvent", void 0);
    DialogConfirmComponent = __decorate([
        core_1.Component({
            selector: 'app-dialog-confirm',
            moduleId: module.id,
            templateUrl: './dialog-confirm.component.html',
        }),
        __metadata("design:paramtypes", [])
    ], DialogConfirmComponent);
    return DialogConfirmComponent;
}());
exports.DialogConfirmComponent = DialogConfirmComponent;
//# sourceMappingURL=dialog-confirm.component.js.map
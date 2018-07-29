"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var html = "";
describe('Component: ng2-table', function () {
    var fixture;
    var context;
    var element;
    var clean;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [TestTableComponent],
        });
        testing_1.TestBed.overrideComponent(TestTableComponent, { set: { template: html } });
        fixture = testing_1.TestBed.createComponent(TestTableComponent);
        context = fixture.componentInstance;
        element = fixture.nativeElement.querySelector('#c1');
        clean = fixture.nativeElement.querySelector('#c2');
        fixture.detectChanges();
    });
    it('should be true', function () {
        expect(true).toBe(true);
    });
});
var TestTableComponent = /** @class */ (function () {
    function TestTableComponent() {
    }
    TestTableComponent = __decorate([
        core_1.Component({
            selector: 'table-test',
            template: ''
        })
    ], TestTableComponent);
    return TestTableComponent;
}());
//# sourceMappingURL=ng-table.component.spec.js.map
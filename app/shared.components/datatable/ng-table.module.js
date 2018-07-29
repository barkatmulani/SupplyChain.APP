"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var dcl_component_1 = require("dcl-component/dcl-component");
var ng_table_component_1 = require("./table/ng-table.component");
var ng_table_filtering_directive_1 = require("./table/ng-table-filtering.directive");
var ng_table_paging_directive_1 = require("./table/ng-table-paging.directive");
var ng_table_sorting_directive_1 = require("./table/ng-table-sorting.directive");
var TableModule = /** @class */ (function () {
    function TableModule() {
    }
    TableModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, dcl_component_1.DCLModule],
            declarations: [ng_table_component_1.NgTable, ng_table_filtering_directive_1.NgTableFiltering, ng_table_paging_directive_1.NgTablePaging, ng_table_sorting_directive_1.NgTableSorting],
            exports: [ng_table_component_1.NgTable, ng_table_filtering_directive_1.NgTableFiltering, ng_table_paging_directive_1.NgTablePaging, ng_table_sorting_directive_1.NgTableSorting],
            entryComponents: [ng_table_component_1.NgTable]
        })
    ], TableModule);
    return TableModule;
}());
exports.TableModule = TableModule;
//# sourceMappingURL=ng-table.module.js.map
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
//import { NgTableComponent, NgTableFilteringDirective, NgTablePagingDirective, NgTableSortingDirective } from 'ng2-table/ng2-table';
var core_1 = require("@angular/core");
var ng_table_component_1 = require("./datatable/table/ng-table.component");
var itemsPerPageSelector_1 = require("./itemsPerPageSelector/itemsPerPageSelector");
var ng2_bootstrap_1 = require("ng2-bootstrap");
var TableComponent = /** @class */ (function () {
    function TableComponent() {
        this.columns = [];
        this.checkedId = '';
        this.allowEditing = true;
        this.allowSelection = true;
        this.allowMultiSelect = false;
        this.allowReordering = true;
        this.allowSorting = true;
        this.allowAddition = false;
        this.disabled = false;
        this.showFilterRow = true;
        this.showTotals = false;
        this.showPaging = true;
        this.totalRows = 0;
        this.page = 1;
        this.tooltipColumn = '';
        this.idColumn = '';
        this.style = '';
        this.hideZeroTotals = false;
        this.editClicked = new core_1.EventEmitter();
        this.cellClicked = new core_1.EventEmitter();
        this.addClicked = new core_1.EventEmitter();
        this.switchChanged = new core_1.EventEmitter();
        this.dropdownChanged = new core_1.EventEmitter();
        this.linkClicked = new core_1.EventEmitter();
        this.headerChecked = new core_1.EventEmitter();
        this.pageChanged = new core_1.EventEmitter();
        this.sortColumnClicked = new core_1.EventEmitter();
        this.increaseSortOrderClicked = new core_1.EventEmitter();
        this.decreaseSortOrderClicked = new core_1.EventEmitter();
        this.itemsPerPageChanged = new core_1.EventEmitter();
        this.cellValueChanged = new core_1.EventEmitter();
        this.blur = new core_1.EventEmitter();
        this.selectedIds = [];
        this.maxSize = 5;
        this.numPages = 1;
        this.length = 0;
        this.prevPage = 1;
    }
    TableComponent.prototype.ngOnInit = function () {
        this.config = {
            sorting: { columns: this.columns },
            filtering: { filterString: '' },
            className: ['table-striped', 'table-bordered'],
            initialSorting: this.initialSorting ? this.initialSorting : null
        };
        this.data = this.tableData;
        this.length = (this.totalRows > 0) ? this.totalRows : (this.data ? this.data.length : 0);
        this.onChangeTable(this.config);
    };
    TableComponent.prototype.ngOnChanges = function () {
        //this.rows.forEach(r => { r['tooltip'] = r[this.tooltipColumn]; console.log(r.comment) });
        if (this.config) {
            this.data = this.tableData;
            this.length = (this.totalRows > 0) ? this.totalRows : (this.data ? this.data.length : 0);
            this.onChangeTable(this.config);
        }
        if (!this.subFormColSpan) {
            this.subFormColSpan = this.columns.length;
        }
        console.log(this.subFormColSpan);
    };
    TableComponent.prototype.changePage = function (page, data) {
        if (data === void 0) { data = this.data; }
        var start = (page.page - 1) * page.itemsPerPage;
        var end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        return data.slice(start, end);
    };
    TableComponent.prototype.changeSort = function (data, config) {
        if (!config.sorting) {
            return data;
        }
        var columns = this.config.sorting.columns || [];
        var columnName = void 0;
        var sort = void 0;
        if (config.initialSorting != null) {
            columnName = config.initialSorting.name;
            sort = config.initialSorting.sort;
        }
        else {
            for (var i = 0; i < columns.length; i++) {
                //console.log(columns[i].name + '(' + i + ') : ' + columns[i].sort);
                //if (columns[i].sort != undefined) && (columns[i].sort !== '') && (columns[i].sort !== false)) {
                if (columns[i].sort) {
                    columnName = columns[i].name;
                    sort = columns[i].sort;
                }
            }
        }
        if (!columnName) {
            return data;
        }
        // simple sorting
        return data.sort(function (previous, current) {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            }
            else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    };
    TableComponent.prototype.changeFilter = function (data, config) {
        var _this = this;
        var filteredData = data;
        this.columns.forEach(function (column) {
            if (column.filtering) {
                filteredData = filteredData.filter(function (item) {
                    if (item[column.name] !== null) {
                        return String(item[column.name]).toLowerCase().match(column.filtering.filterString.toLowerCase());
                    }
                    else if (column.filtering.filterString === '')
                        return true;
                });
            }
        });
        if (!config.filtering) {
            return filteredData;
        }
        if (config.filtering.columnName) {
            return filteredData.filter(function (item) {
                return item[config.filtering.columnName].match(_this.config.filtering.filterString);
            });
        }
        var tempArray = [];
        if (filteredData)
            filteredData.forEach(function (item) {
                var flag = false;
                _this.columns.forEach(function (column) {
                    if (item[column.name] && item[column.name].toString().match(_this.config.filtering.filterString)) {
                        flag = true;
                    }
                    else if (_this.config.filtering.filterString === '') {
                        flag = true;
                    }
                });
                if (flag) {
                    tempArray.push(item);
                }
            });
        filteredData = tempArray;
        return filteredData;
    };
    TableComponent.prototype.onChangeTable = function (config, page) {
        if (page === void 0) { page = { page: this.page, itemsPerPage: this.itemsPerPage }; }
        if (this.totalRows > 0) {
            if (page.page != this.prevPage) {
                this.prevPage = page.page;
                this.pageChanged.emit({ pageNo: page.page, itemsPerPage: this.itemsPerPage });
            }
            else {
                this.rows = this.data;
            }
        }
        else {
            if (config.filtering) {
                Object.assign(this.config.filtering, config.filtering);
            }
            if (config.sorting) {
                Object.assign(this.config.sorting, config.sorting);
            }
            var filteredData = this.changeFilter(this.data, this.config);
            var sortedData = this.changeSort(filteredData, this.config);
            this.rows = page && this.showPaging ? this.changePage(page, sortedData) : sortedData;
            this.length = sortedData.length;
        }
    };
    TableComponent.prototype.onItemsPerPageChanged = function (itemsPerPage) {
        if (this.totalRows === 0) {
            this.numPages = parseInt((this.tableData.length / this.itemsPerPage).toString()) + (this.tableData.length % this.itemsPerPage > 0 ? 1 : 0);
            this.onChangeTable({}, { page: 1, itemsPerPage: this.itemsPerPage });
        }
        else
            this.pageChanged.emit({ pageNo: 1, itemsPerPage: this.itemsPerPage });
    };
    TableComponent.prototype.onSortTable = function (config, page) {
        if (page === void 0) { page = { page: this.page, itemsPerPage: this.itemsPerPage }; }
        // Initial sorting is removed as soon as manual sorting clicked
        if (config.initialSorting != null) {
            config.initialSorting = null;
        }
        this.onChangeTable(config);
        if (this.totalRows > 0 || this.rows.length > 0) {
            var sortCols = config.sorting.columns.filter(function (x) { return (x.sort != '') && (x.sort != null); });
            //console.log(sortCols);
            this.sortColumnClicked.emit(sortCols);
        }
    };
    TableComponent.prototype.onHeaderChecked = function (event) {
        this.headerChecked.emit(event);
    };
    TableComponent.prototype.onCellClick = function (data) {
        this.selectedIds = this.ngTableComponent.selectedIds;
        this.cellClicked.emit(data);
    };
    TableComponent.prototype.onSwitchChanged = function (data) {
        this.switchChanged.emit(data);
    };
    TableComponent.prototype.onDropdownChanged = function (data) {
        this.dropdownChanged.emit(data);
    };
    TableComponent.prototype.onEditClicked = function (id) {
        this.editClicked.emit(id);
    };
    TableComponent.prototype.onAddClicked = function () {
        this.addClicked.emit();
    };
    TableComponent.prototype.onIncreaseSortOrderClicked = function (id) {
        this.increaseSortOrderClicked.emit(id);
    };
    TableComponent.prototype.onDecreaseSortOrderClicked = function (id) {
        this.decreaseSortOrderClicked.emit(id);
    };
    TableComponent.prototype.onLinkClicked = function (data) {
        this.linkClicked.emit(data);
    };
    TableComponent.prototype.onCellValueChanged = function (data) {
        this.cellValueChanged.emit(data);
    };
    TableComponent.prototype.onBlur = function (data) {
        this.blur.emit(data);
    };
    TableComponent.prototype.toggleDetail = function (heading, rowNo, detailRows) {
        return this.ngTableComponent.toggleDetail(heading, rowNo, detailRows);
    };
    TableComponent.prototype.toggleRowDetail = function (rowNo) {
        var component = this.ngTableComponent.toggleRowDetail(rowNo);
        this.rows = this.ngTableComponent.rows;
        return component;
    };
    Object.defineProperty(TableComponent.prototype, "allRowsValid", {
        get: function () {
            return this.ngTableComponent.allRowsValid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableComponent.prototype, "itemsPerPage", {
        get: function () {
            return this.itemsPerPageSelector.itemsPerPage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableComponent.prototype, "totals", {
        get: function () {
            return this.ngTableComponent.totals;
        },
        enumerable: true,
        configurable: true
    });
    TableComponent.prototype.setPage = function (pageNo) {
        this.pagination.selectPage(pageNo);
    };
    TableComponent.prototype.renderRows = function (insertSubForms) {
        if (insertSubForms === void 0) { insertSubForms = false; }
        this.ngTableComponent.renderRows(insertSubForms);
    };
    TableComponent.prototype.setRows = function (rows) {
        this.rows = rows;
        this.ngTableComponent.setRows(rows);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], TableComponent.prototype, "tableData", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], TableComponent.prototype, "columns", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TableComponent.prototype, "checkedId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TableComponent.prototype, "allowEditing", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TableComponent.prototype, "allowSelection", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TableComponent.prototype, "allowMultiSelect", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TableComponent.prototype, "allowReordering", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TableComponent.prototype, "allowSorting", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TableComponent.prototype, "allowAddition", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TableComponent.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TableComponent.prototype, "showFilterRow", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TableComponent.prototype, "showTotals", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TableComponent.prototype, "showPaging", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], TableComponent.prototype, "totalRows", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], TableComponent.prototype, "page", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TableComponent.prototype, "tooltipColumn", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], TableComponent.prototype, "initialSorting", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TableComponent.prototype, "idColumn", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TableComponent.prototype, "validationColor", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], TableComponent.prototype, "subFormColSpan", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TableComponent.prototype, "style", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TableComponent.prototype, "hideZeroTotals", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "editClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "cellClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "addClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "switchChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "dropdownChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "linkClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "headerChecked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "pageChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "sortColumnClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "increaseSortOrderClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "decreaseSortOrderClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "itemsPerPageChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "cellValueChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TableComponent.prototype, "blur", void 0);
    __decorate([
        core_1.ViewChild(ng_table_component_1.NgTableComponent),
        __metadata("design:type", ng_table_component_1.NgTableComponent)
    ], TableComponent.prototype, "ngTableComponent", void 0);
    __decorate([
        core_1.ViewChild('itemsPerPageSelector'),
        __metadata("design:type", itemsPerPageSelector_1.ItemsPerPageSelectorComponent)
    ], TableComponent.prototype, "itemsPerPageSelector", void 0);
    __decorate([
        core_1.ViewChild('pagination'),
        __metadata("design:type", ng2_bootstrap_1.PagerComponent)
    ], TableComponent.prototype, "pagination", void 0);
    TableComponent = __decorate([
        core_1.Component({
            selector: 'datatable',
            moduleId: module.id,
            templateUrl: 'table.component.html'
        }),
        __metadata("design:paramtypes", [])
    ], TableComponent);
    return TableComponent;
}());
exports.TableComponent = TableComponent;
//# sourceMappingURL=table.component.js.map
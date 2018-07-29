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
var platform_browser_1 = require("@angular/platform-browser");
var ng2_toastr_1 = require("ng2-toastr/ng2-toastr");
var global_1 = require("../../../../shared/global");
var NgTableComponent = /** @class */ (function () {
    function NgTableComponent(sanitizer, componentFactoryResolver, toastr) {
        this.sanitizer = sanitizer;
        this.componentFactoryResolver = componentFactoryResolver;
        this.toastr = toastr;
        // Table values
        this.rows = [];
        this.checkedId = '';
        this.allowReordering = true;
        this.allowSorting = true;
        this.allowSelection = true;
        this.allowEditing = true;
        this.allowMultiSelect = true;
        this.allowAddition = false;
        this.tooltipColumn = '';
        this.idColumn = '';
        this.showFilterRow = true;
        this.showTotals = false;
        this.disabled = false;
        this.style = '';
        this.hideZeroTotals = false;
        // Outputs (Events)
        this.tableChanged = new core_1.EventEmitter();
        this.sortChanged = new core_1.EventEmitter();
        this.cellClicked = new core_1.EventEmitter();
        this.editClicked = new core_1.EventEmitter();
        this.addClicked = new core_1.EventEmitter();
        this.switchChanged = new core_1.EventEmitter();
        this.dropdownChanged = new core_1.EventEmitter();
        this.increaseSortOrderClicked = new core_1.EventEmitter();
        this.decreaseSortOrderClicked = new core_1.EventEmitter();
        this.linkClicked = new core_1.EventEmitter();
        this.headerChecked = new core_1.EventEmitter();
        this.cellValueChanged = new core_1.EventEmitter();
        this.blur = new core_1.EventEmitter();
        this.totals = [];
        this.dataRows = [];
        this.selectedIds = [];
        this.upKeyHidden = false;
        this.downKeyHidden = false;
        this.calcFormulaFields = [];
        this.validationFormulaFields = [];
        this.cellValidationMatrix = [];
        this.addButtonSpan = 0;
        this.hiddenColumns = 0;
        this.maxLevel = 0;
        this.headers = [];
        this._columns = [];
        this._config = {};
    }
    Object.defineProperty(NgTableComponent.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (conf) {
            if (!conf.className) {
                conf.className = 'table-striped table-bordered';
            }
            if (conf.className instanceof Array) {
                conf.className = conf.className.join(' ');
            }
            this._config = conf;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableComponent.prototype, "columns", {
        get: function () {
            return this._columns;
        },
        set: function (values) {
            //values.forEach((value: any) => {
            //    if (value.className && value.className instanceof Array) {
            //        value.className = value.className.join(' ');
            //    }
            //    let column = this._columns.find((col: any) => (col.name === value.name));
            //    if (column) {
            //        Object.assign(column, value);
            //    }
            //    if (!column) {
            //        this._columns.push(value);
            //    }
            //});
            this._columns = values;
        },
        enumerable: true,
        configurable: true
    });
    NgTableComponent.prototype.ngOnInit = function () {
    };
    NgTableComponent.prototype.ngOnChanges = function () {
        var _this = this;
        var str1;
        var str2;
        var i;
        var n;
        var count;
        var pos;
        var object;
        var columns;
        var evalFormula;
        this.calcFormulaFields = [];
        this.validationFormulaFields = [];
        this.cellValidationMatrix = [];
        var level;
        this.headers = [];
        if (this.rows)
            this.dataRows = this.rows.filter(function (x) { return !x.detail && !x.subForm; });
        /***** Initialize validationColumns array and display 'Total:' *****/
        var labelPrinted = false;
        this.totals = [];
        this.hiddenColumns = 0;
        var col;
        //console.log('addButtonSpan: ' + this.addButtonSpan);
        //console.log('hiddenColumns: ' + this.hiddenColumns);
        this.columns.forEach(function (col, colIndex) {
            /***** Set Column Headers *****/
            level = col.level ? col.level : 0;
            while (!_this.headers[level]) {
                _this.headers.push([]);
            }
            _this.headers[level].push(col);
            /***** Initialize Cell Validation Matrix *****/
            _this.cellValidationMatrix.push([]);
            /***** Initialize ValidateFromColumns List *****/
            if (col.validateFromColumn > 0) {
                if (!_this.columns[col.validateFromColumn].validationColumns)
                    _this.columns[col.validateFromColumn].validationColumns = [];
                _this.columns[col.validateFromColumn].validationColumns.push(colIndex);
            }
            ///***** Calculate Totals *****/
            //if (this.showTotals && col.total)
            //    this.calculateTotals(col);
            /***** Find Evaluated Validation Formula *****/
            if (col.calcFormula) {
                evalFormula = _this.evaluateFormula(col.calcFormula);
                _this.calcFormulaFields.push({ col: colIndex, formula: col.calcFormula, evalFormula: evalFormula, name: col.name });
            }
            if (col.validationFormula) {
                evalFormula = _this.evaluateFormula('[' + colIndex + '] ' + col.validationFormula);
                _this.validationFormulaFields.push({ col: colIndex, formula: col.validationFormula, evalFormula: evalFormula, name: col.name });
            }
        });
        this.maxLevel = this.headers.length;
        /***** Render Rows *****/
        this.renderRows();
        for (var i_1 = 0; i_1 < this.columns.length; i_1++) {
            col = this.columns[i_1];
            col.validationColumns = [];
            if (col.hidden)
                this.hiddenColumns++;
            if (!labelPrinted && i_1 < this.columns.length - 1 && this.columns[i_1 + 1].total === true) {
                //this.totals[col.name] = 'Total:'
                this.addButtonSpan = i_1 + 1 - this.hiddenColumns;
                labelPrinted = true;
                break;
            }
        }
        ;
    };
    NgTableComponent.prototype.evaluateFormula = function (evalFormula) {
        var pos = 0;
        var count = 0;
        while (pos > -1) {
            pos = evalFormula.indexOf('[', pos);
            if (pos > -1) {
                pos++;
                count++;
            }
        }
        var i = 0, n = 0;
        var str1 = '', str2 = '';
        while (i < count) {
            str1 = '[' + n + ']';
            str2 = 'object[columns[' + n + '].name]';
            if (evalFormula.indexOf(str1) > -1) {
                evalFormula = evalFormula.replace(str1, str2);
                i++;
            }
            n++;
        }
        return evalFormula;
    };
    NgTableComponent.prototype.onEditClicked = function (id) {
        this.editClicked.emit(id);
        return false;
    };
    NgTableComponent.prototype.onAddClicked = function () {
        this.addClicked.emit();
        return false;
    };
    NgTableComponent.prototype.onClearFilterClicked = function () {
        //this.config.sorting.columns.forEach((col: any) => {
        //    console.log(col.filtering.filterString);
        //    col.filtering.filterString = '';
        //});
        this._columns.forEach(function (col) {
            col.filtering.filterString = '';
        });
        this.onChangeTable(this.config);
    };
    NgTableComponent.prototype.sanitize = function (html) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    };
    Object.defineProperty(NgTableComponent.prototype, "configColumns", {
        get: function () {
            var sortColumns = [];
            this.columns.forEach(function (column) {
                if (column.sort) {
                    sortColumns.push(column);
                }
            });
            return { columns: sortColumns };
        },
        enumerable: true,
        configurable: true
    });
    NgTableComponent.prototype.onChangeTable = function (column) {
        if (this.allowSorting) {
            this._columns.forEach(function (col) {
                if (col.name !== column.name && col.sort !== false) {
                    col.sort = '';
                }
            });
            this.tableChanged.emit({ sorting: this.configColumns });
        }
    };
    NgTableComponent.prototype.onHeaderClicked = function (column) {
        if (this.allowSorting) {
            this._columns.forEach(function (col) {
                if (col.name !== column.name && col.sort !== false) {
                    col.sort = '';
                }
            });
            console.log(this.configColumns);
            this.sortChanged.emit({ sorting: this.configColumns });
        }
    };
    NgTableComponent.prototype.onHeaderCheckboxClicked = function ($event, column) {
        if (column.checkable) {
            column.checked = column.checked ? '' : 'checked';
            var columns_1 = [];
            this.columns.forEach(function (c) {
                if (c.checked)
                    columns_1.push(c.name);
            });
            var obj = { column: column, columns: columns_1 };
            this.headerChecked.emit(obj);
            $event.stopPropagation();
        }
    };
    NgTableComponent.prototype.getData = function (row, propertyName) {
        if (propertyName)
            return propertyName.split('.').reduce(function (prev, curr) { return prev[curr]; }, row);
        else
            return '';
    };
    NgTableComponent.prototype.cellClick = function (event, row, column) {
        var _this = this;
        if (this.allowMultiSelect) {
            if (event.ctrlKey) {
                this.dataRows.forEach(function (r) {
                    if (r.id == (row[_this.idColumn] || row.id))
                        if (r.className) {
                            _this.selectedIds = _this.selectedIds.filter(function (e) { return e !== (row[_this.idColumn] || row.id); });
                            r.className = '';
                        }
                        else {
                            _this.selectedIds.push(row[_this.idColumn] || row.id);
                            r.className = 'selected';
                        }
                });
            }
            else {
                this.selectedIds = [row[this.idColumn] || row.id];
                this.dataRows.forEach(function (r) {
                    if (r.id === (row[_this.idColumn] || row.id))
                        r.className = 'selected';
                    else
                        r.className = '';
                });
            }
        }
        else if (this.allowSelection) {
            this.dataRows.forEach(function (r) {
                if (r.id === (row[_this.idColumn] || row.id))
                    r.className = 'selected';
                else
                    r.className = '';
            });
        }
        this.cellClicked.emit({ row: row, column: column, selectedIds: this.selectedIds });
    };
    NgTableComponent.prototype.onCheckboxClicked = function (id) {
        var _this = this;
        this.upKeyHidden = true;
        this.downKeyHidden = true;
        this.checkedId = '';
        this.dataRows.forEach(function (row) {
            if (row.id === (row[_this.idColumn] || id)) {
                row.checked = (row.checked == 'checked' ? '' : 'checked');
                _this.checkedId = (row.checked == 'checked' ? id : '');
            }
            else {
                row.checked = '';
            }
        });
        if (this.checkedId !== '') {
            if (this.checkedId != (this.dataRows[this.idColumn] || this.dataRows[0].id))
                this.upKeyHidden = false;
            if (this.checkedId != (this.dataRows[this.rows.length - 1][this.idColumn] || this.dataRows[this.dataRows.length - 1].id))
                this.downKeyHidden = false;
        }
    };
    ;
    NgTableComponent.prototype.onSwitchChanged = function (row, column) {
        row[column] = !row[column];
        this.switchChanged.emit({ id: row[this.idColumn] || row.id, value: row[column] });
    };
    NgTableComponent.prototype.renderRows = function (insertSubForms) {
        var _this = this;
        if (insertSubForms === void 0) { insertSubForms = true; }
        var col;
        var object;
        var columns;
        var colIndex;
        var evalFormula;
        this.upKeyHidden = true;
        this.downKeyHidden = true;
        var global = global_1.Global;
        if (this.dataRows) {
            this.dataRows.forEach(function (row, rowIndex) {
                if (insertSubForms)
                    _this.rows.splice((rowIndex * 2) + 1, 0, Object.assign({ subForm: true, mainRow: rowIndex, visible: false }));
                row.rowNo = rowIndex;
                /***** Check / Uncheck Checkboxes *****/
                if ((row[_this.idColumn] === _this.checkedId) || (row.id == _this.checkedId))
                    row.checked = 'checked';
                else
                    row.checked = '';
                _this.columns.forEach(function (col, colIndex) {
                    /***** Fill Cell Validation Matrix *****/
                    _this.cellValidationMatrix[colIndex][rowIndex] = {};
                    _this.cellValidationMatrix[colIndex][rowIndex].messages = [];
                    if (_this.selectedIds.find(function (x) { return x === row.id; }))
                        row.className = 'selected';
                    /***** Initialize Cell using Initial Value Formula *****/
                    if (col.initialValueFormula) {
                        object = row;
                        columns = _this._columns;
                        col.initialValueFormula = col.initialValueFormula ? col.initialValueFormula.replace('Global', 'global') : col.initialValueFormula;
                        row[col.name] = eval(_this.evaluateFormula(col.initialValueFormula));
                        //console.log(col.initialValueFormula + ' - ' + this.evaluateFormula(col.initialValueFormula) + ' - ' + eval(this.evaluateFormula(col.initialValueFormula)));
                    }
                });
                /***** Evaluate Field Values using Calculation Formula *****/
                _this.evaluateFormulaFields(rowIndex, true);
            });
        }
        this.columns.forEach(function (col, colIndex) {
            if (_this.checkedId != '') {
                if (_this.checkedId != (_this.dataRows[0][_this.idColumn] || _this.dataRows[0].id))
                    _this.upKeyHidden = false;
                if (_this.checkedId != (_this.dataRows[_this.dataRows.length - 1][_this.idColumn] || _this.dataRows[_this.dataRows.length - 1].id))
                    _this.downKeyHidden = false;
            }
            /***** Validate data for each column *****/
            _this.columns.forEach(function (col, colIndex) {
                _this.validateCells(colIndex);
            });
        });
        /***** Calculate Totals *****/
        this.calculateTotals();
    };
    NgTableComponent.prototype.onIncreaseSortOrderClicked = function () {
        if (this.checkedId == '') {
            this.toastr.warning('Please select an item first', 'Alert');
        }
        else {
            this.increaseSortOrderClicked.emit(this.checkedId);
        }
    };
    ;
    NgTableComponent.prototype.onDecreaseSortOrderClicked = function () {
        if (this.checkedId == '') {
            this.toastr.warning('Please select an item first', 'Alert');
        }
        else {
            this.decreaseSortOrderClicked.emit(this.checkedId);
        }
    };
    ;
    NgTableComponent.prototype.onLinkClicked = function (data, rowNo) {
        data.rowNo = rowNo;
        data.rowIndex = this.rows[rowNo].rowNo;
        data.rowId = (this.rows[rowNo][this.idColumn] || data.rowId);
        //console.log('idColumn: ' + this.idColumn + ' = ' + this.rows[rowIndex][this.idColumn]);
        data.key = data.name;
        this.linkClicked.emit(data);
    };
    NgTableComponent.prototype.onChange = function (rowNo, colNo, event) {
        //console.log('onChange: ' + rowNo + ',' + colNo + ' -> evaluateFormulaFields');
        var columnName = this.columns[colNo].name;
        var prevRow = this.cloneObject(this.dataRows[rowNo]);
        (this.dataRows[rowNo])[columnName] = event;
        this.evaluateFormulaFields(rowNo);
        this.validateCells(colNo);
        this.cellValueChanged.emit({ rowNo: rowNo, colNo: colNo, columnName: columnName, value: event, prevRow: prevRow });
        //this.blur.emit({ rowNo, colNo, columnName, value: event, prevRow });
    };
    NgTableComponent.prototype.onBlur = function (rowNo, colNo, event) {
        var columnName = this.columns[colNo].name;
        var prevRow = this.cloneObject(this.dataRows[rowNo]);
        this.evaluateFormulaFields(rowNo);
        this.validateCells(colNo);
        this.blur.emit({ rowNo: rowNo, colNo: colNo, columnName: columnName, value: event.value, prevRow: prevRow });
    };
    NgTableComponent.prototype.onChangeDropdown = function (id, rowNo, columnName, colNo) {
        //console.log('onChangeDropdown: ' + rowNo + ',' + columnName + ' -> evaluateFormulaFields');
        this.dropdownChanged.emit({ id: id, rowNo: rowNo, columnName: columnName, colNo: colNo });
        this.evaluateFormulaFields(rowNo);
        this.validateCells(colNo);
    };
    NgTableComponent.prototype.evaluateFormulaFields = function (rowNo, skipInitValueColumns) {
        if (skipInitValueColumns === void 0) { skipInitValueColumns = true; }
        var object = this.dataRows[rowNo];
        var columns = this._columns;
        var row = this.dataRows[rowNo];
        var global = global_1.Global;
        var a;
        if (this.calcFormulaFields.length > 0) {
            this.calcFormulaFields.map(function (f) {
                f.evalFormula = f.evalFormula ? f.evalFormula.replace('Global', 'global') : f.evalFormula;
                row[f.name] = (!skipInitValueColumns && columns[f.col].initialValueFormula) ? row[f.name] :
                    (eval(f.evalFormula) ? eval(f.evalFormula) :
                        (columns[f.col].format === 'number' || columns[f.col].format === 'currency' || columns[f.col].type === 'number' ? '0' : ''));
                //console.log('row[' + rowNo + ',' + f.col + '] = ' + row[f.name] + ' - evalFormula: ' + f.evalFormula);
            });
        }
        this.calculateTotals();
    };
    NgTableComponent.prototype.calculateTotals = function () {
        var _this = this;
        if (this.showTotals) {
            this.columns.forEach(function (col, colIndex) {
                if (col.total) {
                    _this.totals[col.name] = 0;
                    _this.dataRows.forEach(function (row) {
                        _this.totals[col.name] += (!row[col.name] ? 0 : Number(row[col.name]));
                    });
                }
                if (_this.hideZeroTotals)
                    col.hidden = (_this.totals[col.name] === 0);
            });
        }
    };
    NgTableComponent.prototype.validateCells = function (colNo, rowNo) {
        if (rowNo === void 0) { rowNo = undefined; }
        var len;
        var message;
        var col;
        var matrixCol;
        if (this.cellValidationMatrix && this.cellValidationMatrix[colNo]) {
            matrixCol = this.cellValidationMatrix[colNo];
            matrixCol.forEach(function (row) { return row = { messages: [], uniqueMessages: [], message: '' }; });
            this.validateCells2(colNo, rowNo);
            this.cellValidationMatrix.forEach(function (col) {
                col.forEach(function (row) {
                    len = row.length;
                    row.message = '';
                    row.uniqueMessages = [];
                    row.messages.forEach(function (matrixCell, i) {
                        //message = (len > 1 ? (i + 1) + '. ' : '') + matrixCell.message + '\n';
                        message = matrixCell.message;
                        if (row.uniqueMessages.filter(function (x) { return x === message; }).length === 0) {
                            row.uniqueMessages.push(message);
                            row.message += matrixCell.message + '\n';
                        }
                    });
                });
            });
        }
    };
    NgTableComponent.prototype.validateCells2 = function (colNo, rowNo) {
        if (rowNo === void 0) { rowNo = undefined; }
        var r, row, col;
        var columnName = this.columns[colNo].name;
        var pos;
        var matrixCell;
        for (var rNo = (rowNo ? rowNo : 0); (rNo < this.dataRows.length) && ((rowNo == undefined) || (rNo === rowNo)); rNo++) {
            row = this.dataRows[rNo];
            col = this.columns[colNo];
            var messages = this.cellValidationMatrix[colNo][rNo].messages;
            /***** Validate From Another Column *****/
            if (col.validateFromColumn && (this.cellValidationMatrix.length > col.validateFromColumn)) {
                var obj = this.validateCells2(col.validateFromColumn, rNo);
            }
            /***** Check for Duplicate row *****/
            if (col.allowDuplicates === false) {
                for (var i = 0; i < this.dataRows.length; i++) {
                    if (i != rNo) {
                        r = this.dataRows[i];
                        if (row[columnName] === r[columnName]) {
                            this.addMessage('D', colNo, rNo, i);
                        }
                        else {
                            this.removeMessage('D', colNo, rNo, i);
                        }
                    }
                }
            }
            /***** Check for Mandatory field *****/
            if (col.mandatory) {
                pos = messages.findIndex(function (e) { return e.type === 'M'; });
                if (!row[columnName] || row[columnName] === '' || row[columnName] === undefined || row[columnName] === null || (col.itemsProp && row[col.itemsProp] && row[col.itemsProp].length === 0) || (col.items && col.items.length === 0))
                    this.addMessage('M', colNo, rNo);
                else
                    this.removeMessage('M', colNo, rNo);
            }
            /***** Check for Invalid value based on Validation Formula *****/
            var object = this.dataRows[rNo];
            var columns = this._columns;
            var evalValue = void 0;
            var f = this.validationFormulaFields.find(function (x) { return x.col == colNo; });
            if (f) {
                evalValue = eval(f.evalFormula);
                if (!evalValue)
                    this.addMessage('I', colNo, rNo);
                else
                    this.removeMessage('I', colNo, rNo);
            }
            /***** Check for Invalid value in dropdown *****/
            var items = col.itemsProp ? row[col.itemsProp] : col.items;
            var val = row[columnName];
            if (items && row[columnName]) {
                if (items.filter(function (x) { return x.value == val; }).length === 0)
                    this.addMessage('N', colNo, rNo);
                else
                    this.removeMessage('N', colNo, rNo);
            }
            /***** Row Level Validation *****/
            if (colNo === row.invalidColumn)
                if (row.isInvalid)
                    this.addMessage('R', row.invalidColumn, rNo);
                else
                    this.removeMessage('R', row.invalidColumn, rNo);
        }
        return null;
    };
    NgTableComponent.prototype.addMessage = function (type, colNo, rowNo, sourceRowNo, message) {
        var _this = this;
        if (sourceRowNo === void 0) { sourceRowNo = undefined; }
        if (message === void 0) { message = ''; }
        if (!sourceRowNo)
            sourceRowNo = rowNo;
        var matrixCell = this.cellValidationMatrix[colNo][rowNo];
        var messages = matrixCell ? matrixCell.messages : [];
        if (!message) {
            var col = this.columns[colNo];
            switch (type) {
                case 'D':
                    message = 'Duplicates not allowed for \'' + this.columns[colNo].title + '\'';
                    break;
                case 'M':
                    message = 'Field \'' + col.title + '\' is mandatory';
                    break;
                case 'I':
                    message = col.validationMessage || 'Invalid value for \'' + col.title + '\'';
                    break;
                case 'N':
                    message = 'Selected value not found in the dropdown \'' + col.title + '\'';
                    break;
                case 'R':
                    message = this.dataRows[rowNo].validationMessage;
                    break;
            }
            if (!message)
                message = 'Unspecified Error at \'' + col.title + '\'';
        }
        if (message.length > 0 && messages.filter(function (x) { return x.type === type && (sourceRowNo ? x.sourceRowNo === sourceRowNo : true); }).length === 0) {
            messages.push({ type: type, sourceRowNo: sourceRowNo, message: message });
            var col = this.columns[colNo];
            var targetCell_1;
            if (col.validationColumns) {
                col.validationColumns.forEach(function (cNo) {
                    targetCell_1 = _this.cellValidationMatrix[cNo][rowNo];
                    _this.addMessage('V', cNo, rowNo, sourceRowNo, message);
                });
            }
        }
    };
    NgTableComponent.prototype.removeMessage = function (type, colNo, rowNo, sourceRowNo) {
        var _this = this;
        if (rowNo === void 0) { rowNo = undefined; }
        if (sourceRowNo === void 0) { sourceRowNo = undefined; }
        if (!sourceRowNo)
            sourceRowNo = rowNo;
        var matrixCell = this.cellValidationMatrix[colNo][rowNo];
        var messages = matrixCell ? matrixCell.messages : [];
        var pos = messages.findIndex(function (e) { return e.type === type && (sourceRowNo ? e.sourceRowNo === sourceRowNo : true); });
        var len = 1; //type === 'V' ? messages.filter((e: any) => e.type === type && (rowNo ? e.rowNo === rowNo : true)).length : 1;
        if (pos >= 0) {
            messages.splice(pos, len);
            var col = this.columns[colNo];
            var targetCell_2;
            if (col.validationColumns) {
                col.validationColumns.forEach(function (cNo) {
                    targetCell_2 = _this.cellValidationMatrix[cNo][rowNo];
                    _this.removeMessage('V', cNo, rowNo, sourceRowNo);
                });
            }
        }
    };
    Object.defineProperty(NgTableComponent.prototype, "allRowsValid", {
        get: function () {
            var col;
            for (var colIndex = 0; colIndex < this.cellValidationMatrix.length; colIndex++) {
                col = this.cellValidationMatrix[colIndex];
                if (col)
                    for (var rowIndex = 0; rowIndex < this.dataRows.length; rowIndex++) {
                        if (this.cellValidationMatrix[colIndex] &&
                            this.cellValidationMatrix[colIndex][rowIndex] &&
                            this.cellValidationMatrix[colIndex][rowIndex].messages &&
                            this.cellValidationMatrix[colIndex][rowIndex].messages.length > 0) {
                            return false;
                        }
                    }
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    NgTableComponent.prototype.toggleDetail = function (heading, rowNo, detailRows) {
        var temp = [];
        var row;
        var rowIndex;
        this.rows.forEach(function (x, i) {
            if (x.rowNo === rowNo)
                rowIndex = i;
        });
        if (!this.dataRows[rowNo].detailVisible) {
            Object.assign(this.dataRows[rowNo], { detailVisible: true, detailRows: detailRows });
            this.rows.map(function (x) { return temp.push(x); });
            temp.splice(rowIndex + 1, 0, Object.assign(heading, { detail: true, mainRow: rowNo, heading: true }));
            for (var i = 0; i < detailRows.length; i++) {
                row = detailRows[i];
                temp.splice(rowIndex + 2 + i, 0, Object.assign(row, { detail: true, mainRow: rowNo }));
            }
            this.rows = temp;
        }
        else {
            Object.assign(this.dataRows[rowNo], { detailVisible: false, detailRows: [] });
            this.rows.map(function (x) { return temp.push(x); });
            temp = temp.filter(function (x) { return x.mainRow != rowNo; });
            this.rows = temp;
        }
        return this.rows;
    };
    NgTableComponent.prototype.toggleRowDetail = function (rowNo) {
        var container;
        //let rowNo = this.rows[rowIndex].rowNo;
        var rowIndex;
        var row = this.dataRows.filter(function (x) { return x.rowNo === rowNo; })[0];
        this.rows.forEach(function (x, i) {
            if (x.rowNo === rowNo)
                rowIndex = i;
        });
        if (!row.detailRowVisible) {
            row.detailRowVisible = true;
            this.rows[rowIndex + 1].visible = true;
            container = this.containers.filter(function (x) { return x.element.nativeElement.id === 'detail_' + rowNo; })[0];
        }
        else {
            row.detailRowVisible = false;
            this.rows[rowIndex + 1].visible = false;
            this.containers.filter(function (x) { return x.element.nativeElement.id === 'detail_' + rowNo; })[0].clear();
            container = null;
        }
        return container;
    };
    NgTableComponent.prototype.isInvalidCell = function (rowNo, colNo) {
        return this.cellValidationMatrix &&
            this.cellValidationMatrix[colNo] &&
            this.cellValidationMatrix[colNo][rowNo] &&
            this.cellValidationMatrix[colNo][rowNo].messages &&
            (this.cellValidationMatrix[colNo][rowNo].messages.length > 0);
    };
    NgTableComponent.prototype.cloneObject = function (aObject) {
        var bObject, v, k;
        bObject = Array.isArray(aObject) ? [] : {};
        for (k in aObject) {
            v = aObject[k];
            bObject[k] = (typeof v === "object") ? this.cloneObject(v) : v;
        }
        return bObject;
    };
    NgTableComponent.prototype.setRows = function (rows) {
        this.rows = rows;
        this.dataRows = this.rows.filter(function (x) { return !x.detail && !x.subForm; });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], NgTableComponent.prototype, "rows", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NgTableComponent.prototype, "checkedId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NgTableComponent.prototype, "allowReordering", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NgTableComponent.prototype, "allowSorting", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NgTableComponent.prototype, "allowSelection", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NgTableComponent.prototype, "allowEditing", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NgTableComponent.prototype, "allowMultiSelect", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NgTableComponent.prototype, "allowAddition", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NgTableComponent.prototype, "tooltipColumn", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NgTableComponent.prototype, "idColumn", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NgTableComponent.prototype, "showFilterRow", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NgTableComponent.prototype, "showTotals", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NgTableComponent.prototype, "sortingInput", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NgTableComponent.prototype, "validationColor", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], NgTableComponent.prototype, "rowDetailComponents", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], NgTableComponent.prototype, "subFormColSpan", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NgTableComponent.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NgTableComponent.prototype, "style", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NgTableComponent.prototype, "hideZeroTotals", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], NgTableComponent.prototype, "config", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], NgTableComponent.prototype, "columns", null);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NgTableComponent.prototype, "tableChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NgTableComponent.prototype, "sortChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NgTableComponent.prototype, "cellClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NgTableComponent.prototype, "editClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NgTableComponent.prototype, "addClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NgTableComponent.prototype, "switchChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NgTableComponent.prototype, "dropdownChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NgTableComponent.prototype, "increaseSortOrderClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NgTableComponent.prototype, "decreaseSortOrderClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NgTableComponent.prototype, "linkClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NgTableComponent.prototype, "headerChecked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NgTableComponent.prototype, "cellValueChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NgTableComponent.prototype, "blur", void 0);
    __decorate([
        core_1.ViewChildren('container', { read: core_1.ViewContainerRef }),
        __metadata("design:type", core_1.QueryList)
    ], NgTableComponent.prototype, "containers", void 0);
    NgTableComponent = __decorate([
        core_1.Component({
            selector: 'ng-table',
            moduleId: module.id,
            templateUrl: 'ng-table.component.html'
        }),
        __metadata("design:paramtypes", [platform_browser_1.DomSanitizer,
            core_1.ComponentFactoryResolver,
            ng2_toastr_1.ToastsManager])
    ], NgTableComponent);
    return NgTableComponent;
}());
exports.NgTableComponent = NgTableComponent;
//# sourceMappingURL=ng-table.component.js.map
import { Component, EventEmitter, Input, Output, OnInit, AfterContentInit, OnChanges, ViewChild, ComponentFactoryResolver, ViewChildren, QueryList, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { DropdownComponent } from '../../dropdown.component/dropdown.component';
import { Global } from '../../shared.global';

@Component({
    selector: 'ng-table',
    moduleId: module.id,
    templateUrl: 'ng-table.component.html'
})
export class NgTableComponent implements OnInit, OnChanges {
    // Table values
    @Input() rows: any[] = [];
    @Input() checkedId: string = '';
    @Input() allowReordering: boolean = true;
    @Input() allowSorting: boolean = true;
    @Input() allowSelection: boolean = true;
    @Input() allowEditing: boolean = true;
    @Input() allowMultiSelect: boolean = true;
    @Input() allowAddition: boolean = false;
    @Input() tooltipColumn: string = '';
    @Input() idColumn: string = '';
    @Input() showFilterRow: boolean = false;
    @Input() showTotals: boolean = false;
    @Input() validationColor: string;
    @Input() rowDetailComponents: Component[];
    @Input() subFormColSpan: number;
    @Input() disabled: boolean = false;
    @Input() style: string = '';
    @Input() hideZeroTotals: boolean = false;

    @Input()
    public set config(conf: any) {
        if (!conf.className) {
            conf.className = 'table-striped table-bordered';
        }
        if (conf.className instanceof Array) {
            conf.className = conf.className.join(' ');
        }
        this._config = conf;
    }

    @Input()
    public set columns(values: Array<any>) {
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
    }

    // Outputs (Events)
    @Output() tableChanged: EventEmitter<any> = new EventEmitter();
    @Output() sortChanged: EventEmitter<any> = new EventEmitter();
    @Output() cellClicked: EventEmitter<any> = new EventEmitter();
    @Output() editClicked: EventEmitter<any> = new EventEmitter();
    @Output() addClicked: EventEmitter<any> = new EventEmitter();
    @Output() switchChanged: EventEmitter<any> = new EventEmitter();
    @Output() dropdownChanged: EventEmitter<any> = new EventEmitter();
    @Output() increaseSortOrderClicked: EventEmitter<string> = new EventEmitter();
    @Output() decreaseSortOrderClicked: EventEmitter<string> = new EventEmitter();
    @Output() linkClicked: EventEmitter<any> = new EventEmitter();
    @Output() headerChecked: EventEmitter<any> = new EventEmitter();
    @Output() cellValueChanged: EventEmitter<any> = new EventEmitter();
    @Output() blur: EventEmitter<any> = new EventEmitter();

    @ViewChildren('container', { read: ViewContainerRef }) containers: QueryList<ViewContainerRef>;

    public totals: any[] = [];

    private _columns: Array<any> = [];
    private _config: any = {};

    dataRows: any[] = [];
    selectedIds: any[] = [];

    upKeyHidden: boolean = false;
    downKeyHidden: boolean = false;

    calcFormulaFields: any[] = [];
    validationFormulaFields: any[] = [];
    cellValidationMatrix: any[][] = [];
    addButtonSpan: number = 0;
    hiddenColumns: number = 0;

    maxLevel: number = 0;
    headers: any[] = [];

    public constructor(private sanitizer: DomSanitizer,
        private componentFactoryResolver: ComponentFactoryResolver,
        private toastr: ToastrService) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(): void {
        let str1: string;
        let str2: string;
        let n: number;
        let count: number;
        let pos: number;
        let object: {};
        let columns: any[];
        //let col: any;
        let evalFormula: string;

        this.calcFormulaFields = [];
        this.validationFormulaFields = [];
        this.cellValidationMatrix = [];

        let level: number;
        this.headers = [];

        if (this.rows)
            this.dataRows = this.rows.filter((x: any) => !x.detail && !x.subForm);

        /***** Initialize validationColumns array and display 'Total:' *****/

        let labelPrinted: boolean = false;

        this.totals = [];
        this.hiddenColumns = 0;
        //let col: any;
        
        //console.log('addButtonSpan: ' + this.addButtonSpan);
        //console.log('hiddenColumns: ' + this.hiddenColumns);

        this.columns.forEach((col1, colIndex) => {

            /***** Set Column Headers *****/

            level = col1.level ? col1.level : 0;

            while (!this.headers[level]) {
                this.headers.push([]);
            }

            this.headers[level].push(col1);

            /***** Initialize Cell Validation Matrix *****/

            this.cellValidationMatrix.push([]);


            /***** Initialize ValidateFromColumns List *****/

            if (col1.validateFromColumn > 0) {
                if (!this.columns[col1.validateFromColumn].validationColumns)
                    this.columns[col1.validateFromColumn].validationColumns = [];
                this.columns[col.validateFromColumn].validationColumns.push(colIndex);
            }

            ///***** Calculate Totals *****/

            //if (this.showTotals && col.total)
            //    this.calculateTotals(col);

            /***** Find Evaluated Validation Formula *****/

            if (col1.calcFormula) {
                evalFormula = this.evaluateFormula(col1.calcFormula);
                this.calcFormulaFields.push({ col: colIndex, formula: col1.calcFormula, evalFormula: evalFormula, name: col1.name });
            }

            if (col1.validationFormula) {
                evalFormula = this.evaluateFormula('[' + colIndex + '] ' + col1.validationFormula);
                this.validationFormulaFields.push({ col: colIndex, formula: col1.validationFormula, evalFormula: evalFormula, name: col1.name });
            }
        });

        this.maxLevel = this.headers.length;


        /***** Render Rows *****/

        this.renderRows();

        let col: any;
        this.addButtonSpan = this.columns.length;
        for (let i = 0; i < this.columns.length; i++) {
            col = this.columns[i];
            col.validationColumns = [];
            if (col.hidden) this.hiddenColumns++;
            if (!labelPrinted && i < this.columns.length - 1 && this.columns[i + 1].total === true) {
                //this.totals[col.name] = 'Total:'
                this.addButtonSpan = i + 1 - this.hiddenColumns;
                labelPrinted = true;
                break;
            }
        }
        console.log('addButtonSpan: ' + this.addButtonSpan);
        console.log('showTotals: ' + this.showTotals);
        console.log('allowAddition: ' + this.allowAddition);

    }

    evaluateFormula(evalFormula: string): string {
        let pos = 0;
        let count = 0;
        while (pos > -1) {
            pos = evalFormula.indexOf('[', pos);
            if (pos > -1) {
                pos++;
                count++;
            }
        }

        let i = 0, n = 0;
        let str1 = '', str2 = '';

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
    }

    onEditClicked(id: string): boolean {
        this.editClicked.emit(id);
        return false;
    }

    onAddClicked(): boolean {
        this.addClicked.emit();
        return false;
    }

    onClearFilterClicked(): void {
        //this.config.sorting.columns.forEach((col: any) => {
        //    console.log(col.filtering.filterString);
        //    col.filtering.filterString = '';
        //});
        this._columns.forEach((col: any) => {
            col.filtering.filterString = '';
        });
        this.onChangeTable(this.config);
    }

    public sanitize(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    public get columns(): Array<any> {
        return this._columns;
    }

    public get config(): any {
        return this._config;
    }

    public get configColumns(): any {
        let sortColumns: Array<any> = [];

        this.columns.forEach((column: any) => {
            if (column.sort) {
                sortColumns.push(column);
            }
        });

        return { columns: sortColumns };
    }

    public onChangeTable(column: any): void {
        if (this.allowSorting) {
            this._columns.forEach((col: any) => {
                if (col.name !== column.name && col.sort !== false) {
                    col.sort = '';
                }
            });
            this.tableChanged.emit({ sorting: this.configColumns });
        }
    }

    public onHeaderClicked(column: any): void {
        if (this.allowSorting) {
            this._columns.forEach((col: any) => {
                if (col.name !== column.name && col.sort !== false) {
                    col.sort = '';
                }
            });
            console.log(this.configColumns);
            this.sortChanged.emit({ sorting: this.configColumns });
        }
    }

    public onHeaderCheckboxClicked($event: any, column: any): void {
        if (column.checkable) {
            column.checked = column.checked ? '' : 'checked';

            let columns: string[] = [];
            this.columns.forEach((c: any) => {
                if (c.checked) columns.push(c.name);
            });
            
            let obj = { column, columns };
            this.headerChecked.emit(obj);

            $event.stopPropagation();
        }
    }

    public getData(row: any, propertyName: string): string {
        if (propertyName)
            return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);
        else
            return '';
    }

    public cellClick(event: any, row: any, column: any): void {
        if (this.allowMultiSelect) {
            if (event.ctrlKey) {
                this.dataRows.forEach(r => {
                    if (r.id === (row[this.idColumn] || row.id))
                        if (r.className) {
                            this.selectedIds = this.selectedIds.filter(e => e !== (row[this.idColumn] || row.id));
                            r.className = '';
                        }
                        else {
                            this.selectedIds.push(row[this.idColumn] || row.id);
                            r.className = 'selected';
                        }
                });
            }
            else {
                this.selectedIds = [row[this.idColumn] || row.id];
                this.dataRows.forEach(r => {
                    if (r.id === (row[this.idColumn] || row.id))
                        r.className = 'selected';
                    else
                        r.className = '';
                });
            }
        }
        else if (this.allowSelection) {
            this.dataRows.forEach(r => {
                if (r.id === (row[this.idColumn] || row.id))
                    r.className = 'selected';
                else
                    r.className = '';
            });
        }

        this.cellClicked.emit({ row, column, selectedIds: this.selectedIds });
    }

    onCheckboxClicked(id: any): void {
        this.upKeyHidden = true;
        this.downKeyHidden = true;

        this.checkedId = '';

        this.dataRows.forEach((row: any) => {
            if (row.id === (row[this.idColumn] || id)) {
                row.checked = (row.checked === 'checked' ? '' : 'checked');
                this.checkedId = (row.checked === 'checked' ? id : '');
            }
            else {
                row.checked = '';
            }
        });

        if (this.checkedId !== '') {
            if (this.checkedId !== (this.dataRows[this.idColumn] || this.dataRows[0].id))
                this.upKeyHidden = false;
            if (this.checkedId !== (this.dataRows[this.rows.length - 1][this.idColumn] || this.dataRows[this.dataRows.length - 1].id))
                this.downKeyHidden = false;
        }
    }

    onSwitchChanged(row: any, column: any): void {
        row[column] = !row[column];
        this.switchChanged.emit({ id: row[this.idColumn] || row.id, value: row[column] });
    }

    renderRows(insertSubForms: boolean = true): void {
        //let col: any;
        let object: any;
        let columns: any[];
        //let colIndex: number;
        let evalFormula: string;

        this.upKeyHidden = true;
        this.downKeyHidden = true;
        let global = Global;

        if (this.dataRows) {
            this.dataRows.forEach((row: any, rowIndex) => {
                if (insertSubForms)
                    this.rows.splice((rowIndex * 2) + 1, 0, Object.assign({ subForm: true, mainRow: rowIndex, visible: false }));

                row.rowNo = rowIndex;

                /***** Check / Uncheck Checkboxes *****/

                if ((row[this.idColumn] === this.checkedId) || (row.id === this.checkedId))
                    row.checked = 'checked';
                else
                    row.checked = '';


                this.columns.forEach((col, colIndex) => {

                    /***** Fill Cell Validation Matrix *****/

                    this.cellValidationMatrix[colIndex][rowIndex] = {};

                    this.cellValidationMatrix[colIndex][rowIndex].messages = [];
                    if (this.selectedIds.find((x: any) => x === row.id))
                        row.className = 'selected';


                    /***** Initialize Cell using Initial Value Formula *****/

                    if (col.initialValueFormula) {
                        object = row;
                        columns = this._columns;
                        col.initialValueFormula = col.initialValueFormula ? col.initialValueFormula.replace('Global', 'global') : col.initialValueFormula;
                        row[col.name] = eval(this.evaluateFormula(col.initialValueFormula));
                        //console.log(col.initialValueFormula + ' - ' + this.evaluateFormula(col.initialValueFormula) + ' - ' + eval(this.evaluateFormula(col.initialValueFormula)));
                    }
                });


                /***** Evaluate Field Values using Calculation Formula *****/

                this.evaluateFormulaFields(rowIndex, true);
            });
        }

        this.columns.forEach((col, colIndex) => {

            if (this.checkedId !== '') {
                if (this.checkedId !== (this.dataRows[0][this.idColumn] || this.dataRows[0].id))
                    this.upKeyHidden = false;
                if (this.checkedId !== (this.dataRows[this.dataRows.length - 1][this.idColumn] || this.dataRows[this.dataRows.length - 1].id))
                    this.downKeyHidden = false;
            }

            /***** Validate data for each column *****/

            this.columns.forEach((col1, colIndex1) => {
                this.validateCells(colIndex1);
            });
        });

        /***** Calculate Totals *****/

        this.calculateTotals();
    }

    onIncreaseSortOrderClicked(): void {
        if (this.checkedId === '') {
            this.toastr.warning('Please select an item first', 'Alert');
        }
        else {
            this.increaseSortOrderClicked.emit(this.checkedId);
        }
    }

    onDecreaseSortOrderClicked(): void {
        if (this.checkedId === '') {
            this.toastr.warning('Please select an item first', 'Alert');
        }
        else {
            this.decreaseSortOrderClicked.emit(this.checkedId);
        }
    }

    onLinkClicked(data: any, rowNo: number): void {
        data.rowNo = rowNo;
        data.rowIndex = this.rows[rowNo].rowNo;
        data.rowId = (this.rows[rowNo][this.idColumn] || data.rowId);
        //console.log('idColumn: ' + this.idColumn + ' = ' + this.rows[rowIndex][this.idColumn]);
        data.key = data.name;
        this.linkClicked.emit(data);
    }

    onChange(rowNo: number, colNo: number, event: any) {
        //console.log('onChange: ' + rowNo + ',' + colNo + ' -> evaluateFormulaFields');
        let columnName = this.columns[colNo].name;
        let prevRow = this.cloneObject(this.dataRows[rowNo]);
        (this.dataRows[rowNo])[columnName] = event;

        this.evaluateFormulaFields(rowNo);
        this.validateCells(colNo);
        this.cellValueChanged.emit({ rowNo, colNo, columnName, value: event, prevRow });
        //this.blur.emit({ rowNo, colNo, columnName, value: event, prevRow });
    }

    onBlur(rowNo: number, colNo: number, event: any) {
        let columnName = this.columns[colNo].name;
        let prevRow = this.cloneObject(this.dataRows[rowNo]);

        this.evaluateFormulaFields(rowNo);
        this.validateCells(colNo);
        this.blur.emit({ rowNo, colNo, columnName, value: event.value, prevRow });
    }

    onChangeDropdown(id: string, rowNo: number, columnName: string, colNo: number) {
        //console.log('onChangeDropdown: ' + rowNo + ',' + columnName + ' -> evaluateFormulaFields');
        this.dropdownChanged.emit({ id: id, rowNo: rowNo, columnName: columnName, colNo: colNo });
        this.evaluateFormulaFields(rowNo);
        this.validateCells(colNo);
    }

    evaluateFormulaFields(rowNo: number, skipInitValueColumns: boolean = true) {
        let object = this.dataRows[rowNo];
        let columns = this._columns;
        let row = this.dataRows[rowNo];
        let global = Global;
        let a: string;

        if (this.calcFormulaFields.length > 0) {
            this.calcFormulaFields.map(f => {
                f.evalFormula = f.evalFormula ? f.evalFormula.replace('Global', 'global') : f.evalFormula;

                row[f.name] = (!skipInitValueColumns && columns[f.col].initialValueFormula) ? row[f.name] :
                    (eval(f.evalFormula) ? eval(f.evalFormula) :
                        (columns[f.col].format === 'number' || columns[f.col].format === 'currency' || columns[f.col].type === 'number' ? '0' : ''));
                //console.log('row[' + rowNo + ',' + f.col + '] = ' + row[f.name] + ' - evalFormula: ' + f.evalFormula);
            });
        }

        this.calculateTotals();
    }

    calculateTotals() {
        if (this.showTotals) {
            this.columns.forEach((col: any, colIndex: number) => {
                if (col.total) {
                    this.totals[col.name] = 0;

                    this.dataRows.forEach(row => {
                        this.totals[col.name] += (!row[col.name] ? 0 : Number(row[col.name]));
                    });
                }

                if (this.hideZeroTotals)
                    col.hidden = (this.totals[col.name] === 0);
            });
        }
    }

    validateCells(colNo: number, rowNo: number = undefined): any {
        let len: number;
        let message: string;
        let matrixCol: any[];

        if (this.cellValidationMatrix && this.cellValidationMatrix[colNo]) {
            matrixCol = this.cellValidationMatrix[colNo];

            matrixCol.forEach(row => row =  { messages: [], uniqueMessages: [], message: '' });

            this.validateCells2(colNo, rowNo);

            this.cellValidationMatrix.forEach((col: any) => {
                col.forEach((row: any) => {
                    len = row.length;
                    row.message = '';
                    row.uniqueMessages = [];

                    row.messages.forEach((matrixCell: any, i: number) => {
                        //message = (len > 1 ? (i + 1) + '. ' : '') + matrixCell.message + '\n';
                        message = matrixCell.message;
                        if (row.uniqueMessages.filter((x: string) => x === message).length === 0) {
                            row.uniqueMessages.push(message);
                            row.message += matrixCell.message + '\n';
                        }
                    });
                });
            });
        }
    }

    validateCells2(colNo: number, rowNo: number): any {
        let r: any, row: any, col: any;
        let columnName = this.columns[colNo].name;
        let pos: number;
        let matrixCell: any;

        for (let rNo = (rowNo ? rowNo : 0); (rNo < this.dataRows.length) && ((rowNo === undefined) || (rNo === rowNo)); rNo++) {
            row = this.dataRows[rNo];
            col = this.columns[colNo];

            let messages = this.cellValidationMatrix[colNo][rNo].messages;

            /***** Validate From Another Column *****/

            if (col.validateFromColumn && (this.cellValidationMatrix.length > col.validateFromColumn)) {
                let obj = this.validateCells2(col.validateFromColumn, rNo);
            }

            /***** Check for Duplicate row *****/

            if (col.allowDuplicates === false) {
                for (let i = 0; i < this.dataRows.length; i++) {
                    if (i !== rNo) {
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
                pos = messages.findIndex((e: any) => e.type === 'M');

                if (!row[columnName] || row[columnName] === '' || row[columnName] === undefined || row[columnName] === null || (col.itemsProp && row[col.itemsProp] && row[col.itemsProp].length === 0) || (col.items && col.items.length === 0))
                    this.addMessage('M', colNo, rNo);
                else
                    this.removeMessage('M', colNo, rNo);
            }

            /***** Check for Invalid value based on Validation Formula *****/
             
            let object = this.dataRows[rNo];
            let columns = this._columns;
            let evalValue: boolean;

            let f = this.validationFormulaFields.find((x: any) => x.col === colNo);

            if (f) {
                evalValue = eval(f.evalFormula);
                if (!evalValue)
                    this.addMessage('I', colNo, rNo);
                else
                    this.removeMessage('I', colNo, rNo);
            }

            /***** Check for Invalid value in dropdown *****/

            let items = col.itemsProp ? row[col.itemsProp] : col.items;
            let val = row[columnName];

            if (items && row[columnName]) {
                if (items.filter((x: any) => x.value === val).length === 0)
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
    }

    private addMessage(type: string, colNo: number, rowNo: number = undefined, sourceRowNo: number = undefined, message: string = '') {
        if (!sourceRowNo) sourceRowNo = rowNo;

        let matrixCell = this.cellValidationMatrix[colNo][rowNo];
        let messages = matrixCell ? matrixCell.messages : [];

        if (!message) {

            let col = this.columns[colNo];

            switch (type) {
                case 'D': message = 'Duplicates not allowed for \'' + this.columns[colNo].title + '\''; break;
                case 'M': message = 'Field \'' + col.title + '\' is mandatory'; break;
                case 'I': message = col.validationMessage || 'Invalid value for \'' + col.title + '\''; break;
                case 'N': message = 'Selected value not found in the dropdown \'' + col.title + '\''; break;
                case 'R': message = this.dataRows[rowNo].validationMessage; break;
            }

            if (!message)
                message = 'Unspecified Error at \'' + col.title + '\'';
        }

        if (message.length > 0 && messages.filter((x: any) => x.type === type && (sourceRowNo ? x.sourceRowNo === sourceRowNo : true)).length === 0) {
            messages.push({ type, sourceRowNo, message });

            let col = this.columns[colNo];
            let targetCell: any;

            if (col.validationColumns) {
                col.validationColumns.forEach((cNo: number) => {
                    targetCell = this.cellValidationMatrix[cNo][rowNo];
                    this.addMessage('V', cNo, rowNo, sourceRowNo, message);
                });
            }

        }
    }

    private removeMessage(type: string, colNo: number, rowNo: number = undefined, sourceRowNo: number = undefined) {
        if (!sourceRowNo) sourceRowNo = rowNo;

        let matrixCell = this.cellValidationMatrix[colNo][rowNo];
        let messages = matrixCell ? matrixCell.messages : [];

        let pos = messages.findIndex((e: any) => e.type === type && (sourceRowNo ? e.sourceRowNo === sourceRowNo : true));
        let len = 1; //type === 'V' ? messages.filter((e: any) => e.type === type && (rowNo ? e.rowNo === rowNo : true)).length : 1;
        if (pos >= 0) {
            messages.splice(pos, len);

            let col = this.columns[colNo];
            let targetCell: any;

            if (col.validationColumns) {
                col.validationColumns.forEach((cNo: number) => {
                    targetCell = this.cellValidationMatrix[cNo][rowNo];
                    this.removeMessage('V', cNo, rowNo, sourceRowNo);
                });
            }
        }
    }

    public get allRowsValid(): boolean {
        let col: any;

        for (let colIndex = 0; colIndex < this.cellValidationMatrix.length; colIndex++) {
            col = this.cellValidationMatrix[colIndex];

            if (col)
                for (let rowIndex = 0; rowIndex < this.dataRows.length; rowIndex++) {
                    if (this.cellValidationMatrix[colIndex] &&
                        this.cellValidationMatrix[colIndex][rowIndex] &&
                        this.cellValidationMatrix[colIndex][rowIndex].messages &&
                        this.cellValidationMatrix[colIndex][rowIndex].messages.length > 0) {
                            return false;
                    }
                }
        }

        return true;
    }

    public toggleDetail(heading: any, rowNo: number, detailRows: any[]): any[] {
        let temp: any[] = [];
        let row: any;
        let rowIndex: number;

        this.rows.forEach((x, i) => {
            if (x.rowNo === rowNo) rowIndex = i;
        });

        if (!this.dataRows[rowNo].detailVisible) {
            Object.assign(this.dataRows[rowNo], { detailVisible: true, detailRows: detailRows });
            this.rows.map((x: any) => temp.push(x));

            temp.splice(rowIndex + 1, 0, Object.assign(heading, { detail: true, mainRow: rowNo, heading: true }));

            for (let i = 0; i < detailRows.length; i++) {
                row = detailRows[i];
                temp.splice(rowIndex + 2 + i, 0,
                    Object.assign(row, { detail: true, mainRow: rowNo }));
            }
            this.rows = temp;
        }
        else {
            Object.assign(this.dataRows[rowNo], { detailVisible: false, detailRows: [] });
            this.rows.map((x: any) => temp.push(x));
            temp = temp.filter((x: any) => x.mainRow !== rowNo);
            this.rows = temp;
        }

        return this.rows;
    }

    public toggleRowDetail(rowNo: number): any {
        let container: any;

        //let rowNo = this.rows[rowIndex].rowNo;
        let rowIndex: number;

        let row = this.dataRows.filter((x: any) => x.rowNo === rowNo)[0];

        this.rows.forEach((x, i) => {
            if (x.rowNo === rowNo) rowIndex = i;
        });

        if (!row.detailRowVisible) {
            row.detailRowVisible = true;
            this.rows[rowIndex + 1].visible = true;
            container = this.containers.filter((x: any) => x.element.nativeElement.id === 'detail_' + rowNo)[0];

        }
        else {
            row.detailRowVisible = false;
            this.rows[rowIndex + 1].visible = false;
            this.containers.filter((x: any) => x.element.nativeElement.id === 'detail_' + rowNo)[0].clear();
            container = null;
        }

        return container;
    }

    public isInvalidCell(rowNo: number, colNo: number) {
        return this.cellValidationMatrix &&
            this.cellValidationMatrix[colNo] &&
            this.cellValidationMatrix[colNo][rowNo] &&
            this.cellValidationMatrix[colNo][rowNo].messages &&
            (this.cellValidationMatrix[colNo][rowNo].messages.length > 0);
    }

    private cloneObject(aObject: any) {
        let bObject, v, k;
        bObject = Array.isArray(aObject) ? [] : {};
        // tslint:disable-next-line:forin
        for (k in aObject) {
            v = aObject[k];
            bObject[k] = (typeof v === 'object') ? this.cloneObject(v) : v;
        }
        return bObject;
    }

    public setRows(rows: any[]) {
        this.rows = rows;
        this.dataRows = this.rows.filter((x: any) => !x.detail && !x.subForm);
    }
}

// import { NgTableComponent, NgTableFilteringDirective, NgTablePagingDirective, NgTableSortingDirective } from 'ng2-table/ng2-table';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ViewChild, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { PaginationComponent } from 'ngx-bootstrap';
import { ItemsPerPageSelectorComponent } from './itemsPerPageSelector/itemsPerPageSelector';
import { NgTableComponent } from './table/ng-table.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'datatable',
    moduleId: module.id,
    templateUrl: 'table.component.html'
})
export class TableComponent implements OnInit, OnChanges {
    @Input() tableData: any[];
    @Input() columns: Array<any> = [];
    @Input() checkedId: string = '';
    @Input() allowEditing: boolean = true;
    @Input() allowSelection: boolean = true;
    @Input() allowMultiSelect: boolean = false;
    @Input() allowReordering: boolean = true;
    @Input() allowSorting: boolean = true;
    @Input() allowAddition: boolean = false;
    @Input() disabled: boolean = false;

    @Input() showFilterRow: boolean = true;
    @Input() showTotals: boolean = false;

    @Input() showPaging: boolean = true;
    @Input() totalRows: number = 0;
    @Input() page: number = 1;
    @Input() tooltipColumn: string = '';

    @Input() initialSorting: any;
    
    @Input() idColumn: string = '';
    @Input() validationColor: string;

    @Input() subFormColSpan: number;
    @Input() style: string = '';

    @Input() hideZeroTotals: boolean = false;
    
    @Output() editClicked: EventEmitter<string> = new EventEmitter();
    @Output() cellClicked: EventEmitter<any> = new EventEmitter();
    @Output() addClicked: EventEmitter<any> = new EventEmitter();
    @Output() switchChanged: EventEmitter<any> = new EventEmitter();
    @Output() dropdownChanged: EventEmitter<any> = new EventEmitter();
    @Output() linkClicked: EventEmitter<any> = new EventEmitter();
    @Output() headerChecked: EventEmitter<any> = new EventEmitter();
    @Output() pageChanged: EventEmitter<any> = new EventEmitter();
    @Output() sortColumnClicked: EventEmitter<string> = new EventEmitter();
    @Output() increaseSortOrderClicked: EventEmitter<string> = new EventEmitter();
    @Output() decreaseSortOrderClicked: EventEmitter<string> = new EventEmitter();
    @Output() itemsPerPageChanged: EventEmitter<any> = new EventEmitter();
    @Output() cellValueChanged: EventEmitter<any> = new EventEmitter();
    @Output() blur: EventEmitter<any> = new EventEmitter();

    @ViewChild(NgTableComponent) ngTableComponent: NgTableComponent;
    @ViewChild('itemsPerPageSelector') itemsPerPageSelector: ItemsPerPageSelectorComponent;
    @ViewChild('pagination') pagination: PaginationComponent;

    selectedIds: any[] = [];

    rows: Array<any>;
    maxSize: number = 5;
    numPages: number = 1;
    length: number = 100000;
    prevPage: number = 1;

    config: any;

    data: Array<any>;

    constructor() {

    }

    ngOnInit(): void {
        this.config = {
            sorting:  { columns: this.columns },
            filtering: { filterString: '' },
            className: ['table-striped', 'table-bordered'],
            initialSorting: this.initialSorting ? this.initialSorting : null
        };
        
        this.data = this.tableData;

        this.length = (this.totalRows > 0) ? this.totalRows : (this.data ? this.data.length : 100000);

        this.onChangeTable(this.config);
    }

    ngOnChanges(): void {
        // this.rows.forEach(r => { r['tooltip'] = r[this.tooltipColumn]; console.log(r.comment) });
        if (this.config) {
            this.data = this.tableData;

            this.length = (this.totalRows > 0) ? this.totalRows : (this.data ? this.data.length : 0);

            this.onChangeTable(this.config);
        }

        if (!this.subFormColSpan) {
            this.subFormColSpan = this.columns.length;
        }

        console.log(this.subFormColSpan);
    }

    public changePage(page: any, data: Array<any> = this.data): Array<any> {
        const start = (page.page - 1) * page.itemsPerPage;
        const end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        return data.slice(start, end);
    }

    public changeSort(data: any, config: any): any {
        if (!config.sorting) {
            return data;
        }

        const columns = this.config.sorting.columns || [];
        let columnName: string = void 0;
        let sort: string = void 0;
        
        if (config.initialSorting != null) {
            columnName = config.initialSorting.name;
            sort = config.initialSorting.sort;
        }
        else {
            for (let i = 0; i < columns.length; i++) {
                // console.log(columns[i].name + '(' + i + ') : ' + columns[i].sort);
                // if (columns[i].sort != undefined) && (columns[i].sort !== '') && (columns[i].sort !== false)) {
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
        return data.sort((previous: any, current: any) => {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            } else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    }

    public changeFilter(data: any, config: any): any {
        let filteredData: Array<any> = data;
        this.columns.forEach((column: any) => {
            if (column.filtering) {
                filteredData = filteredData.filter((item: any) => {
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
            return filteredData.filter((item: any) =>
                item[config.filtering.columnName].match(this.config.filtering.filterString));
        }

        const tempArray: Array<any> = [];
        if (filteredData)
        filteredData.forEach((item: any) => {
            let flag = false;
            this.columns.forEach((column: any) => {
                if (item[column.name] && item[column.name].toString().match(this.config.filtering.filterString)) {
                    flag = true;
                }
                else if (this.config.filtering.filterString === '') {
                    flag = true;
                }
            });
            if (flag) {
                tempArray.push(item);
            }
        });
        filteredData = tempArray;

        return filteredData;
    }

    public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
        if (this.totalRows > 0) {
            if (page.page !== this.prevPage) {
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

            const filteredData = this.changeFilter(this.data, this.config);
            const sortedData = this.changeSort(filteredData, this.config);
            this.rows = page && this.showPaging ? this.changePage(page, sortedData) : sortedData;
            this.length = sortedData.length;// === 0 ? 100000 : sortedData.length;
            this.setPage(parseInt(page.page));
            this.pageChanged.emit({ pageNo: page.page, itemsPerPage: this.itemsPerPage });
        }
    }

    public onItemsPerPageChanged(itemsPerPage: number) {
        if (this.totalRows === 0) {
            this.numPages = parseInt((this.tableData.length / this.itemsPerPage).toString()) + (this.tableData.length % this.itemsPerPage > 0 ? 1 : 0);
            this.onChangeTable({}, { page: 1, itemsPerPage: this.itemsPerPage });
        }
        else
            this.pageChanged.emit({ pageNo: 1, itemsPerPage: this.itemsPerPage });
    }

    public onSortTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
        // Initial sorting is removed as soon as manual sorting clicked
        if (config.initialSorting != null) {
            config.initialSorting = null;
        }

        this.onChangeTable(config);
        if (this.totalRows > 0 || this.rows.length > 0) {
            const sortCols = config.sorting.columns.filter((x: any) => (x.sort !== '') && (x.sort != null));
            // console.log(sortCols);
            this.sortColumnClicked.emit(sortCols);
        }
    }

    public onHeaderChecked(event: any) {
        this.headerChecked.emit(event);
    }

    public onCellClick(data: any): any {
        this.selectedIds = this.ngTableComponent.selectedIds;
        this.cellClicked.emit(data);
    }

    public onSwitchChanged(data: any): any {
        this.switchChanged.emit(data);
    }

    public onDropdownChanged(data: any): any {
        this.dropdownChanged.emit(data);
    }

    public onEditClicked(id: string): void {
        this.editClicked.emit(id);
    }

    public onAddClicked(): void {
        this.addClicked.emit();
    }

    public onIncreaseSortOrderClicked(id: string): void {
        this.increaseSortOrderClicked.emit(id);
    }

    public onDecreaseSortOrderClicked(id: string): void {
        this.decreaseSortOrderClicked.emit(id);
    }

    public onLinkClicked(data: any): void {
        this.linkClicked.emit(data);
    }

    public onCellValueChanged(data: any): void {
        this.cellValueChanged.emit(data);
    }

    public onBlur(data: any): void {
        this.blur.emit(data);
    }

    public onPageCountChanged(data: any) {
        this.numPages = data;
    }
    
    public toggleDetail(heading: any, rowNo: number, detailRows: any[]): any[] {
        return this.ngTableComponent.toggleDetail(heading, rowNo, detailRows);
    }

    public toggleRowDetail(rowNo: number): any {
        const component = this.ngTableComponent.toggleRowDetail(rowNo);
        this.rows = this.ngTableComponent.rows;
        return component;
    }

    public get allRowsValid() {
        return this.ngTableComponent.allRowsValid;
    }

    public get itemsPerPage(): number {
        return this.itemsPerPageSelector.itemsPerPage;
    }

    public get totals() {
        return this.ngTableComponent.totals;
    }

    public setPage(pageNo: number) {
        this.pagination.selectPage(pageNo);
    }

    public renderRows(insertSubForms: boolean = false) {
        this.ngTableComponent.renderRows(insertSubForms);
    }

    public setRows(rows: any) {
        this.rows = rows;
        this.ngTableComponent.setRows(rows);
    }
}

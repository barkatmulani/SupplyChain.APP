import { Component, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'itemsperpageselector',
    moduleId: module.id,
    templateUrl: 'itemsPerPageSelector.html',
})

export class ItemsPerPageSelectorComponent implements OnChanges {

    @Output() itemsPerPageChanged: EventEmitter<any> = new EventEmitter();

    private currentSelection = 0;
    public itemsPerPageList: number[] = [10, 25, 50, 100];
    public itemsPerPage: number = 10;

    myValue: string;

    ngOnChanges() {
        this.itemsPerPage = this.itemsPerPageList[this.currentSelection];
    }

    onClick(i: number) {
        this.currentSelection = i;
        this.itemsPerPage = this.itemsPerPageList[i];
        this.itemsPerPageChanged.emit(this.itemsPerPageList[i]);
    }
}

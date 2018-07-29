import { Component, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'imagelink',
    moduleId: module.id,
    templateUrl: 'ng-table-imagelink.component.html'
})
export class NgTableImageLinkComponent {
    @Input() name: string = '';
    @Input() rowId: string = '';
    @Input() tooltip: string = '';
    @Input() imageUrl: string = '';

    @Output() linkClicked: EventEmitter<any> = new EventEmitter();

    // @ViewChild(HTMLLinkElement) htmlLink: HTMLLinkElement;

    public constructor() {

    }

    public onLinkClicked(event: any) {
        event.stopPropagation();
        this.linkClicked.emit({ name: this.name, rowId: this.rowId });
    }
}

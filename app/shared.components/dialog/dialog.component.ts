import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-dialog',
    moduleId: module.id,
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.css'],
    animations: [
        trigger('dialog', [
            transition('void => *', [
                style({ transform: 'scale3d(.3, .3, .3)' }),
                animate(100)
            ]),
            transition('* => void', [
                animate(100, style({ transform: 'scale3d(.0, .0, .0)' })),
            ])
        ])
    ]
})
export class DialogComponent implements OnInit, OnChanges {
    @Input() closable = false;
    @Input() visible: boolean;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit() { }

    ngOnChanges() {
        if(this.visible)
            document.body.classList.add('modal-open');
        else
            document.body.classList.remove('modal-open');
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }
}
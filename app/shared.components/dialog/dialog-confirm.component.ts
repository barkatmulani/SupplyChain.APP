import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-dialog-confirm',
    moduleId: module.id,
    templateUrl: './dialog-confirm.component.html',
})
export class DialogConfirmComponent implements OnInit, OnChanges {
    @Input() title:string;
    @Input() question: string;
    @Input() visible: boolean;

    @Output() answerEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit() { }

    ngOnChanges() {
       
    }

    onAnswerClicked(data: boolean): void {
        this.answerEvent.emit(data);
    }
}
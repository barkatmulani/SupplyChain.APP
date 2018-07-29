import { Component, ViewChild, NgModule, Output, EventEmitter, Input } from '@angular/core';
import {  Modal } from 'ngx-modal';

@Component({
  selector: 'confirmation',
  moduleId: module.id,
  templateUrl: 'confirmation.component.html'
})

export class ConfirmationComponent {
    @Input() message: string = 'Are you sure?';
    @Output() confirm: EventEmitter<any> = new EventEmitter();

    @ViewChild('modal') modal: Modal;

    constructor() {
    }

    public open() {
        this.modal.open();
    }

    public onOpen() {

    }

    public onSubmit() {
        this.confirm.emit();
        this.modal.close();
    }

    public onClose() {
        this.modal.close();
    }
}

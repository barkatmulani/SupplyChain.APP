import { Component, Input, Output, EventEmitter, forwardRef, OnChanges, OnInit } from '@angular/core';
import { TextValuePair } from './TextValuePair';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => DropdownComponent)
};

@Component({
    selector: 'dropdown',
    moduleId: module.id,
    templateUrl: 'dropdown.component.html',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})

export class DropdownComponent implements ControlValueAccessor, OnInit, OnChanges {
    myValue: string;

    @Input() title: string;
    @Input() showTooltip: boolean;
    @Input() disabled: boolean = false;
    @Input() showLabel: boolean = false;
    @Input() selectedValue: string = '';
    @Input() items: TextValuePair[] = [new TextValuePair('', '', '')];
    @Output() onSelected: EventEmitter<string> = new EventEmitter();

    ngOnInit(): void {
    }

    ngOnChanges(): void {
        this.value = this.selectedValue;
    }

    onChanged(): void {
        this.onSelected.emit(this.value);
    }

    writeValue(obj: any): void {
        this.myValue = obj;
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }
    registerOnTouched(fn: any): void {

    }

    propagateChange = (_: any) => { };

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    get value(): any {
        if (!this.items || this.items.length === 0) this.value = ''; //console.log(this.title + ': ' + this.myValue)
        return this.myValue;
    }
    set value(v: any) {
        if (v !== this.myValue) {
            this.myValue = v;
            this.propagateChange(v);
        }
    }

    get tooltip(): string {
        let retVal: string = '';
        if (this.showTooltip && this.items && this.items.length > 0) {
            let val = this.items.filter(x => x.value === this.myValue)[0];
            if (val) retVal = val.text;
        }
        return retVal;
    }
}

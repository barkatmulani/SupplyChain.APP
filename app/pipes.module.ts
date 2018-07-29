import { NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe, DecimalPipe, DatePipe } from "@angular/common";

import { OrderByPipe } from "./pipes.components/orderbypipe";
import { SortPipe } from './pipes.components/sortpipe';
import { FormatPipe } from './pipes.components/formatpipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        OrderByPipe,
        SortPipe,
        FormatPipe
    ],
    exports: [
        OrderByPipe,
        SortPipe,
        FormatPipe
    ],
    providers: [
        CurrencyPipe,
        DecimalPipe,
        DatePipe
    ]
})

export class PipesModule {
    constructor() {
    }
}
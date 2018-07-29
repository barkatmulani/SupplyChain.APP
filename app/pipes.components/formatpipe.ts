import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe, DecimalPipe, DatePipe } from '@angular/common';
import locale from '@angular/common/locales/fr-BE';

@Pipe({
    name: 'format'
})
export class FormatPipe implements PipeTransform {
    constructor(private cp: CurrencyPipe,
                private np: DecimalPipe,
                private dp: DatePipe) {

    }
    transform(text: string, format: string): string {
        switch (format) {
            case 'currency': return !text ? '' : this.cp.transform(0 + (!text ? '' : text), 'AUD');
            case 'currencyAct': return text ? '$' : 0 + (!text ? '' : text);
            case 'currencyNeg': return text ? this.cp.transform(text, '$', true, '1.2-2').replace('(', '-').replace(')', '') : (text === '0' ? '$0.00' : null);
            case 'number': return this.np.transform(text, '1.2');
            case 'blankIfZero': return ((parseFloat(text) === 0) ? '' : text);
            case 'date': return this.dp.transform(text, 'dd/MM/yyyy');
            case 'datetime':
                return this.dp.transform(text, 'dd/MM/yyyy hh:mm a');
            case 'datetime2':
                return this.dp.transform(text, 'EEEE, dd/MM/yyyy hh:mm a');
            default:
                return (text !== undefined ? text : '');
        }
    }
}

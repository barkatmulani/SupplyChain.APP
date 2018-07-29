"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var FormatPipe = /** @class */ (function () {
    function FormatPipe(currencyPipe, decimalPipe, datePipe) {
        this.currencyPipe = currencyPipe;
        this.decimalPipe = decimalPipe;
        this.datePipe = datePipe;
    }
    FormatPipe.prototype.transform = function (text, format) {
        switch (format) {
            case 'currency':
                !text ? '' : this.currencyPipe.transform(0 + (!text ? '' : text), 'AUD');
            case 'currencyAct':
                !text ? '$' : 0 + (!text ? '' : text);
            case 'currencyNeg':
                return text ? ((this.currencyPipe.transform(text, '$', 'symbol', '1.2-2')).replace("(", "-").replace(")", "")) : (text == '0' ? '$0.00' : null);
            //parseFloat(text)
            // return amount ? ($filter('currency', '')(roundOff(amount), "$")).replace("(", "-").replace(")", "") : amount == 0 ? '$0.00' : null;
            case 'number':
                return this.decimalPipe.transform(text, '1.2');
            case 'blankIfZero':
                return ((parseFloat(text) === 0) ? '' : text);
            case 'date':
                return this.datePipe.transform(text, 'dd/MM/yyyy');
            case 'datetime':
                return this.datePipe.transform(text, 'dd/MM/yyyy hh:mm a');
            case 'datetime2':
                return this.datePipe.transform(text, 'EEEE, dd/MM/yyyy hh:mm a');
            default:
                return (text != undefined ? text : '');
        }
    };
    FormatPipe = __decorate([
        core_1.Pipe({
            name: 'format'
        }),
        __metadata("design:paramtypes", [common_1.CurrencyPipe,
            common_1.DecimalPipe,
            common_1.DatePipe])
    ], FormatPipe);
    return FormatPipe;
}());
exports.FormatPipe = FormatPipe;
//# sourceMappingURL=formatpipe.js.map
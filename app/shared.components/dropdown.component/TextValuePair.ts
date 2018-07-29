export class TextValuePair {
    text: string;
    value: string;
    tooltip: string;

    constructor(text: string, value: string, tooltip: string = '') {
        this.text = text;
        this.value = value;
        this.tooltip = tooltip;
    }
}

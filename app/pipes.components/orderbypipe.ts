import { Pipe } from "@angular/core";

@Pipe({
    name: "orderby"
})
export class OrderByPipe {
    transform(array: Array<number>, args: number): Array<number> {
        array.sort((a: number, b: number) => {
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        });
        return array;
    }
}
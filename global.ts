export class Global {
    //static dbUrl = 'https://supplychainmanagementsystem-api.azurewebsites.net/';
    static dbUrl = 'http://localhost:2020/';

    static staticConstructor() {
        var docURL = document.URL;

        var prefix = 'http://'
        if (docURL.indexOf('https://') >= 0) {
            prefix = 'https://'
        }

        if (docURL.indexOf('localhost') >= 0) {
            Global.dbUrl = prefix + 'localhost:2020/';
        }
        else if (docURL.indexOf('azure') >= 0) {
            Global.dbUrl = prefix + 'supplychainmanagementsystem-api.azurewebsites.net/';
        }

        console.log('Global.dbUrl: ' + Global.dbUrl);
    }

    public static stripFromUrl(count: number) {
        let url = window.location.href;
        let newUrl = url;
        let arr = url.split('/');
        if(arr.length > count) {
          arr.pop();
          newUrl = arr.join('/');
        }
    
        if (typeof (history.pushState) != "undefined") {
            history.pushState({}, null, newUrl);
        } else {
            window.location.href = newUrl;
        }
    }

    public static getEscapeSequence = function(str: string) : string {
        let i: number;
        let s, outStr: string = "";

        for (i = 0; i < str.length; i++) {
            s = str.charCodeAt(i).toString(16);
            s = (s.length == 1 ? '0' : '') + s;

            outStr += '%' + s;
        }

        return outStr;
    }

    public static addArrayItem(array: any[], item: any): any[] {
        let temp = array.slice();
        temp[temp.length] = item;
        return temp;
    }

    public static removeArrayItem(array: any[], index: number): any[] {
        let temp = array.slice();
        temp.splice(index, 1);
        return temp;
    }

    public static cloneObject(aObject: any) {
        var bObject, v, k;
        bObject = Array.isArray(aObject) ? [] : {};
        for (k in aObject) {
            v = aObject[k];
            bObject[k] = (typeof v === "object") ? this.cloneObject(v) : v;
        }
        return bObject;
    }
    
    public static getMonthName(monthNo: number): string {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthNo - 1];
    }

    public static getFormattedDate(d: Date): string {
        return d.getDate() + '-' + Global.getMonthName(d.getMonth()) + '-' + d.getFullYear();
    }

    public static getCurrentDate(): string {
        let d = new Date(Date.now());
        return d.getFullYear() + '-' + this.appendZeros(d.getMonth(), 2) + '-' + this.appendZeros(d.getDate(), 2);
    }

    private static appendZeros(n: number, digits: number) {
        let str = '';
        for(let i = ('' + n).length; i < digits; i++) {
            str += '0';
        }
        return str + n;
    }
}

export enum Status
{
  Open = 1,
  Posted,
  Cancelled
}
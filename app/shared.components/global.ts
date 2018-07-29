import { Injectable } from "@angular/core";

export class Global {
    static url: string = '';
    static web: string = '';
    static shorturl: string = '';
    static shortweb: string = '';
    static env: string = 'DEV';

    static staticConstructor() {
        var docURL = document.URL;
        var _prefix = 'http://'
        if (docURL.indexOf('https://') >= 0) {
            _prefix = 'https://'
        }
        if (docURL.indexOf('UAT') >= 0) {
            Global.url = _prefix + 'views-t.vpl.com.au/Views.API.UAT/';
            Global.web = _prefix + 'views-t.vpl.com.au/Views.Web.UAT/';
            Global.shorturl = 'Views.API.UAT/';
            Global.shortweb = 'Views.Web.UAT/';
        }
        else if (docURL.indexOf('52.237.215.222') >= 0) {
            Global.url = _prefix + '52.237.215.222/Views.API.SIT/';
            Global.web = _prefix + '52.237.215.222/Views.Web.SIT/';
            Global.shorturl = 'Views.API.SIT/';
            Global.shortweb = 'Views.Web.SIT/';
        }
        else if (docURL.indexOf('172.16.3.19') >= 0) {
            Global.url = _prefix + '172.16.3.19/Views.API.SIT/';
            Global.web = _prefix + '172.16.3.19/Views.Web.SIT/';
            Global.shorturl = 'Views.API.SIT/';
            Global.shortweb = 'Views.Web.SIT/';
        }
        else if (docURL.indexOf('Test2') >= 0) {
            Global.url = _prefix + 'views-t.vpl.com.au/Views.API.Test2/';
            Global.web = _prefix + 'views-t.vpl.com.au/Views.Web.Test2/';
            Global.shorturl = 'Views.API.Test2/';
            Global.shortweb = 'Views.Web.Test2/';
        }
        else if (docURL.indexOf('localhost') >= 0) {
            Global.url = _prefix + 'localhost/Views.API/';
            Global.web = _prefix + 'localhost/Views.Web/';
            Global.shorturl = 'Views.API/';
            Global.shortweb = 'Views.Web/';
        }
    }

    public static Constants = {
        get ZionAPI() {
            Global.staticConstructor();
            return {
                URL: Global.url,
                Web: Global.web,
                ShortURL: Global.shorturl,
                ShortWeb: Global.shortweb,
                Env: Global.env
            };
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
}

@Injectable()
export class SpinnerService {

    public show(): void {
        let spinner = document.getElementById('loading-bar-spinner')
        if (spinner) spinner.style.display = "";
    }

    public hide(): void {
        let spinner = document.getElementById('loading-bar-spinner')
        if (spinner) spinner.style.display = "none";
    }

}

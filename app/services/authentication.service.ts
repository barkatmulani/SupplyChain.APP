import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http,
        private restangular: Restangular) {
        this.fillAuthData();
    }

    zionAPI: any = {
	    URL: '#{ZionAPIUrl}',
        Web: '#{ZionWEBUrl}'
    };

    zionPaths: any = {
        Login: 'Account/Login',
        Logout: 'Account/LogOff',
        Token: 'token'
    }

    _authentication: any = {
        isAuth: false,
        userName: "",
        userAccessInfo : {},
    };

    authServiceFactory: any = {};

    token(loginData: any): any {
        var data = {
            'username': loginData.username,
            'password': loginData.password
        };

        this.http.post(this.zionAPI.Web + this.zionPaths.Token, data)
            .subscribe((response: any) => { return response },
            (error: any) => { return error });
    }

    fillAuthData(): void {
        //console.log('this.zionAPI.Env: ' + this.zionAPI.Env);
        let authData = localStorage.getItem(this.zionAPI.Env + "authorizationData");
        if (authData) {
            var authDataJSON = JSON.parse(authData);
            this._authentication.isAuth = true;
            this._authentication.userName = authDataJSON.userName;
        }
        
        // Which accesses a user has
        let accessData = localStorage.getItem('userAccessData');
        if (accessData) {
            this._authentication.userAccessInfo = JSON.parse(accessData);
        }
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    public getBearerToken(): string {
        return 'Xko0w4BRKajozCVy20X11MRZs1';
    }

    // Returns whether or not the user has a particular access
    public userHasAccess(projectID: string, moduleName: string, areaName: string, accessName: string): boolean {
        let matchingProject = this._authentication.userAccessInfo.Projects.find((x: any) => x.ProjectID == projectID);
        if (matchingProject !== undefined) {
            let matchingModule = matchingProject.Modules.find((x: any) => x.Name == moduleName);
            if (matchingModule !== undefined) {
                let matchingArea = matchingModule.Areas.find((x: any) => x.Name == areaName);
                if (matchingArea !== undefined) {
                    return matchingArea.Accesses.find((x: any) => x.Name == accessName) !== undefined;
                }
            }
        }
        return false;
    }

    //postLogin(loginData: any): Observable<any> {
    //    let url = this.zionAPI.Web + this.zionPaths.Login;
    //    let headers = new Headers({ 'Content-Type': 'application/json' });
    //    let options = new RequestOptions();

    //    return this.http.post(url, JSON.stringify(loginData), options)
    //        .map((response: Response) => <any>response.json())
    //        .catch(this.handleError);
    //}

    //logout(): void {
    //    this.http.get(this.zionAPI.Web + this.zionPaths.Logout)
    //        .subscribe(response => { return response },
    //        (error: any) => { return error });
    //}

    //_clearToken(): any {
    //    this.storage.localStorage.removeItem(this.zionAPI.Env + "authorizationData");
    //    this._authentication.isAuth = false;
    //    this._authentication.userName = "";
    //};
}
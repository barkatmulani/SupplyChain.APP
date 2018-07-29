import { NgModule } from '@angular/core';
import { AppComponent } from '../app.component';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { AuthenticationService } from './authentication.service';
import { Global } from '../shared.components/shared.global';

// Function for settting the default restangular configuration
export function RestangularConfigFactory(RestangularProvider: any) {

    // set static header
    RestangularProvider.setBaseUrl('/' + Global.Constants.ZionAPI.ShortURL + 'SHEQ/');
    RestangularProvider.setRestangularFields({ id: 'id' });
    //RestangularProvider.setDefaultHeaders({ 'Authorization': 'Bearer UDXPx-Xko0w4BRKajozCVy20X11MRZs1' });
    let header = getHeader();

    RestangularProvider.setDefaultHeaders(header);

    //RestangularProvider.addErrorInterceptor((response: any, subject: any, responseHandler: any) => {

    //    console.log(response + ' - ' + subject + ' - ' + responseHandler);
    //    return false; // error handled
    //});

    // by each request to the server receive a token and update headers with it
    RestangularProvider.addFullRequestInterceptor((element: any, operation: any, path: any, url: any, headers: any, params: any) => {
        let authInterceptorServiceFactory = {};

        let _request = function (config: any) {
        
            config = getHeader();

            return config;
        };

        let _responseError = function (rejection:any) {
            if (rejection.status === 401) {
                localStorage.removeItem(Global.Constants.ZionAPI.Env + 'authorizationData'); 
                window.location.href = Global.Constants.ZionAPI.ShortWeb + '/Account/LogOff'; //authService.zionAPI.Web + authService.zionPaths.Logout;
            }
            console.log(rejection);
            //return $q.reject(rejection);
        };

        authInterceptorServiceFactory = Object.assign({}, authInterceptorServiceFactory, { request: _request, responseError: _responseError });

        return authInterceptorServiceFactory;
    });

}

function getHeader() {
    let header = {Authorization: ''};

    let authData = localStorage.getItem(Global.Constants.ZionAPI.Env + 'authorizationData');
   
    if (authData) {
        let authDataJSON = JSON.parse(authData);
        header.Authorization = 'Bearer ' + authDataJSON.token;
    }

    return header;
}

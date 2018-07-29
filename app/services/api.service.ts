import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Global } from "../../global";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Injectable } from "@angular/core";

@Injectable()
export abstract class ApiService {
    constructor(protected http: HttpClient,
                private entity: string) {
    }

    public getAll(): Observable<any> {
        return this.http.get(Global.dbUrl + 'api/' + this.entity);
    }

    public get(id: number): Observable<any> {
        return this.http.get(Global.dbUrl + 'api/' + this.entity + '/' + id);
    }

    public post(record: any): Observable<any> {
        return this.http.post(Global.dbUrl + 'api/' + this.entity, record);
    }

    public put(id: number, record: any): Observable<any> {
        return this.http.put(Global.dbUrl + 'api/' + this.entity + '/' + id, record);
    }

    public delete(id: number): Observable<any> {
        return this.http.delete(Global.dbUrl + 'api/' + this.entity + '/' + id);
    }
}



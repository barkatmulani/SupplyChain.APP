import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Global } from '../../global';
import { HttpClient, HttpHeaders } from '@angular/common/http';

enum Entity {
    ITEM = 'item',
    VENDOR = 'vendor',
    INVENTORY = 'inventory',
    PURCHASE_ORDER = 'purchaseorder',
    PURCHASE_ORDER_ITEM = 'purchaseorderitem',
    RECEIPT = 'receipt'
}

@Injectable()
export class ItemService extends ApiService {
    constructor(http: HttpClient) {
        super(http, Entity.ITEM);
    }

}

@Injectable()
export class InventoryService extends ApiService {
    constructor(http: HttpClient) {
        super(http, Entity.INVENTORY)
    }
}

@Injectable()
export class VendorService extends ApiService {
    constructor(http: HttpClient) {
        super(http, Entity.VENDOR)
    }
}

@Injectable()
export class PurchaseOrderService extends ApiService {
    constructor(http: HttpClient) {
        super(http, Entity.PURCHASE_ORDER);
    }

    public getAllByStatusId(statusId: number): Observable<any> {
        return this.http.get(Global.dbUrl + 'api/' + Entity.PURCHASE_ORDER + '/' + statusId + '/1/1');
    }
}

@Injectable()
export class PurchaseOrderItemService extends ApiService {
    constructor(http: HttpClient) {
        super(http, Entity.PURCHASE_ORDER_ITEM);
    }
}

@Injectable()
export class ReceiptService extends ApiService {
    constructor(http: HttpClient) {
        super(http, Entity.RECEIPT);
    }

    public getAllByStatusId(statusId: number): Observable<any> {
        return this.http.get(Global.dbUrl + 'api/' + Entity.RECEIPT + '/' + statusId + '/1/1');
    }
}

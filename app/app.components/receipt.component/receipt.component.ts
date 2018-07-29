import { Component, ViewChild, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Global, Status } from '../../../global';
import { TableComponent } from '../../shared.components/datatable/table.component';
import { ItemService, InventoryService, VendorService, ReceiptService, PurchaseOrderService, PurchaseOrderItemService } from '../../services/common.services';
import { TextValuePair } from '../../models';
import { ConfirmationComponent } from '../../shared.components/confirmation.component/confirmation.component';

@Component({
  selector: 'receipt',
  moduleId: module.id,
  templateUrl: 'receipt.component.html'
})

export class ReceiptComponent implements OnInit, OnChanges {
  @Input() receiptId: string = 'New Record';
  @Input() mode: string = '';
  
  @Output() close: EventEmitter<any> = new EventEmitter();

  @ViewChild('datatable') datatable: TableComponent;
  @ViewChild('deleteconfirmation') deleteconfirmation: ConfirmationComponent;
  
  public frmReceipt: FormGroup;

  isDisabled: boolean;
  
  index: number;
  isTableDirty: boolean = false;
  itemList: any[] = [];
  purchaseOrderList: any[] = [];
  inventoryList: any[] = [];
  vendorList: any[] = [];
  receipt: any = {};
  
  receiptItems: any[] = [];
  pageNo: number = 1;
  columns: Array<any>;

  constructor(private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private itemService: ItemService,
              private inventoryService: InventoryService,
              private vendorService: VendorService,
              private receiptService: ReceiptService,
              private purchaseOrderService: PurchaseOrderService,
              private purchaseOrderItemService: PurchaseOrderItemService,
              private fb: FormBuilder,
              private http: HttpClient,
              private spinnerService: Ng4LoadingSpinnerService)
  {
    let args: any[] = [];
    
    this.loadDropdowns();

    let id = this.route.snapshot.params['id'];
    if(id && id > 0) {
      this.receiptId = id;
    }
    
    let pageNo = this.route.snapshot.params['pageNo'];
    if(pageNo && pageNo > 0) {
      this.pageNo = pageNo;
    }

    let mode = this.route.snapshot.data.length;
    if(mode) {
      
    }

    Global.stripFromUrl(5);
  }

  ngOnInit() {
    this.frmReceipt = this.fb.group({
      active: true,
      purchaseOrderId: '',
      purchaseOrderTotal: { value: 0, disabled: true },
      vendorId: { value: 0, disabled: true },
      inventoryId: [{ value: 0, disabled: this.isDisabled }, Validators.required],
      purchaseOrderDate: { value: '', disabled: true },
      estDeliveryDate: { value: '', disabled: true },
      receiptDate: [{ value: Global.getCurrentDate(), disabled: this.isDisabled }, Validators.required],
      receiptTotal: { value: 0, disabled: this.isDisabled },
      extraCost: { value: 0, disabled: this.isDisabled }
    });

    this.columns = [
      { key: 'D', tooltip: 'Delete Item', imageUrl: 'assets/delete3.png', width: '40px' }, // 0
      { title: 'Receipt Item Id', name: 'receiptItemId', hidden: true }, // 1
      { title: 'Item', name: 'itemId', itemsProp: 'itemList', width: "200px" }, // 2
      { title: 'Cost', name: 'cost', width: "150px", format: 'currency' }, // 3
      { title: 'PO Qty.', name: 'poQuantity', type: 'number', format: 'number', width: "150px", disabled: true }, // 4
      { title: 'Rec. Qty.', name: 'quantity', type: 'number', format: 'number', width: "150px" }, // 5
      { title: 'Total', name: 'totalCost', width: "150px", format: 'currency', calcFormula: "[3] * [5]" }, // 6
    ];

    this.getRecord();
  }

  ngOnChanges() {
    this.getRecord();
  }

  getRecord() {
    this.isDisabled = (this.mode === 'V');
    
    if(this.receiptId !== 'New Record') {

      this.spinnerService.show();

      this.http.get(Global.dbUrl + 'api/receipt/' + this.receiptId).subscribe((data: any) => {
        this.loadData(data);
      },
      error => {
        console.log(error);
      },
      () => {
        this.spinnerService.hide();
      });

      this.spinnerService.hide();
    }
  }

  loadDropdowns() {
    this.spinnerService.show();

    this.itemList = [];
    this.itemService.getAll().subscribe(
      (data: any) => { data.map(x => {
        this.itemList.push(new TextValuePair(x.itemDescription, x.itemId));
      })},
      (error: any) => { console.log(error); },
      () => {
      });

    this.purchaseOrderList = [];
    this.purchaseOrderService.getAllByStatusId(2).subscribe(
      (data: any) => { this.purchaseOrderList = data },
      (error: any) => { console.log(error); },
      );

    this.inventoryList = [];
    this.inventoryService.getAll().subscribe(
      (data: any) => { this.inventoryList = data },
      (error: any) => { console.log(error); },
      );

    this.vendorList = [];
    this.vendorService.getAll().subscribe(
      (data: any) => { this.vendorList = data },
      (error: any) => { console.log(error); },
      );

    this.spinnerService.hide();
  }

  loadData(data: any) {
    this.receipt = data;
    console.log(data);
    this.frmReceipt.patchValue({
        active: data.active,
        receiptDate: data.receiptDate.substr(0, 10),
        receiptTotal: data.receiptTotal,
        purchaseOrderId: data.purchaseOrderId,
        inventoryId: data.inventoryId,
        vendorId: data.vendorId,
        estDeliveryDate: data.estDeliveryDate ? data.estDeliveryDate.substr(0, 10) : '',
        extraCost: data.extraCost,
        receiptItem: data.receiptItem
    });

    this.onPurchaseOrderChanged(data, false);

    this.receiptItems = [];
    if(data.receiptItem && data.receiptItem.length > 0)
      data.receiptItem.forEach(x => {
        this.receiptItems.push(Object.assign({} , x.itemList = this.itemList, x));
      });
  }

  onSave() {
    let receiptItem: any[] = [];
    let receiptId: number = parseInt(this.receiptId) | 0;
    let receiptTotal: number = 0;

    console.log(this.receiptItems);

    this.receiptItems.forEach(x => {
      receiptItem.push( {
        receiptItemId: x.receiptItemId,
        receiptId: receiptId,
        itemId: x.itemId,
        quantity: x.quantity,
        cost: x.cost,
        totalCost: x.totalCost
      });

      receiptTotal += x.totalCost;
    });
    
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token',
        'Access-Control-Allow-Origin': '*'
      })};
  
    let receipt = {
      receiptId: receiptId,
      receiptDate: this.frmReceipt.get('receiptDate').value,
      active: true,
      purchaseOrderId: this.frmReceipt.get('purchaseOrderId').value,
      receiptTotal: receiptTotal,
      inventoryId: this.frmReceipt.get('inventoryId').value,
      extraCost: this.frmReceipt.get('extraCost').value,
      statusId: Status.Open,
      receiptItem: receiptItem
    };

    console.log(receipt);

    let methodCall: any;

    this.spinnerService.show();

    if(receiptId === 0) {
        methodCall = this.receiptService.post(receipt);
    }
    else {
        methodCall = this.receiptService.put(receiptId, receipt);
    }
  
    methodCall.subscribe((data: any) => {
        this.toastr.success('Record saved successfully', 'Success!');
        this.spinnerService.hide();
        this.router.navigate(['/receipt-list', this.pageNo]);
      },
      error => {
        console.log(error);
        this.toastr.error(error.message, 'Error!');
        this.spinnerService.hide(); 
      },
      () => {
    });
  }

  onCancel() {
    this.router.navigate(['/receipt-list', this.pageNo]);
  }

  onAddClicked() {
    this.receiptItems = Global.addArrayItem(this.receiptItems,
      { pOItemId: 0, estDeliveryDate: '', shipmentCost: 0, itemId: '', itemList: this.itemList });
    this.isTableDirty = true;
  }

  onLinkClicked(data: any) {
    switch(data.name) {
      case 'D':
        this.index = data.rowIndex;
        this.deleteconfirmation.open();
        break;
    }
  }

  onCellValueChanged(data: any) {
    //if(data.columnName === 'itemId')
  }

  onDropdownChanged(data: any) {
    let row = this.receiptItems[data.rowNo];
    console.log(data);
    if(data.columnName === 'itemId') {
        this.fillItemDetails(data.id, row);
    }
  }

  fillItemDetails(id: number, row: any) {
    debugger;
    row.poQuantity = '';
    this.itemService.get(id).subscribe(data => {
      row.cost = data.cost;
      this.datatable.renderRows();
    });

    let purchaseOrderId = this.frmReceipt.get('purchaseOrderId').value;
    this.purchaseOrderItemService.get(purchaseOrderId).subscribe(data => {
      let item = data.filter(x => x.itemId === id)[0];
      row.poQuantity = item.quantity;
      this.datatable.renderRows();
    });
  }

  onDeleteConfirm() {
    this.receiptItems = Global.removeArrayItem(this.receiptItems, this.index);
    this.toastr.success('Record deleted successfully', 'Success!');
    this.isTableDirty = true;
  }

  onPurchaseOrderChanged(data: any, loadItems: boolean = false) {
    console.log(data);
    let rec = this.purchaseOrderService.get(data.purchaseOrderId).subscribe( rec => {
      this.frmReceipt.get('purchaseOrderId').disable();

      this.frmReceipt.patchValue({
        purchaseOrderTotal: rec.purchaseOrderTotal,
        vendorId: rec.vendorId,
        inventoryId: rec.inventoryId,
        purchaseOrderDate: rec.purchaseOrderDate.substr(0, 10),
        estDeliveryDate: rec.estDeliveryDate.substr(0, 10)
      });
      console.log(rec.purchaseOrderItem);

      if(loadItems) {
        rec.purchaseOrderItem.forEach(x => {
          x.poQuantity = x.quantity;
          x.itemList = this.itemList;
        });

        this.receiptItems = rec.purchaseOrderItem;
      }
      else {
        this.receiptItems.forEach(receiptItem => {
          receiptItem.poQuantity = rec.purchaseOrderItem.filter(poItem => poItem.itemId === receiptItem.itemId)[0].quantity;
        });
      }
    });
  }
}

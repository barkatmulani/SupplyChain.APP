import { Component, ViewChild, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Global, Status } from '../../../global';
import { TableComponent } from '../../shared.components/datatable/table.component';
import { ItemService, InventoryService, VendorService, PurchaseOrderService } from '../../services/common.services';
import { TextValuePair } from '../../models';
import { ConfirmationComponent } from '../../shared.components/confirmation.component/confirmation.component';

@Component({
  selector: 'purchaseorder',
  moduleId: module.id,
  templateUrl: 'purchaseorder.component.html'
})

export class PurchaseOrderComponent implements OnInit, OnChanges {
  @Input() purchaseOrderId: string = 'New Record';
  @Input() mode: string = '';

  @Output() close: EventEmitter<any> = new EventEmitter();

  @ViewChild('datatable') datatable: TableComponent;
  @ViewChild('deleteconfirmation') deleteconfirmation: ConfirmationComponent;
  
  public frmPurchaseOrder: FormGroup;

  isDisabled: boolean;
  index: number;
  isTableDirty: boolean = false;
  itemList: any[] = [];
  inventoryList: any[] = [];
  vendorList: any[] = [];
  purchaseOrder: any = {};
  
  pOItems: any[] = [];
  pageNo: number = 1;
  columns: Array<any>;

  constructor(private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private itemService: ItemService,
              private inventoryService: InventoryService,
              private vendorService: VendorService,
              private purchaseOrderService: PurchaseOrderService,
              private fb: FormBuilder,
              private http: HttpClient,
              private spinnerService: Ng4LoadingSpinnerService)
  {
    let args: any[] = [];
    
    this.loadDropdowns();

    let id = this.route.snapshot.params['id'];
    if(id && id > 0) {
      this.purchaseOrderId = id;
    }
    
    let pageNo = this.route.snapshot.params['pageNo'];
    if(pageNo && pageNo > 0) {
      this.pageNo = pageNo;
    }

    let mode = this.route.snapshot.data.length;//[0]['mode'];
    if(mode) {
      this.mode = mode;
    }

    Global.stripFromUrl(5);
  }

  ngOnInit() {
    this.frmPurchaseOrder = this.fb.group({
      active: true,
      purchaseOrderDate: [{ value: '', disabled: this.isDisabled }, Validators.required],
      purchaseOrderTotal: { value: 0, disabled: this.isDisabled },
      inventoryId: [{ value: 0, disabled: this.isDisabled }, Validators.required],
      vendorId: [{value: 0, disabled: this.isDisabled }, Validators.required],
      estDeliveryDate: { value: '', disabled: this.isDisabled },
      shipmentCost: [{ value: 0, disabled: this.isDisabled }]
    });

    this.columns = [
      { key: 'D', tooltip: 'Delete Item', imageUrl: 'assets/delete3.png', width: '40px' }, // 0
      { title: 'PO Item Id', name: 'purchaseOrderItemId', hidden: true }, // 1
      { title: 'Item', name: 'itemId', itemsProp: 'itemList', width: "200px" }, // 2
      { title: 'Avg. Cost', name: 'cost', width: "150px", format: 'currency' }, // 3
      { title: 'Qty.', name: 'quantity', type: 'number', format: 'number', width: "150px" }, // 4
      { title: 'Total', name: 'totalCost', width: "150px", format: 'currency', calcFormula: "[3] * [4]" }, // 5
    ];

    this.getRecord();
  }

  ngOnChanges() {
    this.getRecord();
  }

  getRecord() {
    this.isDisabled = (this.mode === 'V');
    
    if(this.purchaseOrderId && this.purchaseOrderId !== 'New Record') {

      this.spinnerService.show();

      this.purchaseOrderService.get(Number(this.purchaseOrderId)).subscribe((data: any) => {
        this.loadData(data);
      },
      error => {
        console.log(error);
      },
      () => {
        this.spinnerService.hide();
      });
    }
  }

  loadDropdowns() {
    this.itemList = JSON.parse(sessionStorage.getItem("itemList"));
    this.inventoryList = JSON.parse(sessionStorage.getItem("inventoryList"));
    this.vendorList = JSON.parse(sessionStorage.getItem("vendorList"));
  }

  loadData(data: any) {
    this.purchaseOrder = data;
    
    this.frmPurchaseOrder.patchValue({
        active: data.active,
        purchaseOrderDate: data.purchaseOrderDate.substr(0, 10),
        purchaseOrderTotal: data.purchaseOrderTotal,
        inventoryId: data.inventoryId,
        vendorId: data.vendorId,
        estDeliveryDate: data.estDeliveryDate.substr(0, 10),
        shipmentCost: data.shipmentCost,
        purchaseOrderItem: data.purchaseOrderItem
    });

    this.pOItems = [];
    if(data.purchaseOrderItem && data.purchaseOrderItem.length > 0)
      data.purchaseOrderItem.forEach(x => {
        this.pOItems.push(Object.assign({} , x.itemList = this.itemList, x));
      });
  }

  onSave() {
    let purchaseOrderItem: any[] = [];
    let purchaseOrderId: number = parseInt(this.purchaseOrderId) | 0;
    let purchaseOrderTotal: number = 0;

    console.log(this.pOItems);

    this.pOItems.forEach(x => {
      purchaseOrderItem.push( {
        purchaseOrderItemId: x.purchaseOrderItemId,
        purchaseOrderId: purchaseOrderId,
        itemId: x.itemId,
        quantity: x.quantity,
        cost: x.cost,
        totalCost: x.totalCost
      });

      purchaseOrderTotal += x.totalCost;
    });
    
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token',
        'Access-Control-Allow-Origin': '*'
      })};
  
    let purchaseOrder = {
      purchaseOrderId: purchaseOrderId,
      active: this.frmPurchaseOrder.get('active').value,
      statusId: Status.Open,
      purchaseOrderDate: this.frmPurchaseOrder.get('purchaseOrderDate').value,
      purchaseOrderTotal: purchaseOrderTotal,
      inventoryId: this.frmPurchaseOrder.get('inventoryId').value,
      vendorId: this.frmPurchaseOrder.get('vendorId').value,
      estDeliveryDate: this.frmPurchaseOrder.get('estDeliveryDate').value,
      shipmentCost: this.frmPurchaseOrder.get('shipmentCost').value,
      purchaseOrderItem: purchaseOrderItem
    };

    console.log(purchaseOrder);

    let methodCall: any;

    this.spinnerService.show(); 

    if(purchaseOrderId === 0) {
        methodCall = this.purchaseOrderService.post(purchaseOrder);
    }
    else {
        methodCall = this.purchaseOrderService.put(purchaseOrderId, purchaseOrder);
    }
  
    methodCall.subscribe((data: any) => {
        this.toastr.success('Record saved successfully', 'Success!');
        this.spinnerService.hide();
        this.router.navigate(['/purchaseorder-list', this.pageNo]);
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
    this.router.navigate(['/purchaseorder-list', this.pageNo]);
  }

  onClose() {
    this.close.emit();
  }

  onAddClicked() {
    this.pOItems = Global.addArrayItem(this.pOItems,
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
    let row = this.pOItems[data.rowNo];
    if(data.columnName === 'itemId') {
        this.fillItemDetails(data.id, row);
    }
  }

  fillItemDetails(id: number, row: any) {
    this.itemService.get(id).subscribe(data => {
      row.cost = data.cost;
      this.datatable.renderRows();
    });
  }

  onDeleteConfirm() {
    this.pOItems = Global.removeArrayItem(this.pOItems, this.index);
    this.toastr.success('Record deleted successfully', 'Success!');
    this.isTableDirty = true;
  }
}

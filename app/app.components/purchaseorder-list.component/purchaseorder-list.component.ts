import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PaginationComponent } from 'ngx-bootstrap';
import { TableComponent } from '../../shared.components/datatable/table.component';
import { Global } from '../../../global';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { PurchaseOrderService } from '../../services/common.services';
import { ConfirmationComponent } from '../../shared.components/confirmation.component/confirmation.component';

@Component({
  selector: 'purchaseorder-list',
  moduleId: module.id,
  templateUrl: 'purchaseorder-list.component.html'
})

export class PurchaseOrderListComponent implements OnInit, OnChanges {
  rows: Array<any> = []; // = TableData;
  pageNo: number = 1;
  numPages = 1;
  itemsPerPage = 10;
  maxSize = 5;
  rowCount = 0;
  mode = 'P';
  poDialogVisible = false;

  purchaseOrderId: number;

  @ViewChild('datatable') datatable: TableComponent;
  @ViewChild('deleteconfirmation') deleteconfirmation: ConfirmationComponent;
  @ViewChild('postconfirmation') postconfirmation: ConfirmationComponent;
  columns: Array<any>;

  constructor(private router: Router,
              // private restangular: Restangular,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private purchaseOrderService: PurchaseOrderService,
              private http: HttpClient,
              private spinnerService: Ng4LoadingSpinnerService) {

    Global.stripFromUrl(4);

    let pageNo = route.params['pageNo'];
    if(pageNo && pageNo > 0) this.pageNo = pageNo;

    let mode = this.route.snapshot.data['mode'];
    console.log('mode: ' + mode);
    if(mode) this.mode = mode;

    this.columns = [
      { key: 'E', tooltip: 'Edit Purchase Order', imageUrl: 'assets/edit.png', width: '40px', hidden: (this.mode === 'P') },
      { key: 'D', tooltip: 'Delete Purchase Order', imageUrl: 'assets/delete3.png', width: '40px', hidden: (this.mode === 'P') },
      { key: 'P', tooltip: 'Post Purchase Order', imageUrl: 'assets/post.png', width: '40px', hidden: (this.mode === 'L') },
      { key: 'V', tooltip: 'Post Purchase Order', imageUrl: 'assets/view.png', width: '40px', hidden: (this.mode === 'L') },
      { title: 'PO #', name: 'purchaseOrderId' },
      { title: 'PO Date', name: 'purchaseOrderDate', format: 'date' },
      { title: 'Est. Delivery', name: 'estDeliveryDate', format: 'date' },
      { title: 'Total', name: 'purchaseOrderTotal', format: 'currency' },
      { title: 'Shipment', name: 'shipmentCost', format: 'currency' },
    ];
  }

  ngOnInit(): void {
    this.spinnerService.show();
 
    this.loadData();
  }

  ngOnChanges(): void {
  }

  loadData(): void {
    this.purchaseOrderService.getAllByStatusId(1).subscribe(data => {
      if (data.length > 0) {
        this.rows = data;
      } else {
        this.rows.push(data);
      }
    },
    error => {
      //this.rows = TableData;
      console.log(error);
      this.spinnerService.hide();
    },
    () => {
      this.rowCount = this.rows.length;
      this.rows.forEach(x => x.id = x.purchaseOrderId);
      this.spinnerService.hide();
    });
  }

  public onCellClick(data: any): any {
    console.log(data);
  }

  public onLinkClicked(data: any) {
    this.purchaseOrderId = data.rowId;

    switch(data.name) {
      case 'E':
        this.router.navigate(['/purchaseorder', this.purchaseOrderId, this.pageNo]);
        break;
      case 'D':
        this.deleteconfirmation.open();
        break;
      case 'P':
        this.postconfirmation.open();
        break;
      case 'V':
        this.poDialogVisible = true;
        break;
    }
  }

  public onAddClicked() {
    this.router.navigate(['/purchaseorder/0', this.pageNo]);
  }

  public onDeleteConfirm(id: string) {
    this.spinnerService.show();
    this.purchaseOrderService.delete(this.purchaseOrderId)
      .subscribe((data: any) => {
        this.toastr.success('Record deleted successfully', 'Success!');
        this.spinnerService.hide(); 
        this.loadData();
      },
      error => {
        this.toastr.error(error.message, 'Error!');
        this.spinnerService.hide(); 
      },
      () => {
      });
  }

  public onPostConfirm(id: string) {
    this.spinnerService.show();
    this.purchaseOrderService.put(this.purchaseOrderId, { statusId: 2 })
      .subscribe((data: any) => {
        this.toastr.success('Record posted successfully', 'Success!');
        this.spinnerService.hide();
        this.loadData();
      },
      error => {
        this.toastr.error(error.message, 'Error!');
        this.spinnerService.hide(); 
      },
      () => {
      });
  }

  public onChangeTable(config: any) {

  }

  public onPageChanged(data: any) {
    this.pageNo = data.pageNo;
  }

  public onClose() {
    this.poDialogVisible = false;
  }
}

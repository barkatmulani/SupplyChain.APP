import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PaginationComponent } from 'ngx-bootstrap';
import { TableComponent } from '../../shared.components/datatable/table.component';
import { Global } from '../../../global';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationComponent } from '../../shared.components/confirmation.component/confirmation.component';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/common.services';

@Component({
  selector: 'inventory-list',
  moduleId: module.id,
  templateUrl: 'inventory-list.component.html'
})

export class InventoryListComponent implements OnInit, OnChanges {
  rows: Array<any> = []; // = TableData;
  pageNo: number = 1;
  numPages = 1;
  itemsPerPage = 10;
  maxSize = 5;
  rowCount = 0;

  inventoryId: number;

  columns: Array<any> = [
    { key: 'E', tooltip: 'Edit Inventory', imageUrl: 'assets/edit.png', width: '40px' },
    { key: 'D', tooltip: 'Delete Inventory', imageUrl: 'assets/delete3.png', width: '40px' },
    { title: 'Inventory Id', name: 'inventoryId', hidden: true },
    { title: 'Inventory Description', name: 'inventoryDescription' },
    // filtering: {filterString: '', placeholder: 'Filter by descriiption'}, sort: 'asc'},
    { title: 'Address', name: 'address' },
  ];

  config: any = {
    paging: true,
    sorting: {columns: this.columns},
    filtering: {filterString: ''},
    className: ['table-striped', 'table-bordered']
  };

  @ViewChild('datatable') datatable: TableComponent;
  @ViewChild('deleteconfirmation') deleteconfirmation: ConfirmationComponent;

  constructor(private router: Router,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private http: HttpClient,
              private inventoryService: InventoryService,
              private spinnerService: Ng4LoadingSpinnerService) {

    Global.stripFromUrl(4);

    let pageNo = this.route.snapshot.params['pageNo'];
    if(pageNo && pageNo > 0) {
      this.pageNo = pageNo;
    }
  }

  ngOnInit(): void {
    this.spinnerService.show();
 
    this.loadData();
  }

  ngOnChanges(): void {
  }

  loadData(): void {
    this.inventoryService.getAll().subscribe((data: any) => {
      console.log(data);
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
      this.rows.forEach(x => x.id = x.inventoryId);
      this.spinnerService.hide(); 
    });
  }

  public onCellClick(data: any): any {
    console.log(data);
  }

  public onLinkClicked(data: any) {
    switch(data.name) {
      case 'E':
        this.router.navigate(['/inventory', data.rowId, this.pageNo]);
        break;
      case 'D':
        this.inventoryId = data.rowId;
        this.deleteconfirmation.open();
        break;
    }
  }

  public onAddClicked() {
    this.router.navigate(['/inventory/0', this.pageNo]);
  }

  public onDeleteConfirm(id: string) {
    this.spinnerService.show();
    this.http.delete(Global.dbUrl + 'api/inventory/' + this.inventoryId)
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

  public onChangeTable(config: any) {

  }

  public onPageChanged(data: any) {
    this.pageNo = data.pageNo;
  }
}

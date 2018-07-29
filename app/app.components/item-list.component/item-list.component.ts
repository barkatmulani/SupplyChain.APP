import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PaginationComponent } from 'ngx-bootstrap';
import { TableComponent } from '../../shared.components/datatable/table.component';
import { Global } from '../../../global';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationComponent } from '../../shared.components/confirmation.component/confirmation.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'itemlist',
  moduleId: module.id,
  templateUrl: 'item-list.component.html'
})

export class ItemListComponent implements OnInit, OnChanges {
  rows: Array<any> = []; // = TableData;
  pageNo: number = 1;
  numPages = 1;
  itemsPerPage = 10;
  maxSize = 5;
  rowCount = 0;

  itemId: number;

  columns: Array<any> = [
    { key: 'E', tooltip: 'Edit Item', imageUrl: 'assets/edit.png', width: '40px' },
    { key: 'D', tooltip: 'Delete Item', imageUrl: 'assets/delete3.png', width: '40px' },
    { title: 'Item Id', name: 'itemId', hidden: true },
    { title: 'Item Description', name: 'itemDescription' },
    // filtering: {filterString: '', placeholder: 'Filter by descriiption'}, sort: 'asc'},
    { title: 'Cost', name: 'cost' },
    { title: 'Price', name: 'price' },
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
              // private restangular: Restangular,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private http: HttpClient,
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
    this.http.get(Global.dbUrl + 'api/item').subscribe((data: any) => {
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
    },
    () => {
      this.rowCount = this.rows.length;
      this.rows.forEach(x => x.id = x.itemId);
      this.spinnerService.hide(); 
    });
  }

  public onCellClick(data: any): any {
    console.log(data);
  }

  public onLinkClicked(data: any) {
    switch(data.name) {
      case 'E':
        this.router.navigate(['/item', data.rowId, this.pageNo]);
        break;
      case 'D':
        this.itemId = data.rowId;
        this.deleteconfirmation.open();
        break;
    }
  }

  public onAddClicked() {
    this.router.navigate(['/item/0', this.pageNo]);
  }

  public onDeleteConfirm(id: string) {
    this.spinnerService.show();
    this.http.delete(Global.dbUrl + 'api/item/' + this.itemId)
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

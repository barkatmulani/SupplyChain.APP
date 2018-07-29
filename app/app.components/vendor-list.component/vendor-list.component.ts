import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TableComponent } from '../../shared.components/datatable/table.component';
import { Global } from '../../../global';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationComponent } from '../../shared.components/confirmation.component/confirmation.component';
import { ToastrService } from 'ngx-toastr';
import { VendorService } from '../../services/common.services';

@Component({
  selector: 'vendorlist',
  moduleId: module.id,
  templateUrl: 'vendor-list.component.html'
})

export class VendorListComponent implements OnInit, OnChanges {
  rows: Array<any> = []; // = TableData;
  vendorsPerPage = 10;
  maxSize = 5;
  numPages = 1;
  rowCount = 0;
  pageNo: number = 1;

  vendorId: number;

  columns: Array<any> = [
    { key: 'E', tooltip: 'Edit Vendor', imageUrl: 'assets/edit.png', width: '40px' },
    { key: 'D', tooltip: 'Delete Vendor', imageUrl: 'assets/delete3.png', width: '40px' },
    { title: 'Vendor Id', name: 'vendorId', hidden: true },
    { title: 'Name', name: 'vendorName' },
    // filtering: {filterString: '', placeholder: 'Filter by descriiption'}, sort: 'asc'},
    { title: 'Address', name: 'address' },
    { title: 'Phone #', name: 'phoneNo' },
  ];

  @ViewChild('datatable') datatable: TableComponent;
  @ViewChild('deleteconfirmation') deleteconfirmation: ConfirmationComponent;

  constructor(private router: Router,
              // private restangular: Restangular,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private http: HttpClient,
              private spinnerService: Ng4LoadingSpinnerService,
              private vendorService: VendorService) {

    Global.stripFromUrl(4);

    let pageNo = this.route.snapshot.params['pageNo'];
    if(pageNo && pageNo > 0) this.pageNo = pageNo;
  }

  ngOnInit(): void {
    this.spinnerService.show();
    
    this.loadData();
  }

  ngOnChanges(): void {
  }

  loadData(): void {
    this.vendorService.getAll().subscribe((data: any) => {
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
      this.rows.forEach(x => x.id = x.vendorId);
      this.spinnerService.hide(); 
    });
  }

  public onCellClick(data: any): any {
    console.log(data);
  }

  public onLinkClicked(data: any) {
    switch(data.name) {
      case 'E':
        this.router.navigate(['/vendor', data.rowId, this.pageNo]);
        break;
      case 'D':
        this.vendorId = data.rowId;
        this.deleteconfirmation.open();
        break;
    }
  }

  public onAddClicked() {
    this.router.navigate(['/vendor/0', this.pageNo]);
  }

  public onDeleteConfirm(id: string) {
    this.spinnerService.show();
    this.vendorService.delete(this.vendorId)
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

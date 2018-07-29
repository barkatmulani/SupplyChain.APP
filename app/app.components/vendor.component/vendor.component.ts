import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Global } from '../../../global';
import { VendorService } from '../../services/common.services';

@Component({
  selector: 'vendor',
  moduleId: module.id,
  templateUrl: 'vendor.component.html'
})
export class VendorComponent {
  
  public frmVendor: FormGroup;

  vendorId: number = 0;
  pageNo: number = 1;

  constructor(private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private http: HttpClient,
              private vendorService: VendorService,
              private spinnerService: Ng4LoadingSpinnerService)
  {
    let args: any[] = [];

    this.frmVendor = this.fb.group ({
      vendorName: ['', [Validators.required]],
      address: '',
      phoneNo: ''
    });
    
    let id = this.route.snapshot.params['id'];
    if(id && id > 0) {
      this.vendorId = id;
      this.spinnerService.show();

      this.vendorService.get(id).subscribe((data: any) => {
        this.loadData(data);
        this.spinnerService.hide(); 
      },
      error => {
        console.log(error);
        this.spinnerService.hide(); 
      },
      () => {
      });
    }
    
    let pageNo = this.route.snapshot.params['pageNo'];
    if(pageNo && pageNo > 0) this.pageNo = pageNo;

    Global.stripFromUrl(5);
  }

  loadData(data: any) {
    this.frmVendor.patchValue({
      vendorName: data.vendorName,
      address: data.address,
      phoneNo: data.phoneNo
    });
  }

  onSave() {
    let vendor = { vendorId: this.vendorId,
                   active: true,
                   vendorName: this.frmVendor.get('vendorName').value,
                   address: this.frmVendor.get('address').value,
                   phoneNo: this.frmVendor.get('phoneNo').value
                 };

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token',
        'Access-Control-Allow-Origin': '*'
      })};
    
    console.log(vendor);
    let methodCall: any;

    this.spinnerService.show(); 
    if(vendor.vendorId === 0) {
        methodCall = this.http.post(Global.dbUrl + 'api/vendor', vendor);
    }
    else {
        methodCall = this.http.put(Global.dbUrl + 'api/vendor/' + vendor.vendorId, vendor);
    }
        
    methodCall.subscribe((data: any) => {
        this.toastr.success('Record saved successfully', 'Success!');
        this.spinnerService.hide(); 
        this.router.navigate(['/vendor-list', this.pageNo]);
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
    this.router.navigate(['/vendor-list', this.pageNo]);
  }  
}

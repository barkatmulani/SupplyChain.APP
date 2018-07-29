import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Global } from '../../../global';
import { ItemService } from '../../services/common.services';

@Component({
  selector: 'item',
  moduleId: module.id,
  templateUrl: 'item.component.html'
})
export class ItemComponent {
  
  public frmItem: FormGroup;

  itemId: number = 0;
  pageNo: number = 1;

  constructor(private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private http: HttpClient,
              private spinnerService: Ng4LoadingSpinnerService,
              private itemService: ItemService)
  {
    let args: any[] = [];

    this.frmItem = this.fb.group({
      itemDescription: ['', Validators.required],
      cost: '',
      price: ''
    });
    
    let id = route.snapshot.params['id'];
    if(id && id > 0) {
      this.itemId = id;
      this.spinnerService.show(); 

      this.itemService.get(id).subscribe((data: any) => {
        this.loadData(data);
      },
      error => {
        console.log(error);
      },
      () => {
        this.spinnerService.hide(); 
      });
    }
    
    let pageNo = route.snapshot.params['pageNo'];
    if(pageNo && pageNo > 0) {
      this.pageNo = pageNo;
    }

    Global.stripFromUrl(5);
  }

  loadData(data: any) {
    this.frmItem.patchValue({
      itemDescription: data.itemDescription,
      cost: data.cost,
      price: data.price
    });
  }

  onSave() {
    let item = { itemId: this.itemId,
                 active: true,
                 itemDescription: this.frmItem.get('itemDescription').value,
                 cost: this.frmItem.get('cost').value,
                 price: this.frmItem.get('price').value
               };

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token',
        'Access-Control-Allow-Origin': '*'
      })};
    
    console.log(item);
    let methodCall: any;

    this.spinnerService.show(); 
    if(item.itemId === 0) {
        methodCall = this.http.post(Global.dbUrl + 'api/item', item);
    }
    else {
        methodCall = this.http.put(Global.dbUrl + 'api/item/' + item.itemId, item);
    }
        
    methodCall.subscribe((data: any) => {
        this.toastr.success('Record saved successfully', 'Success!');
        this.spinnerService.hide();
        this.router.navigate(['/itemlist', this.pageNo]);
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
    this.router.navigate(['/item-list', this.pageNo]);
  }  
}

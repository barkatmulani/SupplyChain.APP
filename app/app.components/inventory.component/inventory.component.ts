import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Global } from '../../../global';
import { InventoryService, ItemService } from '../../services/common.services';
import { TextValuePair } from '../../shared.components/dropdown.component/TextValuePair';

@Component({
  selector: 'inventory',
  moduleId: module.id,
  templateUrl: 'inventory.component.html'
})
export class InventoryComponent implements OnInit {
  
  public frmInventory: FormGroup;

  inventoryId: string = "New Record";
  itemList: any[] = [];
  items: any[] = [];
  pageNo: number = 1;
  columns: Array<any>;
  inventory: any = {};

  constructor(private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private http: HttpClient,
              private spinnerService: Ng4LoadingSpinnerService,
              private inventoryService: InventoryService,
              private itemService: ItemService)
  {
    let args: any[] = [];
    let id = this.route.snapshot.params['id'];
    if(id && id > 0) {
      this.inventoryId = id;
    }
    
    let pageNo = this.route.snapshot.params['pageNo'];
    if(pageNo && pageNo > 0) {
      this.pageNo = pageNo;
    }

    Global.stripFromUrl(5);
  }

  ngOnInit() {
    this.loadDropdowns();

    this.frmInventory = this.fb.group({
      inventoryDescription: ['', Validators.required],
      address: '',
    });
    
    this.columns = [
      { title: 'Inventory Item Id', name: 'inventoryItemId', hidden: true }, // 0
      { title: 'Item', name: 'itemId', itemsProp: 'itemList', width: "200px", disabled: true }, // 1
      { title: 'Qty.', name: 'totalQuantity', format: 'number', width: "150px" }, // 2
      { title: 'Avg. Cost', name: 'avgCost', width: "150px", format: 'currency' }, // 3
      { title: 'Total', name: 'totalCost', width: "150px", format: 'currency' }, // 4
    ];

    this.getRecord();
  }
  
  ngOnChanges() {
    this.getRecord();
  }

  getRecord() {
    if(this.inventoryId && this.inventoryId !== 'New Record') {

      this.spinnerService.show(); 

      this.inventoryService.get(Number(this.inventoryId)).subscribe((data: any) => {
        console.log(data.inventoryItem);
        this.loadData(data);
      },
      error => {
        console.log(error);
      },
      () => {
        this.spinnerService.hide(); 
      });
    }
    
    this.spinnerService.hide(); 
  }

  loadDropdowns() {
    this.itemList = JSON.parse(sessionStorage.getItem("itemList"));
  }

  loadData(data: any) {
    this.frmInventory.patchValue({
      inventoryDescription: data.inventoryDescription,
      address: data.address
    });

    this.items = [];
    if(data.inventoryItem && data.inventoryItem.length > 0)
      data.inventoryItem.forEach(x => {
        this.items.push(Object.assign({} , x.itemList = this.itemList, x));
      });
  }

  onSave() {
    let inventory = { inventoryId: this.inventoryId,
                      active: true,
                      inventoryDescription: this.frmInventory.get('inventoryDescription').value,
                      address: this.frmInventory.get('address').value
               };

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token',
        'Access-Control-Allow-Origin': '*'
      })};
    
    console.log(inventory);
    let methodCall: any;

    this.spinnerService.show(); 
    if(Number(this.inventoryId) === 0) {
        methodCall = this.inventoryService.post(inventory);
    }
    else {
        methodCall = this.inventoryService.put(Number(this.inventoryId), inventory);
    }
        
    methodCall.subscribe((data: any) => {
        this.toastr.success('Record saved successfully', 'Success!');
        this.spinnerService.hide();
        this.router.navigate(['/inventory-list', this.pageNo]);
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
    this.router.navigate(['/inventory-list', this.pageNo]);
  }  
}

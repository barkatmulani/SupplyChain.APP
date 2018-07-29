import { Component } from '@angular/core';
import { ItemService, InventoryService, VendorService } from './services/common.services';
import { TextValuePair } from './shared.components/dropdown.component/TextValuePair';

@Component({
  selector: 'app-root',
  moduleId: module.id,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  title = 'Supply Chain Management System';

  constructor(private itemService: ItemService,
              private inventoryService: InventoryService,
              private vendorService: VendorService
            ) {

    /***** Item List *****/
    let itemList: any[] = [];

    if(!sessionStorage.getItem("itemList")) {
      this.itemService.getAll().subscribe(
      (data: any) => {
        data.map(x => {
          itemList.push(new TextValuePair(x.itemDescription, x.itemId));
        });
      },
      (error: any) => { console.log(error); },
      () => {
        sessionStorage.setItem("itemList", JSON.stringify(itemList));
      });
    }

    /***** Inventory List *****/
    let inventoryList = [];

    this.inventoryService.getAll().subscribe(
      (data: any) => { inventoryList = data },
      (error: any) => { console.log(error); },
        () => {
          sessionStorage.setItem("inventoryList", JSON.stringify(inventoryList));
        });

    /***** Vendor List *****/
    let vendorList = [];
    this.vendorService.getAll().subscribe(
      (data: any) => { vendorList = data },
      (error: any) => { console.log(error); },
        () => {
          sessionStorage.setItem("vendorList", JSON.stringify(vendorList));
        });
  }
}

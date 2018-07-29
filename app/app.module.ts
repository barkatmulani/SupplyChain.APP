import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule, Routes } from '@angular/router';
import { PaginationModule, PaginationConfig } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SharedModule } from './shared.module';
import { PipesModule } from './pipes.module';
import { RestangularModule } from 'ngx-restangular';
import { HeaderComponent } from './shared.components/header.component/header.component';

import { MainMenuComponent } from './app.components/mainmenu.component/mainmenu.component';
import { MainMenuContainerComponent } from './app.components/mainmenu-container.component/mainmenu-container.component';
import { ItemComponent } from './app.components/item.component/item.component';
import { ItemListComponent } from './app.components/item-list.component/item-list.component';
import { VendorComponent } from './app.components/vendor.component/vendor.component';
import { VendorListComponent } from './app.components/vendor-list.component/vendor-list.component';
import { InventoryListComponent } from './app.components/inventory-list.component/inventory-list.component';
import { InventoryComponent } from './app.components/inventory.component/inventory.component';
import { PurchaseOrderComponent } from './app.components/purchaseorder.component/purchaseorder.component';
import { PurchaseOrderListComponent } from './app.components/purchaseorder-list.component/purchaseorder-list.component';
import { ApiService } from './services/api.service';
import { ItemService, InventoryService, VendorService, PurchaseOrderService, ReceiptService, PurchaseOrderItemService } from './services/common.services';
import { HomePageComponent } from './app.components/homepage.component/homepage.component';
import { ReceiptListComponent } from './app.components/receipt-list.component/receipt-list.component';
import { ReceiptComponent } from './app.components/receipt.component/receipt.component';

const appRoutes: Routes = [

  /***** Inventory *****/
  { path: 'inventory-list/:pageNo', component: InventoryListComponent },
  { path: 'inventory-list', component: InventoryListComponent },
  { path: 'inventory/:id/:pageNo', component: InventoryComponent },
  { path: 'inventory/:id', component: InventoryComponent },
  { path: 'inventory', component: InventoryComponent },
  
  /***** Item *****/
  { path: 'item-list/:pageNo', component: ItemListComponent },
  { path: 'item-list', component: ItemListComponent },
  { path: 'item/:id/:pageNo', component: ItemComponent },
  { path: 'item/:id', component: ItemComponent },
  { path: 'item', component: ItemComponent },

  /***** Vendor *****/
  { path: 'vendor-list/:pageNo', component: VendorListComponent },
  { path: 'vendor-list', component: VendorListComponent },
  { path: 'vendor/:id/:pageNo', component: VendorComponent },
  { path: 'vendor/:id', component: VendorComponent },
  { path: 'vendor', component: VendorComponent },

  /***** Purchase Order *****/
  { path: 'purchaseorder-list/:pageNo', component: PurchaseOrderListComponent, data: { mode: 'L' } },
  { path: 'purchaseorder-list', component: PurchaseOrderListComponent, data: { mode: 'L' } },
  { path: 'purchaseorder/:id/:pageNo', component: PurchaseOrderComponent },
  { path: 'purchaseorder/:id', component: PurchaseOrderComponent },
  { path: 'purchaseorder', component: PurchaseOrderComponent },
  
  /***** Post Purchase Order *****/
  { path: 'purchaseorder-post/:pageNo', component: PurchaseOrderListComponent, data: { mode: 'P' } },
  { path: 'purchaseorder-post', component: PurchaseOrderListComponent, data: { mode: 'P' } },
  { path: 'purchaseorder/:id/:pageNo', component: PurchaseOrderComponent },
  { path: 'purchaseorder/:id', component: PurchaseOrderComponent },
  { path: 'purchaseorder', component: PurchaseOrderComponent },

    /***** Inventory Receipt *****/
    { path: 'receipt-list/:pageNo', component: ReceiptListComponent, data: { mode: 'L' } },
    { path: 'receipt-list', component: ReceiptListComponent, data: { mode: 'L' } },
    { path: 'receipt/:id/:pageNo', component: ReceiptComponent },
    { path: 'receipt/:id', component: ReceiptComponent },
    { path: 'receipt', component: ReceiptComponent },
    
    /***** Post Inventory Receipt *****/
    { path: 'receipt-post/:pageNo', component: ReceiptListComponent, data: { mode: 'P' } },
    { path: 'receipt-post', component: ReceiptListComponent, data: { mode: 'P' } },
    { path: 'receipt/:id/:pageNo', component: ReceiptComponent },
    { path: 'receipt/:id', component: ReceiptComponent },
    { path: 'receipt', component: ReceiptComponent },
  
    { path: '**', component: HomePageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    MainMenuContainerComponent,
    HomePageComponent,
    HeaderComponent,
    InventoryComponent,
    InventoryListComponent,
    ItemComponent,
    ItemListComponent,
    VendorComponent,
    VendorListComponent,
    PurchaseOrderComponent,
    PurchaseOrderListComponent,
    ReceiptComponent,
    ReceiptListComponent
  ],
  imports: [
    FormsModule,
    PaginationModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SharedModule,
    PipesModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }, // <-- debugging purposes only
    ),
    Ng4LoadingSpinnerModule.forRoot()
    // RestangularModule.forRoot((RestangularProvider) => {
    //   RestangularProvider.setBaseUrl(Global.dbUrl + 'SCMS/api');
    //   RestangularProvider.setDefaultHeaders({'Authorization': 'Bearer UDXPx-Xko0w4BRKajozCVy20X11MRZs1'});
    // })
  ],
  providers: [{provide: PaginationConfig, useValue: { boundaryLinks: true,
              firstText: 'First', previousText: '&lsaquo;', nextText: '&rsaquo;',
              lastText: 'Last', maxSize: 1 }},
              ItemService,
              InventoryService,
              VendorService,
              PurchaseOrderService,
              PurchaseOrderItemService,
              ReceiptService
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }

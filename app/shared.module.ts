import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-modal';
 
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TableComponent } from './shared.components/datatable/table.component';
import { NgTableComponent } from './shared.components/datatable/table/ng-table.component';
import { NgTableRowDetailComponent } from './shared.components/datatable/table/ng-table-rowdetail.component';
import { NgTableImageLinkComponent } from './shared.components/datatable/table/ng-table-imagelink.component';
import { NgTableFilteringDirective } from './shared.components/datatable/table/ng-table-filtering.directive';
import { NgTablePagingDirective } from './shared.components/datatable/table/ng-table-paging.directive';
import { NgTableSortingDirective } from './shared.components/datatable/table/ng-table-sorting.directive';
//import { InfoPopupComponent } from './shared.components/infopopup.component/infopopup.component';
import { DropdownComponent } from './shared.components/dropdown.component/dropdown.component';
import { ItemsPerPageSelectorComponent } from './shared.components/datatable/itemsPerPageSelector/itemsPerPageSelector';
import { PipesModule } from './pipes.module';
import { ConfirmationComponent } from './shared.components/confirmation.component/confirmation.component';
import { NgSelectModule, NG_SELECT_DEFAULT_CONFIG } from '@ng-select/ng-select';
import { DialogComponent } from './shared.components/dialog/dialog.component';

@NgModule({
    imports: [
        PaginationModule.forRoot(),
        BrowserModule,
        FormsModule,
        PipesModule,
        BrowserModule,
        ModalModule,
        NgSelectModule
    ],
    declarations: [
        TableComponent,
        NgTableComponent,
        NgTableRowDetailComponent,
        NgTableImageLinkComponent,
        NgTableFilteringDirective,
        NgTablePagingDirective,
        NgTableSortingDirective,
        //InfoPopupComponent,
        DropdownComponent,
        ItemsPerPageSelectorComponent,
        ConfirmationComponent,
        DialogComponent
    ],
    exports: [
        TableComponent,
        NgTableComponent,
        NgTableRowDetailComponent,
        NgTableImageLinkComponent,
        NgTableFilteringDirective,
        NgTablePagingDirective,
        NgTableSortingDirective,
        //InfoPopupComponent,
        DropdownComponent,
        ConfirmationComponent,
        NgSelectModule,
        DialogComponent
    ]
})
export class SharedModule {
}

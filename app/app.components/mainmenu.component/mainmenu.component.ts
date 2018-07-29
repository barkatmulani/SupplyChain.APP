import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/common.services';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'mainmenu',
  templateUrl: './mainmenu.component.html'
})
export class MainMenuComponent implements OnInit {
  itemList: any[] = [];

  constructor(private itemService: ItemService,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    // this.itemService.getAll().subscribe(
    //   (data: any) => { this.itemList = data; },
    //   (error: any) => { console.log(error); },
    //   () => { console.log(this.itemList); this.spinnerService.hide(); });
  }
}

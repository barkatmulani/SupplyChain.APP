import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/common.services';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'mainmenu-container',
  moduleId: module.id,
  templateUrl: 'mainmenu-container.component.html'
})
export class MainMenuContainerComponent {
  itemList: any[] = [];

  constructor() { }
}

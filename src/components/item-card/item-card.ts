import { Component, Input } from '@angular/core';


@Component({
  selector: 'item-card',
  templateUrl: 'item-card.html'
})
export class ItemCardComponent {

  @Input() icon: string;
  @Input() iconColor: string;
  @Input() description: string;
  @Input() subtitle: string;
  @Input() secSubtitle: string;
  @Input() subtitleClass: string;
  @Input() btns: any[];

  constructor() {
    
  }

}

import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-no-item-card',
  templateUrl: './no-item-card.component.html',
  styleUrl: './no-item-card.component.scss'
})
export class NoItemCardComponent {

  @Input() showIcon: boolean = true;
  @Input() customIcon: string = 'bi bi-emoji-frown-fill'
  @Input() customText: string = '';


}

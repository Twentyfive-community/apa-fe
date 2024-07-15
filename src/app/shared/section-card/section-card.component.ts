import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-section-card',
  templateUrl: './section-card.component.html',
  styleUrls: ['./section-card.component.scss']
})
export class SectionCardComponent implements OnInit, OnDestroy {
  @Input() menuItem: any;
  @Input() title: string = '';
  @Input() icon: string = 'bi bi-list-ul';
  @Input() backgroundCardColor: string = '#FFF';
  @Input() iconColor: string = '#252525';
  @Input() fontSizeIcon: string = '2.5rem';
  @Input() titleColor: string = '#252525';
  @Input() disabledCard: boolean = false;
  @Input() showMenu: boolean = true;
  @Input() actions: any = [];

  @Output() cardClicked = new EventEmitter<any>();

  dropdownOpen = false;

  onCardClicked($event: any) {
    this.cardClicked.emit();
  }

  toggleDropdown(event: Event) {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.dropdownOpen) return;
    this.dropdownOpen = false;
  }

  ngOnInit() {
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }
}

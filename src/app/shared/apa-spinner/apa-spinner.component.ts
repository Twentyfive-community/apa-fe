import {Component, OnChanges} from '@angular/core';

@Component({
  selector: 'apa-spinner',
  templateUrl: './apa-spinner.component.html',
  styleUrl: './apa-spinner.component.scss'
})
export class ApaSpinnerComponent implements OnChanges{
  ngOnChanges() {
      const spinnerElement = document.querySelector('.spinner-overlay');
      if (spinnerElement) {
        setTimeout(() => {
          spinnerElement.classList.add('hidden');
        }, 2000); // Spinner will fade away after 2 seconds
      }
  }

}

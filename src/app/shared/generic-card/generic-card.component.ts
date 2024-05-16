import {Component, Input, OnInit} from '@angular/core';
import {Allergen} from "../../models/Allergen";

@Component({
  selector: 'app-generic-card',
  templateUrl: './generic-card.component.html',
  styleUrl: './generic-card.component.scss'
})
export class GenericCardComponent implements OnInit{

  @Input()
  title: string

  @Input()
  ingredientList?: string[]

  @Input()
  imageUrl?: string

  @Input()
  allergens: Allergen[]

  @Input()
  description?: string

  @Input()
  price: string;

  // Proprietà per mantenere la lista di ingredienti troncata
  displayedIngredients?: string;

  ngOnInit(): void {
    // Se la lista ingredienti ha più di 3 elementi, la tronchiamo e aggiungiamo i tre puntini
    this.displayedIngredients = this.ingredientList && this.ingredientList.length > 3 ?
      this.ingredientList.slice(0, 3).join(', ') + '...' :
      this.ingredientList?.join(', ');
  }

}

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


  ngOnInit(): void {

  }

}

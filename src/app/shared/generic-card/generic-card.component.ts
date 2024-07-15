import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Allergen } from "../../models/Allergen";

@Component({
  selector: 'app-generic-card',
  templateUrl: './generic-card.component.html',
  styleUrls: ['./generic-card.component.scss']
})
export class GenericCardComponent implements OnInit {

  @Input() title: string;
  @Input() ingredientList?: string[];
  @Input() imageUrl?: string;
  @Input() imageLeft?: boolean;
  @Input() quantity?: number;
  @Input() weight?: number;
  @Input() currentWeight?: number;
  @Input() totalWeight?: number;
  @Output() resultChange = new EventEmitter<number>();
  @Input() allergens: Allergen[];
  @Input() description?: string;
  @Input() price: string;

  private currentQuantity: number | undefined;

  noContent ='https://static.vecteezy.com/system/resources/previews/007/071/476/non_2x/hand-drawn-doodle-missing-puzzle-question-mark-icon-illustration-isolated-vector.jpg';
  ngOnInit(): void {
    this.currentQuantity = this.quantity;
  }

  increaseQuantity() {
    if ((this.quantity! + 1) * this.weight! <= this.totalWeight!) {
      this.quantity!++;
      this.emitQuantity();
      this.currentQuantity = this.quantity;
    }
  }

  decreaseQuantity() {
    if (this.quantity! > 0) {
      this.quantity!--;
      this.emitQuantity();
      this.currentQuantity = this.quantity;
    }
  }

  onQuantityChange(event: any) {
    // Calcoliamo il peso totale con la nuova quantità
    const newWeight = (this.quantity! + event) * this.weight!;
    // Se il nuovo peso totale supera totalWeight, ripristina la quantità
    if (newWeight > this.totalWeight!) {
      this.quantity = this.currentQuantity;
      this.emitQuantity();
    } else {
      this.emitQuantity();
      this.currentQuantity = this.quantity;
    }
  }

  emitQuantity() {
    this.resultChange.emit(this.quantity!);
  }

  calculateMaxQuantity(): number {
    return Math.floor((this.totalWeight! - this.currentWeight!) / this.weight!);
  }
}

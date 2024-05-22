import {Allergen} from "./Allergen";
import {Measure} from "./Measure";

export class ProductKg {
  id: string;
  name: string;
  allergens: Allergen[];
  ingredients: string[];
  pricePerKg: string;
  imageUrl: string;
  active: boolean;
}
export class ProductWeighted {
  id: string;
  name: string;
  allergens: Allergen[];
  ingredients: string[];
  weight: string;
  imageUrl: string;
  active: boolean;
}
export class ProductToEdit {
  id: string;
  name: string;
  ingredientIds: string[];
  description: string;
  categoryId: string | null;
  imageUrl: string;
  active: boolean;
  weight: number;
  pricePerKg: number;
  weightRange:WeightRange = new WeightRange();
  customized: boolean;
  measures: Measure[] = []
}
export class Tray {
  id: string;
  name: string;
  personalized: boolean;
  measures: string;
  description: string;
  active: boolean;
  pricePerKg: number;
}
export class TrayDetails {
  id: string;
  name: string;
  customized:boolean;
  personalized: boolean;
  measures: string;
  measuresList: Measure[] =[]
  description: string;
  pricePerKg: number;
}
export class ProductWeightedDetails{
  id:string;
  name:string;
  allergens:Allergen[];
  ingredients:string[];
  weight:string;
  imageUrl:string[];
  active:boolean;
}
export class ProductDetails {

  id:string;
  name:string;
  allergens:Allergen[];
  ingredients:string[];
  pricePerKg:string;
  weight:string;
  imageUrl:string;
  active:boolean;
  description:string;
  weightRange:WeightRange = new WeightRange();
  customized: boolean;
}

export class ProductInPurchase {
  id: string;
  name: string;
  weight: number;
  quantity: number;
  shape: string;
  customization: Map<string, string>;
  chocolateChips: boolean;
  text: string;
  attachment: string;
  deliveryDate: string;
  totalPrice: number;
}
export class WeightRange {
  minWeight:number;
  maxWeight:number;
}

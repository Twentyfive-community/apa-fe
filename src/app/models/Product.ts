import {Allergen} from "./Allergen";

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
export class ProductWeightedToEdit {
  id: string;
  name: string;
  ingredientIds: string[];
  description: string;
  categoryId: string | null;
  imageUrl: string;
  active: boolean;
  weight: number;
  price: number;
}
export class Tray {
  id: string;
  name: string;
  customized: boolean;
  measures: string;
  description: string;
  active: boolean;
  pricePerKg: number;
}
export class TrayDetails {
  id: string;
  name: string;
  customized: boolean;
  measures: string;
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
  imageUrl:string[];
  active:boolean;
}

export class ProductInPurchase {
  productId: string;
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

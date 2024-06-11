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
  realWeight: number;
  weight: string;
  imageUrl: string;
  active: boolean;
  quantity:number;
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
  stats: ProductStat
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
  imageUrl: string;
}
export class TrayDetails {
  id: string;
  name: string;
  customized:boolean;
  stats:ProductStat;
  personalized: string;
  measures: string;
  measuresList: Measure[] =[]
  description: string;
  imageUrl: string;
  pricePerKg: number
}
export class ProductWeightedDetails{
  id:string;
  name:string;
  allergens:Allergen[];
  ingredients:string[];
  stats:ProductStat;
  weight:string;
  imageUrl:string[];
  active:boolean;
  quantity:number;
}
export class ProductDetails {

  id:string;
  name:string;
  allergens:Allergen[];
  ingredients:string[];
  pricePerKg:string;
  stats:ProductStat;
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
  customization: any;
  chocolateChips: boolean;
  notes: string;
  attachment: string;
  deliveryDate: string;
  totalPrice: number;
}

export class WeightRange {
  minWeight:number;
  maxWeight:number;
}

export class ProductStat {
  id: string;
  type: string;
  buyingCount: number;
}

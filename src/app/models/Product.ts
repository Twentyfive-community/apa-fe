import {Allergen} from "./Allergen";
import {Measure} from "./Measure";

export class ProductKg {
  id: string;
  name: string;
  description: string;
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
  quantity: number;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.allergens = data.allergens;
    this.ingredients = data.ingredients;
    this.realWeight = data.realWeight;
    this.weight = data.weight;
    this.imageUrl = data.imageUrl;
    this.active = data.active;
    this.quantity = 0;
  }
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
  price: number;
  allergenNames: string[]=[];
  stats: ProductStat;
  pricePerKg: number;
  weightRange:WeightRange = new WeightRange();
  customized: boolean;
  measures: Measure[] = [];
}
export class Tray {
  id: string;
  name: string;
  personalized: boolean;
  allergens: Allergen[];
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
  ingredients: any;
  customization: Customization[] =[];
  notes: string;
  attachment: string;
  location: string;
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

export class Customization {
  name: string;
  value: string[] = [];

  constructor(name:string, value:string[]) {
    this.name = name;
    this.value = value;
  }
}

import {Measure} from "./Measure";

export class Bundle {
  id: string;
  name: string;
  type: string;
  measures: Measure[];
  description: string;
  imageUrl: string;
  pricePerKg: number;
}

export class BundleInPurchase {
  id: string;
  name: string;
  measure: Measure;
  totalWeight: number;
  quantity: number = 1;
  totalPrice: number;
  weightedProducts:PieceInPurchase[] = [];
}

export class BundleInPurchaseDetails{
  id: string;
  name: string;
  measure: Measure;
  totalWeight: number;
  quantity: number = 1;
  location: string;
  totalPrice: number;
  weightedProducts:PieceInPurchaseDetails[] = [];
}
export class PieceInPurchaseDetails{
  id: string;
  name: string;
  weight: number;
  quantity: number;
}
export class PieceInPurchase {
  id: string;
  quantity: number;

  constructor(id:string, quantity:number){
    this.id=id;
    this.quantity=quantity;
  }
}

import {Measure} from "./Measure";

export class Bundle {
  id: string;
  name: string;
  type: string;
  measures: any[];
  description: string;
  imageUrl: string;
  pricePerKg: number;
}

export class BundleInPurchase {
  name: string;
  measure: Measure;
  id: string;
  quantity: number;
  totalPrice: number;
}

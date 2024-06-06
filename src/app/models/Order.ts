import {BundleInPurchase, BundleInPurchaseDetails} from "./Bundle";
import {ProductInPurchase} from "./Product";

export class Order {
  id: string;
  firstName: string;
  lastName: string;
  // pickupDate: string;
  // pickupTime: string;
  price: number;
  status: string;
  formattedPickupDate: string;
}

export class OrderDetails {
  id: string;
  products: ProductInPurchase[]=[];
  bundles: BundleInPurchaseDetails[]=[];
  note: string;
  email: string;
  phoneNumber: string;
  pickupDateTime: string;
  totalPrice: number;
  formattedPickupDate: string;
  status: string;
}

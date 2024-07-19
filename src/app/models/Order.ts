import {BundleInPurchaseDetails} from "./Bundle";
import {ProductInPurchase} from "./Product";

export class Order {
  id: string;
  firstName: string;
  lastName: string;
  price: number;
  status: string;
  formattedPickupDate: string;
  unread: boolean;
  methodPayment: string;
}

export class OrderDetails {
  id: string;
  products: ProductInPurchase[]=[];
  bundles: BundleInPurchaseDetails[]=[];
  customerNote: string;
  orderNote: string;
  email: string;
  phoneNumber: string;
  pickupDateTime: string;
  totalPrice: number;
  formattedPickupDate: string;
  status: string;
  paymentId: string
}

export class OrderRedoReq {
  id: string;
  pickupDate: any;
  pickupTime: any;
  note: string;
}

export class LocationReq {
  orderId: string;
  position: number;
  location: string;
}

import {environment} from "../../environments/environment";
import {BuyInfos} from "./Cart";

export class PaymentReq{
  simpleOrderRequest:SimpleOrderRequest = new SimpleOrderRequest();
  buyInfos:BuyInfos = new BuyInfos();

}
export class SimpleOrderRequest {
  currency: string = `${environment.currency}`;
  value: string;
  brandName: string = `${environment.realmname}`;
  cancelUrl: string = `${environment.cancelUrl}`;
  returnUrl: string = `${environment.returnUrl}`;
  items: ItemPayment[] = [];
}

export class ItemPayment {
  name: string;
  description: string;
  quantity: string;
  unit_amount: UnitAmount;
  orderData: any; //FIXME dati dell'oggetto comprato. Da valutare cosa mettere
  toBuy: boolean = true;
}

export class UnitAmount {
  currency_code: string = `${environment.currency}`;
  value: string;
}

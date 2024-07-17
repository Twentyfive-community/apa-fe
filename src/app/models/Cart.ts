import {Measure} from "./Measure";
import {PieceInPurchaseDetails} from "./Bundle";
import {Customization} from "./Product";
import {Allergen} from "./Allergen";

export class Cart {

  customerId: string;
  purchases: ItemInPurchase[] = [];
  totalPrice: number;

}

export class BuyInfos {
  positions: number[];
  selectedPickupDateTime: string;
  note: string;
  customInfo: CustomInfo = new CustomInfo();
  paymentId: string;
}


export class CustomInfo {
  firstName: string;
  lastName: string;
  email: string;
  note: string;
  phoneNumber: string;
}
export class ItemInPurchase {
  id: string; //generico

  name: string;
  imageUrl: string;
  price: string;

  allergens: Allergen[];
  quantity: number; //generico
  totalPrice: number; //generico
  notes: string; //generico

  measure: Measure; //Solo vassoi, range di misure
  totalWeight: number; //Solo vassoi, somma dei singoli pieces
  weightedProducts: PieceInPurchaseDetails[]; //Solo vassoi, singoli minion

  weight: number; //Solo torte, Il peso del prodotto
  shape: string; //Solo torte, forma del prodotto
  customization: Customization[] = [];//Solo torte, mappa delle personalizzazioni, la chiave è il tipo di personalizzazione
  attachment: string; // Solo torte, allegato dell'immagine sulla torta
  deliveryDate: string; // generico La data di consegna del prodotto, rappresentata come stringa (ISO 8601)

  toBuy: boolean = true;  // rappresenta la checkbox del carrello, se acquistare il prodotto o meno

}

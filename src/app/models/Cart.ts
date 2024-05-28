import {Measure} from "./Measure";
import {PieceInPurchaseDetails} from "./Bundle";

export class Cart {

  customerId: string;
  purchases: ItemInPurchase[] = [];
  totalPrice: number;

}

export class ItemInPurchase {
  id: string; //generico

  name: string;
  imageUrl: string;
  price: string;

  quantity: number; //generico
  totalPrice: number; //generico
  notes: string; //generico

  measure: Measure; //Solo vassoi, range di misure
  totalWeight: number; //Solo vassoi, somma dei singoli pieces
  weightedProducts: PieceInPurchaseDetails[]; //Solo vassoi, singoli minion

  weight: number; //Solo torte, Il peso del prodotto
  shape: string; //Solo torte, forma del prodotto
  customization: Map<string, string>; //Solo torte, mappa delle personalizzazioni, la chiave è il tipo di personalizzazione
  chocolateChips: boolean; // Un booleano per indicare se ci sono gocce di cioccolato o meno; NON NECESSARIO
  attachment: string; // Solo torte, allegato dell'immagine sulla torta
  deliveryDate: string; // generico La data di consegna del prodotto, rappresentata come stringa (ISO 8601)

  toBuy: boolean = true;  // rappresenta la checkbox del carrello, se acquistare il prodotto o meno

}

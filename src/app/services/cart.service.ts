import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Utils} from "../shared/utils/utils";
import {Customer} from "../models/Customer";
import {ProductInPurchase, ProductToEdit} from "../models/Product";
import {BundleInPurchase} from "../models/Bundle";
import {BuyInfos} from "../models/Cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseCartUrl: string = `${environment.backendUrl}/cart`;

  constructor(private http: HttpClient) {
  }

  get(id: string) {
    return this.http.get(`${this.baseCartUrl}/${id}`)
  }

  addToCartProductInPurchase(idCustomer: string, product: ProductInPurchase){
    return this.http.post(`${this.baseCartUrl}/add-to-cart/product/${idCustomer}`, product)
  }

  addToCartBundleInPurchase(idCustomer: string, bundle: BundleInPurchase){
    return this.http.post(`${this.baseCartUrl}/add-to-cart/bundle/${idCustomer}`, bundle)
  }

  removeFromCart(idCustomer: string, positions: number[]) {
    return this.http.post(`${this.baseCartUrl}/remove-from-cart/${idCustomer}`, positions);
  }

  obtainMinimumPickupDateTime(idCustomer: string, position: number[]) {
    return this.http.post(`${this.baseCartUrl}/pickup-dateTimes/${idCustomer}`, position);
  }

  buyFromCart(customerId: string,buyInfos:BuyInfos) {
    return this.http.post(`${this.baseCartUrl}/buy-from-cart/${customerId}`, buyInfos);
  }

  modifyPipInCart(customerId: string, index: number, pIP: any) {
    let p = Utils.createHttpParams({'index':index})
    return this.http.patch(`${this.baseCartUrl}/modify-pip-cart/${customerId}`, pIP, {params: p})
  }

  modifyBipInCart(customerId: string, index: number, bIP: any) {
    //ToDo AGGIUNGERE QUESTA FUNZIONE AL CART QUANDO SI MODIFICA LA QUANTITA DI UN BUNDLE
    let p = Utils.createHttpParams({'index':index})
    return this.http.patch(`${this.baseCartUrl}/modify-bip-cart/${customerId}`, bIP, {params: p})
  }







}

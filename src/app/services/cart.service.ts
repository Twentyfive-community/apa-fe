import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Utils} from "../shared/utils/utils";
import {Customer} from "../models/Customer";
import {ProductInPurchase, ProductToEdit} from "../models/Product";
import {BundleInPurchase} from "../models/Bundle";

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

  buyFromCart(customerId: string, positions: number[], selectedPickupDateTime: string, note: string) {
    let buyInfos = { positions, selectedPickupDateTime, note };
    return this.http.post(`${this.baseCartUrl}/buy-from-cart/${customerId}`, buyInfos);
  }

  modifyCart(customerId: string, index: number, iIP: any) {
    let p = Utils.createHttpParams({'index':index})
    return this.http.patch(`${this.baseCartUrl}/modify-cart/${customerId}`, iIP, {params: p})
  }

}

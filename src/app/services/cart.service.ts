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

  obtainMinimumPickupDateTime(idCustomer: string, positions: number[]) {
    return this.http.post<Map<string, string[]>>(`${this.baseCartUrl}/pickup-dateTimes/${idCustomer}`, positions);
  }

}

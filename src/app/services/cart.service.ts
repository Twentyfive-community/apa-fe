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
  private baseWeightedUrl: string = `${environment.backendUrl}/productsWeighted`;
  private baseTrayUrl: string = `${environment.backendUrl}/trays`;
  private uploadProPicUrl = `${environment.ftpUrl}/uploadkkk/`;

  constructor(private http: HttpClient) {
  }

  addToCartProductInPurchase(idCustomer: string, product: ProductInPurchase){
    return this.http.post(`${this.baseCartUrl}/add-to-cart/product/${idCustomer}`, product)
  }

  addToCartBundleInPurchase(idCustomer: string, bundle: BundleInPurchase){
    return this.http.post(`${this.baseCartUrl}/add-to-cart/bundle/${idCustomer}`, bundle)
  }

}

import {Component, OnInit} from '@angular/core';
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {Customer} from "../../../../models/Customer";
import {CustomerService} from "../../../../services/customer.service";
import {CartService} from "../../../../services/cart.service";
import {Cart} from "../../../../models/Cart";

@Component({
  selector: 'app-user-cart',
  templateUrl: './user-cart.component.html',
  styleUrl: './user-cart.component.scss'
})
export class UserCartComponent implements OnInit{

  customer: Customer =new Customer()
  cart: Cart = new Cart();
  itemToBuy: any[] = [];

  constructor(private keycloakService: SigningKeycloakService,
              private customerService:CustomerService,
              private cartService:CartService) {
  }

  ngOnInit(): void {
    this.getCustomer();
  }

  private getCustomer() {
    let keycloackService=(this.keycloakService)as any;
    let customerIdkc=keycloackService.keycloakService._userProfile.id;
    if(customerIdkc!=null){
      this.customerService.getCustomerByKeycloakId(customerIdkc).subscribe( (res:any) =>{
        this.customer = res
        this.getCart()
      })
    }
  }

  getCart() {
    this.cartService.get(this.customer.id).subscribe((res:any) =>{
      this.cart = res;
      console.log(this.cart);
      this.initializeItemsToBuy();

      console.log(this.itemToBuy);
    })
  }

  initializeItemsToBuy() {
    this.itemToBuy = this.cart.purchases.map((product, index) => {
      return { id: product.id, index, toBuy: true }; // Inizializziamo toBuy a true
    });
  }

  // obtainMinimumPickupDateTime() {
  //   this.cartService.obtainMinimumPickupDateTime(this.customer.id, [index]).subscribe(
  //     (minPickupDateTimes: any) => {
  //       // Aggiungi le date minime di ritiro alla lista listItemToBuy
  //       this.itemToBuy[index].minPickupDateTimes = minPickupDateTimes;
  //     },
  //     error => {
  //       console.error("Errore durante l'ottenimento delle date minime di ritiro:", error);
  //     }
  //   );
  // }

  toggleItemsToBuy(productId: string) {
    const productIndex = this.itemToBuy.findIndex(product => product.id === productId);
    console.log(productId)
    console.log(productIndex)
    if (productIndex !== -1) {
      // Cambiamo il valore di toBuy in base alla sua attuale condizione
      this.itemToBuy[productIndex].toBuy = !this.itemToBuy[productIndex].toBuy;
    } else {
      // Aggiungiamo il prodotto alla lista con toBuy impostato a true
      const product = this.cart.purchases.find(product => product.id === productId);
      if (product) {
        this.itemToBuy.push({ id: productId, index: 0, toBuy: true, name: product.name });
      }
    }
    console.log(this.itemToBuy)
    this.calculateTotalPrice(); // Ricalcoliamo il prezzo totale
  }

  removeFromCart(productId: string) {
    const productIndex = this.cart.purchases.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
      this.cartService.removeFromCart(this.customer.id, [productIndex]).subscribe(
        updatedCart => {
          this.getCart()
        })
    }
  }

  calculateTotalPrice() {
    this.cart.totalPrice = this.cart.purchases.reduce((sum, product) => {
      return product.toBuy ? sum + product.totalPrice : sum;
    }, 0);
    console.log(this.cart.totalPrice)
  }


  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
}

import {Component, OnInit} from '@angular/core';
import {ButtonSizeTheme, ButtonTheme, InputTheme, LabelTheme} from "twentyfive-style";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {Customer} from "../../../../models/Customer";
import {CustomerService} from "../../../../services/customer.service";
import {CartService} from "../../../../services/cart.service";
import {Cart} from "../../../../models/Cart";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-user-cart',
  templateUrl: './user-cart.component.html',
  styleUrl: './user-cart.component.scss'
})
export class UserCartComponent implements OnInit{

  customer: Customer =new Customer()
  cart: Cart = new Cart();
  itemToBuy: any[] = []; //lista che tiene traccia degli oggetti da comprare

  slot: any; //lista completa slot Giorno/Ora ricevuti dal DB
  enabledDate: NgbDate[] = [] //lista da mandare al datepicker

  // timePickerDisabled: boolean = true; //true fino a quando non si selziona un data nel Datepicker
  selectedSlots: string[] = []; //lista degli orari disponibili per il giorno scelto

  selectedDate: NgbDate | null = null; // Variabile per la data selezionata
  selectedTime: string = ''; // Variabile per l'orario selezionato
  selectedPickupDateTime: string = ''; // Variabile per la data e l'orario combinati

  orderNotes: string = '';

  constructor(private keycloakService: SigningKeycloakService,
              private customerService:CustomerService,
              private toastrService: ToastrService,
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
      this.obtainCartMinPickupDateTime()

      console.log(this.itemToBuy);
    })
  }

  initializeItemsToBuy() {
    this.itemToBuy = this.cart.purchases.map((product, index) => {
      return { id: product.id, index, toBuy: true }; // Inizializziamo toBuy a true
    });
  }

  obtainCartMinPickupDateTime() {

    const indexToBuy = this.itemToBuy
      .filter(item => item.toBuy)
      .map(item => item.index);
    // console.log(indexToBuy)

    this.cartService.obtainMinimumPickupDateTime(this.customer.id, indexToBuy).subscribe((res: any) => {
      this.slot = res
      this.enabledDate = Object.keys(this.slot).map(date => {
        const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
        return new NgbDate(year, month, day);
      });
      console.log(this.enabledDate)
    });
  }

  onDateChange(date: any): void {
    this.selectedDate = date;
    const formattedDate = this.formatDate(this.selectedDate)
    this.selectedSlots = this.slot[formattedDate]
    // this.timePickerDisabled = false
  }
  private formatDate(date: any): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  onTimeSelected(event: any) {
    this.selectedTime = event
    console.log("orario selezionato" + event)
  }

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
    this.obtainCartMinPickupDateTime()
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

  buyCart() {
    const indexToBuy = this.itemToBuy
      .filter(item => item.toBuy)
      .map(item => item.index);

    if (this.selectedDate && this.selectedTime) {
      this.selectedPickupDateTime = `${this.formatDate(this.selectedDate)}T${this.selectedTime}`;
      console.log("Data e orario selezionati: " + this.selectedPickupDateTime);

      this.cartService.buyFromCart(this.customer.id, indexToBuy, this.selectedPickupDateTime, this.orderNotes).subscribe({
        next: () => {
          this.toastrService.success('Ordine effettuato con successo')
        },
        error: (error) => {
          this.toastrService.error('Impossibile effettuare l\'ordine')
        },
        complete: () => {
          this.selectedDate = null;
          this.selectedTime = '';
          this.orderNotes = '';
          this.getCart()
        }
      })
    } else {
      this.toastrService.error('Selezionare una data e un orario valido')
    }


  }


  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
  protected readonly LabelTheme = LabelTheme;
  protected readonly InputTheme = InputTheme;
}

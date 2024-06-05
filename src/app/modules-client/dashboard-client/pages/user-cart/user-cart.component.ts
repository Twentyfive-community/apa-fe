import {Component, OnDestroy, OnInit} from '@angular/core';
import {ButtonSizeTheme, ButtonTheme, InputTheme, LabelTheme} from "twentyfive-style";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {Customer} from "../../../../models/Customer";
import {CustomerService} from "../../../../services/customer.service";
import {CartService} from "../../../../services/cart.service";
import {Cart} from "../../../../models/Cart";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {Subscription, interval, takeWhile} from "rxjs";
import {Router} from "@angular/router";
import {TwentyfiveModalService} from "twentyfive-modal";

@Component({
  selector: 'app-user-cart',
  templateUrl: './user-cart.component.html',
  styleUrl: './user-cart.component.scss'
})
export class UserCartComponent implements OnInit, OnDestroy{

  private imAdmin: false;

  customer: Customer =new Customer()
  cart: Cart = new Cart();
  itemToBuy: any[] = []; //lista che tiene traccia degli oggetti da comprare

  slot: any; //lista completa slot Giorno/Ora ricevuti dal DB
  enabledDate: NgbDate[] = [] //lista da mandare al datepicker

  // timePickerDisabled: boolean = true; //true fino a quando non si selziona un data nel Datepicker
  selectedSlots: string[] = []; //lista degli orari disponibili per il giorno scelto

  selectedDate: NgbDate | null = null; // Variabile per la data selezionata
  selectedTime! : any // Variabile per l'orario selezionato
  selectedPickupDateTime: string = ''; // Variabile per la data e l'orario combinati

  isCartLoaded: boolean = false; //ToDO: Sostituire con uno spinner

  isCollapsed: boolean = true;

  orderNotes: string = '';

  private cartReloadSubscription!: Subscription; //Variabile per avviare il reload di this.getCart

  constructor(private keycloakService: SigningKeycloakService,
              private modalService: TwentyfiveModalService,
              private customerService:CustomerService,
              private toastrService: ToastrService,
              private cartService:CartService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getCustomer();

    this.cartReloadSubscription = interval(30 * 60 * 1000) // 30 minuti in millisecondi
      .pipe(takeWhile(() => this.isCartLoaded))
      .subscribe(() => {
        this.getCart();
      });
  }

  ngOnDestroy(): void {
    // Annullare la sottoscrizione quando il componente viene distrutto
    if (this.cartReloadSubscription) {
      this.cartReloadSubscription.unsubscribe();
    }
  }

  toggleStickyBox() {
    this.isCollapsed = !this.isCollapsed;
  }

  private getCustomer() {
    let keycloackService=(this.keycloakService)as any;
    let customerIdkc=keycloackService.keycloakService._userProfile.id;
    if(customerIdkc!=null){
      this.customerService.getCustomerByKeycloakId(customerIdkc).subscribe((res:any) =>{
        this.customer = res
        this.getCart()
      })
    }
    this.imAdmin=keycloackService.loggedUserRoles().includes('admin');
  }

  getCart() {
    this.cartService.get(this.customer.id).subscribe((res:any) =>{
      this.cart = res;
      this.initializeItemsToBuy();
      this.obtainCartMinPickupDateTime()
      this.isCartLoaded = true;

      // console.log(this.cart)

      //console.log('item to buy')
      //console.log(this.itemToBuy);
    })
  }

  initializeItemsToBuy() {
    this.itemToBuy = this.cart.purchases.map((product, index) => {
      let type: string;
      if (product.name === 'Torta Personalizzata') {
        type = 'Torta Personalizzata';
      } else if (product.name === 'Vassoio Personalizzato') {
        type = 'Vassoio Personalizzato';
      } else if (product.measure) {
        type = 'tray';
      } else if (!product.customization) {
        type = 'productKg';
      } else {
        type = 'Altro';
      }
      return { id: product.id, index, toBuy: true, type:type };
    });
  }

  obtainCartMinPickupDateTime() {

    const indexToBuy = this.itemToBuy
      .filter(item => item.toBuy)
      .map(item => item.index);

    this.cartService.obtainMinimumPickupDateTime(this.customer.id, indexToBuy).subscribe((res: any) => {
      this.slot = res

      this.enabledDate = Object.keys(this.slot).map(date => {
        const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
        return new NgbDate(year, month, day);
      });
    });
  }

  onDateChange(date: any): void {
    this.selectedDate = date;
    const formattedDate = this.formatDate(this.selectedDate)
    this.selectedSlots = this.slot[formattedDate]
  }
  private formatDate(date: any): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  onTimeSelected(event: any) {
    this.selectedTime = event
  }

  toggleItemsToBuy(productId: string) {
    const productIndex = this.itemToBuy.findIndex(product => product.id === productId);

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
    //console.log(this.itemToBuy)
    this.obtainCartMinPickupDateTime()
    this.calculateTotalPrice();
  }

  removeFromCart(productId?: string) {
    if (productId) {
      const productIndex = this.cart.purchases.findIndex(product => product.id === productId);
      if (productIndex !== -1) {
        this.cartService.removeFromCart(this.customer.id, [productIndex]).subscribe(
          updatedCart => {
            this.getCart()
          })
      }
    } else {
      this.modalService.openModal (
        'Vuoi svuotare il carrello?',
        'Svuota carrello',
        'Annulla',
        'Conferma',
        {
          showIcon: true,
          size: 'md',
          onConfirm: (() => {
            const allProductIndexes = this.cart.purchases.map((product, index) => index);
            if (allProductIndexes.length > 0) {
              this.cartService.removeFromCart(this.customer.id, allProductIndexes).subscribe(
                updatedCart => {
                  this.getCart();
                })
            }
          })
        }
      );

    }
  }

  calculateTotalPrice() {
    this.cart.totalPrice = this.cart.purchases.reduce((sum, product) => {
      return product.toBuy ? sum + product.totalPrice : sum;
    }, 0);
    //console.log(this.cart.totalPrice)
  }

  buyCart() {
    if(this.imAdmin){
      this.router.navigate(['../dashboard']);
    }
    const indexToBuy = this.itemToBuy
      .filter(item => item.toBuy)
      .map(item => item.index);

    if (this.selectedDate && this.selectedTime) {
      this.selectedPickupDateTime = `${this.formatDate(this.selectedDate)}T${this.selectedTime}`;
      //console.log("Data e orario selezionati: " + this.selectedPickupDateTime);

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

  isBuyButtonDisabled(): boolean {
    // Return true if all items have toBuy set to false, otherwise false
    return !this.itemToBuy.some(item => item.toBuy);
  }

  calculatePriceAndObtainDate() {
    this.calculateTotalPrice();

    this.selectedDate = null;
    this.selectedTime = '';
    this.orderNotes = '';

    this.obtainCartMinPickupDateTime();
    this.onDateChange(this.selectedDate)
  }


  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
  protected readonly LabelTheme = LabelTheme;
  protected readonly InputTheme = InputTheme;
}

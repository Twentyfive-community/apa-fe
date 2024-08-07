import {Component, OnDestroy, OnInit} from '@angular/core';
import {ButtonSizeTheme, ButtonTheme, InputTheme, LabelTheme} from "twentyfive-style";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {Customer} from "../../../../models/Customer";
import {CustomerService} from "../../../../services/customer.service";
import {CartService} from "../../../../services/cart.service";
import {BuyInfos, Cart, ItemInPurchase} from "../../../../models/Cart";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {Subscription, interval, takeWhile, filter} from "rxjs";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {TwentyfiveModalService} from "twentyfive-modal";
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {CategoryEditComponent} from "../../../../shared/category-edit/category-edit.component";
import {AdminCustomBuyComponent} from "../admin-custom-buy/admin-custom-buy.component";
import {ItemPayment, PaymentReq, UnitAmount} from "../../../../models/PaymentReq";
import {cloneDeep} from "lodash";
import {PaymentService} from "../../../../services/payment.service";
import {UserCartCheckoutComponent} from "../user-cart-checkout/user-cart-checkout.component";

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
  paymentReq:PaymentReq = new PaymentReq();
  loading: boolean = true;

  isCollapsed: boolean = true;
  onlinePayment: boolean = false;

  buyInfos: BuyInfos = new BuyInfos();

  private cartReloadSubscription!: Subscription; //Variabile per avviare il reload di this.getCart

  constructor(private keycloakService: SigningKeycloakService,
              private modalService: TwentyfiveModalService,
              private genericModalService: TwentyfiveModalGenericComponentService,
              private customerService:CustomerService,
              private toastrService: ToastrService,
              private cartService:CartService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getCustomer();
    this.cartReloadSubscription = interval(30 * 60 * 1000) // 30 minuti in millisecondi
      .pipe(takeWhile(() => this.loading))
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
        this.confirmOrderAfterPayment();
      })
    }
    this.imAdmin=keycloackService.loggedUserRoles().includes('admin');
  }

  getCart() {
    this.cartService.get(this.customer.id).subscribe({
      next:(res:any) => {
        this.cart = res;
        this.initializeItemsToBuy();
        this.obtainCartMinPickupDateTime();
      },
      error:(error:any) => {
        console.error(error);
        this.loading = false;
      },
      complete:() => {
        this.loading = false;
      }
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
      } else  {
        type = 'productKg';
      }
      return { id: product.id, index, toBuy: true, type:type, quantity:product.quantity };
    });
  }

  obtainCartMinPickupDateTime() {

    const indexToBuy = this.itemToBuy
      .filter(item => item.toBuy)
      .map(item => item.index);

    this.cartService.obtainMinimumPickupDateTime(this.customer.id, indexToBuy).subscribe((res: any) => {
      if(res){
        this.slot = res
        this.enabledDate = Object.keys(this.slot).map(date => {
          const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
          return new NgbDate(year, month, day);
        });
      }
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
    //this.paymentReq.items.reduce()
  }

  buyCart() {
    //this.loading = true;
     this.buyInfos.positions = this.itemToBuy
      .filter(item => item.toBuy)
      .map(item => item.index);
    if (this.selectedDate && this.selectedTime) {
      this.buyInfos.selectedPickupDateTime = `${this.formatDate(this.selectedDate)}T${this.selectedTime}`;
      if(this.imAdmin) {
        let r = this.genericModalService.open(AdminCustomBuyComponent, "lg", {});
        r.componentInstance.customerId = this.customer.id;
        r.componentInstance.buyInfos = this.buyInfos;
        r.result.finally(() => {
          this.loading = false;
          })
      } else {
        // Apre modale scelta metodo pagamento
        let r = this.genericModalService.open(UserCartCheckoutComponent, "md", {})
        r.componentInstance.type = 'Payment';

        r.dismissed.subscribe((res) => {
          if (res.method === 'close') {
            return
          } else if (res.method === 'paypal') {
            this.paymentReq.buyInfos=this.buyInfos;
            this.cartService.prepareBuying(this.customer.id,this.paymentReq).subscribe((response:any)=>{
              window.location.href = response.content.links[1].href;
            })
            localStorage.setItem('buyInfos', JSON.stringify(this.buyInfos));
          } else {
            this.completeBuyFromCart();
          }
        });
      }
    }
  }

  // openCheckout() {
  //
  //   console.log('sono qui')
  //   if (this.onlinePayment){
  //     //TODO APRI MODALE CON SCELTA, SE PAGAMENTO ONLINE CONTINUARE CON QUI SOTTO SENNò VEDI ALTRO COMMENTO
  //     this.paymentReq.buyInfos=this.buyInfos;
  //     //TODO GESTIRE L'ERRORE CON LA MODALE (ERRORE NEL COMPRARE ONLINE O ROBA COSI)
  //     this.cartService.prepareBuying(this.customer.id,this.paymentReq).subscribe((response:any)=>{
  //       window.location.href = response.content.links[1].href;
  //     })
  //     localStorage.setItem('buyInfos', JSON.stringify(this.buyInfos));
  //   }
  //   else {
  //     this.completeBuyFromCart();
  //   }//TODO COMPRARE DIRETTAMENTE, THIS.COMPLETEBUYFROMCART
  // }

  completeBuyFromCart(paymentId?:string){
    if (paymentId){
      this.buyInfos.paymentId=paymentId;
    }
    this.cartService.buyFromCart(this.customer.id,this.buyInfos).subscribe({
      next: () => {
        this.toastrService.success('Ordine effettuato con successo')
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        this.toastrService.error('Impossibile effettuare l\'ordine')
      },
      complete: () => {
        this.isCollapsed = true
        this.selectedDate = null;
        this.selectedTime = '';
        this.buyInfos.note = '';
        this.loading = false;
        this.getCart()
      }
    })
  }
  isDisabled(from: string): boolean {
    switch (from) {
      case 'buy_button':
        return !this.itemToBuy.some(item => item.toBuy) || !this.selectedDate || !this.selectedTime;
      case 'datepicker':
        return !this.itemToBuy.some(item => item.toBuy);
      case 'textarea':
        return !this.itemToBuy.some(item => item.toBuy);
      default:
        return true;
    }
  }

  calculatePriceAndObtainDate() {
    this.calculateTotalPrice();
    //this.wrapOnlyItemsToBuy();
    this.selectedDate = null;
    this.selectedTime = '';
    this.buyInfos.note = '';
    this.obtainCartMinPickupDateTime();
    this.onDateChange(this.selectedDate)
  }

  confirmOrderAfterPayment(){
    const storedBuyInfos = localStorage.getItem('buyInfos');
    if (storedBuyInfos) {
      this.buyInfos = JSON.parse(storedBuyInfos);
      // Pulisce i dati del carrello salvati una volta che sono stati usati
      this.activatedRoute.queryParams.subscribe(params => {
        if (params['token']) {

          let r = this.genericModalService.open(UserCartCheckoutComponent, "md", {})
          r.componentInstance.type = 'Summary';
          r.componentInstance.id = this.customer.id
          r.componentInstance.buyInfos = this.buyInfos

          //TODO VEDERE SE FARE UN ULTERIORE CONFERMA, QUI SIAMO TORNATI DA PAYPAL!!
          // CONTINUARE DA QUI, TUTTO QUELLO QUI SOTTO DEVE PARTIRE AL RITORNO DELLA MODALE DI RIPEILOGO

          r.dismissed.subscribe(((res) => {
            if (res.method === 'close') {
              this.toastrService.error('L\'ordine è stato annullato!')
              return
            } else if (res.method === 'confirm') {
              this.cartService.capture(params['token']).subscribe({
                next:(res:any)=>{
                  let paymentId =res.content.purchaseUnits[0].payments.captures[0].id;
                  console.log(res);
                  this.completeBuyFromCart(paymentId);
                },
                error:(err:any)=>{
                  console.error(err);
                  this.toastrService.error("Pagamento annullato!");
                }
              })
              this.toastrService.success('Ordine effettuato con successo!')
            }
          }))

        }
      });
      localStorage.removeItem('buyInfos');
    }
  }
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
  protected readonly LabelTheme = LabelTheme;
  protected readonly InputTheme = InputTheme;
}

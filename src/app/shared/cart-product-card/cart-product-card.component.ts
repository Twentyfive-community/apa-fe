import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Cart, ItemInPurchase} from "../../models/Cart";
import {ProductService} from "../../services/product.service";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {TwentyfiveModalService} from "twentyfive-modal";
import {CartService} from "../../services/cart.service";
import {debounceTime, Observable, Subject, tap} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {switchMap} from "rxjs/operators";
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {CustomCakeComponent} from "../../modules-client/dashboard-client/pages/custom-cake/custom-cake.component";
import {
  TrayCustomizedComponent
} from "../../modules-client/dashboard-client/pages/tray-customized/tray-customized.component";
import {
  ProductDetailsComponent
} from "../../modules-client/dashboard-client/pages/product-details/product-details.component";

@Component({
  selector: 'app-cart-product-card',
  templateUrl: './cart-product-card.component.html',
  styleUrl: './cart-product-card.component.scss'
})
export class CartProductCardComponent implements OnInit{

  @Input() product: ItemInPurchase
  @Input() customerId: string;
  @Input() position: number[];
  @Input() type: string;
  @Output() selectionChange = new EventEmitter<string>();
  @Output() removeFromCart = new EventEmitter<string>();
  @Output() toBuyChange = new EventEmitter<string>();

  private quantityChange = new Subject<void>();

  minDate: any;
  minTime: any;

  constructor(private cartService: CartService,
              private toastrService: ToastrService,
              private productService: ProductService,
              private modalService: TwentyfiveModalService,
              private genericModalService: TwentyfiveModalGenericComponentService,)  {
    this.quantityChange.pipe(
      debounceTime(1000),
      switchMap(() => {
        return this.modifyCart(); // Esegue modifyCart e attende il completamento
      })
    ).subscribe(() => {
      this.obtainMinimumPickupDateTime(); // Una volta completato modifyCart, esegue obtainMinimumPickupDateTime
    });
  }
  // ToDo: AGGIUNGERE DEBOUNCER CHE RICARICA LA PAGINA OGNI 30min/1h

  ngOnInit() {
    this.getProduct();
    this.obtainMinimumPickupDateTime();
  }

  getProduct() {
    if(this.product.weightedProducts !== undefined) {
      this.productService.getByIdTray(this.product.id).subscribe((res:any) => {
        // console.log('vassoio')

        this.product.name = res.name;
        this.product.imageUrl = res.imageUrl;
        this.product.price = `€ ${res.pricePerKg.toFixed(2)}`;
        this.product.toBuy = true

        // console.log(this.product)
      })
    } else {
      this.productService.getByIdKg(this.product.id).subscribe((res:any) => {
        // console.log('torta')

        this.product.name = res.name;
        this.product.imageUrl = res.imageUrl;
        this.product.price = res.pricePerKg;
        this.product.toBuy = true

        // console.log(this.product)
      })
    }
  }

  obtainMinimumPickupDateTime() {
    // console.log(this.product.quantity)
    this.cartService.obtainMinimumPickupDateTime(this.customerId, this.position).subscribe((res: any) => {
      // console.log(res)
      const keys = Object.keys(res);
      if (keys.length > 0) {
        this.minDate = keys[0]; // La prima data è la minima
        this.minTime = res[this.minDate][0]; // Il primo orario della data minima è il più piccolo
        // console.log(this.position)
        // console.log(this.minDate + ' ' + this.minTime)
        this.product.deliveryDate = this.minDate
      }
    });
  }

  toggleSelection() {
    // console.log(this.product.toBuy)
    this.toBuyChange.emit(this.product.id);
  }

  increaseQuantity() {
    this.product.quantity++;
    // console.log('increaseQuantity > quantity ' + this.product.quantity)

    this.calcTotalPrice()
    this.quantityChange.next()
    // console.log('increaseQuantity > totalPrice ' + this.product.totalPrice);
  }

  decreaseQuantity() {
    if (this.product.quantity > 1) {
      this.product.quantity--;
      // console.log('decreaseQuantity > quantity ' + this.product.quantity)
      this.calcTotalPrice()
      this.quantityChange.next()


    } else if (this.product.quantity == 1) {
      this.modalService.openModal (
      'Vuoi togliere questo prodotto dal carrello?',
      'Elimina prodotto',
      'Annulla',
      'Conferma',
      {
        showIcon: true,
        size: 'md',
        onConfirm: (() => {
          this.removeFromCart.emit(this.product.id)
        })
      }
    );
    }
  }

  calcTotalPrice() {
    const priceWithoutEuro = this.product.price.replace(/[^\d.-]/g, '');
    const priceAsNumber = parseFloat(priceWithoutEuro);

    if (this.product.weightedProducts !== undefined && this.product.weightedProducts !== null) {
      // vassoio personalizzato
      this.product.totalPrice = (priceAsNumber * this.product.totalWeight) * this.product.quantity;
    } else if (this.product.weightedProducts === null) {
      // vassoio standard
      this.product.totalPrice = (priceAsNumber * this.product.measure.weight) * this.product.quantity;
    } else {
      //torte
      this.product.totalPrice = (priceAsNumber * this.product.weight) * this.product.quantity;
    }
    // this.selectionChange.emit()
    // console.log(this.product.totalPrice)
  }

  modifyCart(): Observable<any> {
    let index = this.position[0];
    if(this.type == 'productKg') {
      return this.cartService.modifyPipInCart(this.customerId, index, this.product).pipe(
        tap({
          next: () => {
            this.toastrService.success('Quantità modificata con successo');
          },
          error: (error) => {
            this.toastrService.error('Impossibile modificare quantità');
          },
          complete: () => {
            this.selectionChange.emit()
          }
        })
      );
    } else {
      return this.cartService.modifyBipInCart(this.customerId, index, this.product).pipe(
      tap({
        next: () => {
          this.toastrService.success('Quantità modificata con successo');
        },
        error: (error) => {
          this.toastrService.error('Impossibile modificare quantità');
        },
        complete: () => {
          this.selectionChange.emit()
        }
      })
    );

    }
  }

  goToEdit() {
    switch (this.type) {
      case 'Torta Personalizzata':
        this.toastrService.info('Torta Personalizzata')
        let customCakeModal = this.genericModalService.open(CustomCakeComponent, "md", {});
        customCakeModal.result.finally( () => {})
        break;
      case 'Vassoio Personalizzato':
        this.toastrService.info('Vassoio Personalizzato');
        let customTrayModal = this.genericModalService.open(TrayCustomizedComponent, "md", {});
        customTrayModal.result.finally( () => {})
        break;
      case 'tray':
      case 'productKg':
        let productKgModal = this.genericModalService.open(ProductDetailsComponent, "md", {});
        productKgModal.componentInstance.customer.id = this.customerId;
        productKgModal.componentInstance.fromEdit = true;
        productKgModal.componentInstance.productToEdit = this.product
        productKgModal.componentInstance.index = this.position[0]
        productKgModal.componentInstance.categoryType = this.type
        productKgModal.result.finally(() => {
          this.selectionChange.emit()
        })
        break;
    }
  }
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Cart, ItemInPurchase} from "../../models/Cart";
import {ProductService} from "../../services/product.service";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {TwentyfiveModalService} from "twentyfive-modal";
import {CartService} from "../../services/cart.service";
import {debounceTime, Observable, Subject, tap} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-cart-product-card',
  templateUrl: './cart-product-card.component.html',
  styleUrl: './cart-product-card.component.scss'
})
export class CartProductCardComponent implements OnInit{

  @Input() product: ItemInPurchase
  @Input() customerId: string;
  @Input() position: number[];
  @Output() selectionChange = new EventEmitter<string>();
  @Output() removeFromCart = new EventEmitter<string>();
  @Output() toBuyChange = new EventEmitter<string>();

  private quantityChange = new Subject<void>();

  minDate: any;
  minTime: any;

  constructor(private cartService: CartService,
              private toastrService: ToastrService,
              private productService: ProductService,
              private modalService: TwentyfiveModalService,)  {
    this.quantityChange.pipe(
      debounceTime(1000),
      switchMap(() => {
        return this.modifyCart(); // Esegue modifyCart e attende il completamento
      })
    ).subscribe(() => {
      this.obtainMinimumPickupDateTime(); // Una volta completato modifyCart, esegue obtainMinimumPickupDateTime
    });
  }

  ngOnInit() {
    this.getProduct();
    this.obtainMinimumPickupDateTime()
  }

  getProduct() {
    if(this.product.weightedProducts !== undefined) {
      this.productService.getByIdTray(this.product.id).subscribe((res:any) => {
        console.log('vassoio')

        this.product.name = res.name;
        this.product.imageUrl = res.imageUrl;
        this.product.price = `€ ${res.pricePerKg.toFixed(2)}`;
        this.product.toBuy = true

        console.log(this.product)
      })
    } else {
      this.productService.getByIdKg(this.product.id).subscribe((res:any) => {
        console.log('torta')

        this.product.name = res.name;
        this.product.imageUrl = res.imageUrl;
        this.product.price = res.pricePerKg;
        this.product.toBuy = true

        console.log(this.product)
      })
    }
  }

  obtainMinimumPickupDateTime() {
    console.log(this.product.quantity)
    this.cartService.obtainMinimumPickupDateTime(this.customerId, this.position).subscribe((res: any) => {
      console.log(res)
      const keys = Object.keys(res);
      if (keys.length > 0) {
        this.minDate = keys[0]; // La prima data è la minima
        this.minTime = res[this.minDate][0]; // Il primo orario della data minima è il più piccolo
        console.log(this.position)
        console.log(this.minDate + ' ' + this.minTime)
        this.product.deliveryDate = this.minDate
      }
    });
  }

  toggleSelection() {
    console.log(this.product.toBuy)
    this.toBuyChange.emit(this.product.id);
  }

  increaseQuantity() {
    this.product.quantity++;
    console.log('increaseQuantity > quantity ' + this.product.quantity)

    this.calcTotalPrice()
    this.quantityChange.next()
    console.log('increaseQuantity > totalPrice ' + this.product.totalPrice);
  }

  decreaseQuantity() {
    if (this.product.quantity > 1) {
      this.product.quantity--;
      console.log('decreaseQuantity > quantity ' + this.product.quantity)
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
    this.selectionChange.emit()
    console.log(this.product.totalPrice)
  }

  private modifyCart(): Observable<any> {
    let index = this.position[0];
    return this.cartService.modifyCart(this.customerId, index, this.product).pipe(
      tap({
        next: () => {
          this.toastrService.success('Quantità modificata con successo');
        },
        error: (error) => {
          this.toastrService.error('Impossibile modificare quantità');
        }
      })
    );
  }


  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
}

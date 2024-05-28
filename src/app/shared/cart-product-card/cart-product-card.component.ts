import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemInPurchase} from "../../models/Cart";
import {ProductService} from "../../services/product.service";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {TwentyfiveModalService} from "twentyfive-modal";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart-product-card',
  templateUrl: './cart-product-card.component.html',
  styleUrl: './cart-product-card.component.scss'
})
export class CartProductCardComponent implements OnInit{

  @Input() product: ItemInPurchase
  @Output() selectionChange = new EventEmitter<string>();
  @Output() removeFromCart = new EventEmitter<string>();
  @Output() toBuyChange = new EventEmitter<string>();



  private currentQuantity: number | undefined;


  constructor(private cartService: CartService,
              private productService: ProductService,
              private modalService: TwentyfiveModalService,
  ) {
  }

  ngOnInit() {
    this.getProduct();
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

  toggleSelection() {
    // this.product.toBuy = !this.product.toBuy;
    console.log(this.product.toBuy)
    this.toBuyChange.emit(this.product.id);
  }

  increaseQuantity() {
    this.product.quantity++;
    console.log('increaseQuantity > quantity ' + this.product.quantity)

    this.calcTotalPrice()
    console.log('increaseQuantity > totalPrice ' + this.product.totalPrice);
  }

  decreaseQuantity() {
    if (this.product.quantity > 1) {
      this.product.quantity--;
      console.log('decreaseQuantity > quantity ' + this.product.quantity)
      this.calcTotalPrice()

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
      this.product.totalPrice = (priceAsNumber) * this.product.weight * this.product.quantity;
    }
    console.log(this.product.totalPrice)
    this.selectionChange.emit(this.product.id);
  }

  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
}

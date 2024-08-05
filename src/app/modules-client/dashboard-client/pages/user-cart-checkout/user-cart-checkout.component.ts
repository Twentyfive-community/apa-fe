import {Component, OnInit} from '@angular/core';
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {BuyInfos} from "../../../../models/Cart";
import {CartService} from "../../../../services/cart.service";

@Component({
  selector: 'app-user-cart-checkout',
  templateUrl: './user-cart-checkout.component.html',
  styleUrl: './user-cart-checkout.component.scss'
})
export class UserCartCheckoutComponent implements OnInit {

  type: string;
  id: string;
  buyInfos: BuyInfos;
  summary:any; //ToDo, creare modello per il summary con nome, quantità, prezzo singolo e totale

  ngOnInit() {
    console.log(this.type)
    console.log(this.buyInfos)

    if(this.buyInfos) {
      this.getSummary()
      console.log(this.buyInfos)
    }
  }

  constructor(private cartService: CartService,
              private genericModalService: TwentyfiveModalGenericComponentService) {
  }

  paymentMethod(chosenMethod: string) {
    this.genericModalService.close({
      method: chosenMethod
    })
  }

  private getSummary() {
    this.cartService.getSummary(this.id,this.buyInfos).subscribe((res:any) => {
      console.log(res)
      this.summary = res;
    })
  }

  getTotalPrice(): number {
    return this.summary?.reduce((total: any, item: { price: any; }) => total + item.price, 0) || 0;
  }

  confirmPayment() {
    this.genericModalService.close({ method: 'confirm' });
  }

  close(){
    this.genericModalService.close(
      {
        method: 'close'
      }
    );
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;

}

import {Component, OnInit} from '@angular/core';
import {ButtonSizeTheme, ButtonTheme, InputTheme, LabelTheme} from "twentyfive-style";
import {BuyInfos} from "../../../../models/Cart";
import {CartService} from "../../../../services/cart.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";

@Component({
  selector: 'app-admin-custom-buy',
  templateUrl: './admin-custom-buy.component.html',
  styleUrl: './admin-custom-buy.component.scss'
})
export class AdminCustomBuyComponent implements OnInit{

  buyInfos: BuyInfos | null;
  customerId: string | null;

  ngOnInit(): void {
  }

  constructor(private cartService:CartService,
              private toastrService:ToastrService,
              private router: Router,
              private modalService: TwentyfiveModalGenericComponentService) {
  }

  onInputChange(event:any,type:string){
    switch(type){
      case 'firstName':
        this.buyInfos!.customInfo.firstName = event.target.value;
        break;
      case 'lastName':
        this.buyInfos!.customInfo.lastName = event.target.value;
        break;
      case 'email':
        this.buyInfos!.customInfo.email = event.target.value;
        break;
      case 'phoneNumber':
        this.buyInfos!.customInfo.phoneNumber = event.target.value;
        break;

    }
  }
  buyFromCart() {
    if(this.isValid()){
      this.cartService.buyFromCart(this.customerId!,this.buyInfos!).subscribe({
        next: () => {
          this.toastrService.success('Ordine effettuato con successo')
          this.close();
        },
        error: (error) => {
          console.error(error);
          this.toastrService.error('Impossibile effettuare l\'ordine')
        },
        complete: () => {
          this.router.navigate(["../dashboard"]);
        }
      })
    }
  };

  close(){
    this.modalService.close();
  }

  private isValid() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;

    if (!this.buyInfos?.customInfo.firstName) {
      this.toastrService.error("Inserire un nome per il cliente!");
      return false;
    }
    if (!this.buyInfos.customInfo.lastName) {
      this.toastrService.error("Inserire un cognome per il cliente!");
      return false;
    }
    if (!this.buyInfos.customInfo.email) {
      this.toastrService.error("Inserire un email per il cliente!");
      return false;
    } else if (!emailRegex.test(this.buyInfos.customInfo.email)) {
      this.toastrService.error("Inserire un email valida per il cliente!");
      return false;
    }
    if (!this.buyInfos.customInfo.phoneNumber) {
      this.toastrService.error("Inserire un numero di telefono per il cliente!");
      return false;
    } else if (!phoneNumberRegex.test(this.buyInfos.customInfo.phoneNumber)) {
      this.toastrService.error("Inserire un numero di telefono valido per il cliente!");
      return false;
    }
    return true;
  }

  protected readonly InputTheme = InputTheme;
  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;

}

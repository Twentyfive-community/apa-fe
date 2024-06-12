import { Component, OnInit } from '@angular/core';
import { ButtonSizeTheme, ButtonTheme } from "twentyfive-style";
import { ActivatedRoute, Router } from "@angular/router";


import { TwentyfiveModalService } from "twentyfive-modal";
import { ToastrService } from "ngx-toastr";
import {Customer} from "../../../../models/Customer";
import {CustomerService} from "../../../../services/customer.service";

@Component({
  selector: 'app-customer-edit',
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit{

  newCustomer : Customer = new Customer()
  originalCustomer: Customer = new Customer()
  customerIdkc: string = ''
  loading:boolean = true;
  constructor(private customerService: CustomerService,
              private router: Router,
              private modalService: TwentyfiveModalService,
              private toastrService: ToastrService,
              private activatedRouteService: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.customerIdkc=this.activatedRouteService.snapshot.paramMap.get('id')!;
    this.getCustomer();
  }

  close() {
    if(this.hasChanges()) {

      this.modalService.openModal(
        'Procedendo in questo modo si perderanno i dati inseriti. Continuare?',
        '',
        'Annulla',
        'Conferma',
        {
          size: 'md',
          onConfirm: (() => {
            this.router.navigate(['../catalogo/profilo']);
          })
        });
    }
    else{
      this.router.navigate(['../catalogo/profilo']);

    }
  }

  saveNewCustomer(){
    this.loading = true;
    this.customerService.saveCustomerClient(this.newCustomer.id,this.newCustomer.firstName,this.newCustomer.lastName,this.newCustomer.phoneNumber).subscribe({
      error:(error) =>{
        console.error(error);
        this.toastrService.error("Errore nel salvare il customer");
        this.loading = false;
      },
      complete:() =>{
        this.toastrService.success("modifiche salvate con successo");
        this.router.navigate(['../catalogo/profilo']);
        this.loading = false;
      }
    });
  }

  getCustomer(){
    if(this.customerIdkc!=null){
      this.customerService.getCustomerByKeycloakId(this.customerIdkc).subscribe( {
        next:(res:any) => {
          this.originalCustomer = res
          this.newCustomer= {...res}
        },
        error:(error) => {
          console.error(error);
          this.loading = false;
        },
        complete:() => {
          this.loading = false;
        }
      })
    }
  }

  hasChanges(){
    return this.newCustomer.firstName !=this.originalCustomer.firstName ||
      this.newCustomer.lastName !=this.originalCustomer.lastName ||
      this.newCustomer.phoneNumber !=this.originalCustomer.phoneNumber ;

  }

  onInputChange(event: any, type: string) {
    switch (type) {
      case 'name':
        this.newCustomer.firstName = event.target.value;
        break;
      case 'surname':
        this.newCustomer.lastName = event.target.value;
        break;
      case 'email':
        this.newCustomer.email = event.target.value;
        break;
      case 'phoneNumber':
        this.newCustomer.phoneNumber = event.target.value;
        break;
    }
  }

  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
}

import { Component, OnInit } from '@angular/core';
import {Customer, CustomerDetails} from "../../../../../models/Customer";
import {ButtonTheme} from "twentyfive-style";
import {CustomerService} from "../../../../../services/customer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss']
})
export class UserProfileEditComponent implements OnInit {
  customer: CustomerDetails = new CustomerDetails();
  customerId: string = '';

  constructor(private activeRoute:ActivatedRoute,private customerService:CustomerService, private router: Router,private toastrService:ToastrService) { }

  ngOnInit() {
    this.customerId=this.activeRoute.snapshot.paramMap.get('id')!;
    this.getCustomer();
  }

  onInputChange(event: any, type: string) {
    switch (type) {
      case 'name':
        this.customer.firstName = event.target.value;
        break;
      case 'surname':
        this.customer.lastName = event.target.value;
        break;
      case 'phoneNumber':
        this.customer.phoneNumber = event.target.value;
        break;
    }
  }

  saveNewCustomer(){

    this.customerService.saveCustomerClient(this.customer.id,this.customer.firstName,this.customer.lastName,this.customer.phoneNumber
    ).subscribe({
      error:(err) =>{

        console.log(err)
        this.toastrService.error("Errore durante il salvataggio dei dati");
      },
      complete:() =>{

        this.toastrService.success("Customer salvato con successo");
        this.router.navigate(['../catalogue/profile']);
      }
    });
  }


  goToDetails(event: any){
    // Salva i dettagli del cliente modificati
    console.log(this.customer);
  }

  getCustomer(){
    this.customerService.getCustomerByKeycloakId(this.customerId).subscribe((res:any) =>{
      this.customer=res;
    });
  }

  protected readonly ButtonTheme = ButtonTheme;
}

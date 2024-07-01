import {Component, OnInit} from '@angular/core';
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {CustomerService} from "../../../../services/customer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Customer} from "../../../../models/Customer";
import {TwentyfiveModalService} from "twentyfive-modal";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss'
})
export class CustomerEditComponent implements OnInit{

  navigationType: 'back' | 'save' | null = null;


  originalCustomer: Customer = new Customer()
  customer: Customer = new Customer()
  customerId: string | null;
  ngOnInit(): void {
    this.customerId=this.activatedRouteRoute.snapshot.paramMap.get('id');
    this.getCustomer();
  }

  constructor(private customerService: CustomerService,
              private router: Router,
              private modalService: TwentyfiveModalService,
              private toastrService: ToastrService,
              private activatedRouteRoute: ActivatedRoute) {
  }



  onInputChange(event: any, type: string) {
    switch (type) {
      case 'name':
        this.customer.firstName = event.target.value;
        break;
      case 'surname':
        this.customer.lastName = event.target.value;
        break;
      case 'email':
        this.customer.email = event.target.value;
        break;
      case 'phoneNumber':
        this.customer.phoneNumber = event.target.value;
        break;
      case 'note':
        this.customer.note = event.target.value;
        break;
    }
  }

  hasChanges(): boolean{
    return this.customer.firstName !== this.originalCustomer.firstName ||
      this.customer.lastName !== this.originalCustomer.lastName ||
      this.customer.email !== this.originalCustomer.email ||
      this.customer.phoneNumber !== this.originalCustomer.phoneNumber;
  }

  close() {
    this.navigationType="back"
    this.router.navigate(['../dashboard/clienti']);
  }

  saveNewCustomer(){
    this.navigationType="save"
    if (this.isValid()){
      this.customerService.saveCustomer(this.customer).subscribe({
        error:(error) =>{
          console.error(error);
          this.toastrService.error("dominio email inesistente!");
        },
        complete:() =>{
          this.toastrService.success("Customer salvato con successo");
          this.router.navigate(['../dashboard/clienti']);
        }
      });
    }
  }

  getCustomer(){
    if(this.customerId!=null){
      this.customerService.getCustomerDetails(this.customerId).subscribe( (res:any) =>{
        this.customer = res
        this.originalCustomer = { ...res };
        console.log(res);
        console.log(this.customer);
      })
    }
  }


  private isValid() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;

    if (!this.customer.firstName) {
      this.toastrService.error("Inserire un nome per il cliente!");
      return false;
    }
    if (!this.customer.lastName) {
      this.toastrService.error("Inserire un cognome per il cliente!");
      return false;
    }
    if (!this.customer.email) {
      this.toastrService.error("Inserire un email per il cliente!");
      return false;
    } else if (!emailRegex.test(this.customer.email)) {
      this.toastrService.error("Inserire un email valida per il cliente!");
      return false;
    }
    if (!this.customer.phoneNumber) {
      this.toastrService.error("Inserire un numero di telefono per il cliente!");
      return false;
    } else if (!phoneNumberRegex.test(this.customer.phoneNumber)) {
      this.toastrService.error("Inserire un numero di telefono valido per il cliente!");
      return false;
    }
    return true;
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;

  isNew():boolean {
    return this.customerId? true : false;
  }
}

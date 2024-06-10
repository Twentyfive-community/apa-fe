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
    this.customerService.saveCustomer(this.customer).subscribe({
      error:() =>{
        this.toastrService.error("Errore nel salvare il customer");
      },
      complete:() =>{
        this.toastrService.success("Customer salvato con successo");
        this.router.navigate(['../dashboard/clienti']);
      }
    });
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


  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;

}

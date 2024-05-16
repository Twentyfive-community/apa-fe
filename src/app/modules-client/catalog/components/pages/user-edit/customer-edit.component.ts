import { Component, OnInit } from '@angular/core';
import { ButtonSizeTheme, ButtonTheme } from "twentyfive-style";
import { ActivatedRoute, Router } from "@angular/router";


import { TwentyfiveModalService } from "twentyfive-modal";
import { ToastrService } from "ngx-toastr";
import {Customer} from "../../../../../models/Customer";
import {CustomerService} from "../../../../../services/customer.service";

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss'
})
export class CustomerEditComponent implements OnInit {

  customer: Customer = new Customer();
  originalCustomer: Customer = new Customer();  // Initialized with empty strings
  customerId: string | null;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private modalService: TwentyfiveModalService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.customerId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.customerId) {
      this.getCustomer();
    } else {
      // Ensure originalCustomer has the same structure as customer with empty strings
      this.initializeCustomer();
    }
  }

  initializeCustomer() {
    this.originalCustomer.firstName = '';
    this.originalCustomer.lastName = '';
    this.originalCustomer.email = '';
    this.originalCustomer.phoneNumber = '';

    this.customer.firstName = '';
    this.customer.lastName = '';
    this.customer.email = '';
    this.customer.phoneNumber = '';
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

  close() {
    if (this.hasChanges()) {
      this.modalService.openModal(
        'Procedendo in questo modo si perderanno i dati inseriti. Continuare?',
        '',
        'Annulla',
        'Conferma',
        {
          size: 'md',
          onConfirm: (() => {
            this.router.navigate(['../catalogue/profilo']);
          })
        });
    } else {
      this.router.navigate(['../catalogue/profilo']);
    }
  }

  saveNewCustomer() {
    this.customerService.saveCustomerClient(this.customer.id, this.customer.firstName, this.customer.lastName, this.customer.phoneNumber
    ).subscribe({
      error: (err) => {
        console.log(err)
        this.toastrService.error("Errore durante il salvataggio dei dati");
      },
      complete: () => {
        this.toastrService.success("Customer salvato con successo");
        this.router.navigate(['../catalogue/profilo']);
      }
    });
  }

  getCustomer() {
    if (this.customerId != null) {
      this.customerService.getCustomerByKeycloakId(this.customerId).subscribe((res: any) => {
        this.customer = res;
        this.originalCustomer = { ...res };  // Save a copy of the original customer data
      });
    }
  }

  hasChanges(): boolean {
    return this.customer.firstName !== this.originalCustomer.firstName ||
      this.customer.lastName !== this.originalCustomer.lastName ||
      this.customer.email !== this.originalCustomer.email ||
      this.customer.phoneNumber !== this.originalCustomer.phoneNumber;
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;

}

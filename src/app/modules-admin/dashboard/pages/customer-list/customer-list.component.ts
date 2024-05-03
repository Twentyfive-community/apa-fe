import {Component, OnInit} from '@angular/core';
import {ButtonSizeTheme, ButtonTheme, TableHeadTheme, TableTheme} from 'twentyfive-style';
import {Customer} from "../../../../models/Customer";
import {CustomerService} from "../../../../services/customer.service";
import {Router} from "@angular/router";
import {TwentyfiveModalService} from "twentyfive-modal";

@Component({
  selector: 'app-clienti',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit{
  protected readonly ButtonTheme = ButtonTheme
  protected readonly ButtonSizeTheme = ButtonSizeTheme
  protected readonly TableHeadTheme = TableHeadTheme
  protected readonly TableTheme = TableTheme


  maxSize: number = 2;
  pageSize: number = 20;


  headers: any[] = [
    { name:'Cognome', value:'lastName'},
    { name:'Nome',    value:'firstName'},
    { name:'Email',   value:'email'},
    { name:'Numero di telefono', value:'phoneNumber'},
    { name:'Status', value:'enabled'}

  ]

  customers: Customer[] = []

  tableActions: any[]=[
    {
      icon:'bi bi-pencil-square',
      action: async(event: any) =>{
        this.router.navigate(['/dashboard/editingClienti', event.id])
      },
      actionName:'Modifica',
      toolTipText:'Modifica',
      placement: 'top',
      showFunction: () => {
      }
    },
    {
      icon:'bi bi-person-x-fill',
      action:async (myRow: any) =>{
        this.modalService.openModal(
          'Sei sicuro di voler disabilitare questo cliente?',
          'Disabilita',
          'Annulla',
          'Conferma',
          {
            showIcon: true,
            size: 'md',
            onConfirm: (() => {
              this.changeStatus(myRow.id);
            })
          });
      },
      actionName: 'Disabilita',
      tooltipText: 'Disabilita',
      placement: 'top',
      showFunction: (myRow: any) => {
        return myRow.enabled==true;
      }
    },
    {
      icon:'bi bi-person-plus-fill',
      action:async (myRow: any) =>{
        this.modalService.openModal(
          'Sei sicuro di voler abilitare questo cliente?',
          'Abilita',
          'Annulla',
          'Conferma',
          {
            showIcon: true,
            size: 'md',
            onConfirm: (() => {
              this.changeStatus(myRow.id);
            })
          });
      },
      actionName: 'Abilita',
      tooltipText: 'Abilita',
      placement: 'top',
      showFunction: (myRow: any) => {
        return myRow.enabled==false;
      }
    }
  ]




  constructor(private customerService: CustomerService, private router: Router, private modalService: TwentyfiveModalService) {
  }

  ngOnInit(): void {
        this.getAll()
  }

  getAll(page?: number){
    this.customerService.getAll(page? page : 0, this.pageSize).subscribe((response: any) => {
        this.customers = response.content;
        this.maxSize = response.totalElements;
    })
  }

  goToDetails(event: any){
    this.router.navigate(['/dashboard/dettagliClienti', event.id])
  }

  changeStatus(id: string){
    this.customerService.changeStatusCustomer(id).subscribe({
      next: (() => {
        this.getAll();
      })
    });
  }



}

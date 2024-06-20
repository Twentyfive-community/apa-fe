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

  currentPage: number = 0;
  maxSize: number = 5;
  pageSize: number = 25;
  sortColumn: string='';
  sortDirection: string='';


  headers: any[] = [
    { name:'Cognome', value:'lastName'},
    { name:'Nome',    value:'firstName'},
    { name:'Email',   value:'email'},
    { name:'Numero di telefono', value:'phoneNumber'},
    { name:'Note', value:'note'}
  ]

  paginationElements: any[] = [
    {
      actionName: '25',
      value: '25'
    },
    {
      actionName: '50',
      value: '50'
    },
    {
      actionName: '100',
      value: '100'
    }
  ];

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
    }
  ]




  constructor(private customerService: CustomerService,
              private router: Router,
              private modalService: TwentyfiveModalService
  ) {
  }

  ngOnInit(): void {

    this.getAll();
  }

  getAll(page?: number){
    this.customerService.getAll(page? page : 0, this.pageSize, this.sortColumn, this.sortDirection).subscribe((response: any) => {
        this.customers = response.content;
        this.maxSize = response.totalElements;
    })
  }

  goToDetails(event: any){
    this.router.navigate(['/dashboard/dettagliClienti', event.id])
  }

  changeStatus(event: any){
    this.customerService.changeStatusCustomer(event.id).subscribe({
      next: (() => {
        this.getAll(this.currentPage);
      })
    });
  }

  selectSize(event: any){
    this.pageSize=event;
    this.getAll()
  }


  changePage(event: number){
    this.currentPage = event-1;
    this.getAll(this.currentPage);
  }

  sortingColumn(event: any){
    this.sortColumn = event.sortColumn;
    this.sortDirection = event.sortDirection;
    this.getAll()
  }



}

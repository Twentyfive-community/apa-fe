import {Component, OnInit} from '@angular/core';
import {Customer} from "../../../../models/Customer";
import {CustomerService} from "../../../../services/customer.service";
import {Router} from "@angular/router";
import {TwentyfiveModalService} from "twentyfive-modal";
import {ButtonSizeTheme, ButtonTheme, TableHeadTheme, TableTheme } from 'twentyfive-style';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit{

  currentPage: number = 0;
  maxSize: number = 5;
  pageSize: number = 25;
  sortColumn: string='';
  sortDirection: string='';


  headers: any[] = [
    { name:'Cognome', value:'lastName'},
    { name:'Nome', value:'firstName'},
    { name:'Email', value:'email'},
    { name:'Numero di telefono', value:'phoneNumber'},
    { name:'Ruolo', value:'role'}
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

  //ToDo: a fine v2 customer sarà User
  employees: Customer[] = []

  tableActions: any[]=[
    {
      icon:'bi bi-pencil-square',
      action: async(event: any) =>{
        this.router.navigate(['/dashboard/modifica-dipendente', event.id])
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
    this.customerService.getAllEmployees(page? page : 0, this.pageSize, this.sortColumn, this.sortDirection).subscribe((res: any) => {
      this.employees = res.content.map((employee: any) => new Customer(
        employee.id,
        employee.idKeycloak,
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.phoneNumber,
        employee.role,
        employee.note,
        employee.enabled
      ));
      this.maxSize = res.totalElements;
    })
  }

  goToDetails(event: any){
    //per ora non utilizzato
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

  protected readonly ButtonTheme = ButtonTheme
  protected readonly ButtonSizeTheme = ButtonSizeTheme
  protected readonly TableHeadTheme = TableHeadTheme
  protected readonly TableTheme = TableTheme
}

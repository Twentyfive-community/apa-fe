import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerService} from "../../../../services/customer.service";
import {ButtonTheme, TableHeadTheme, TableTheme} from "twentyfive-style";
import {CustomerDetails} from "../../../../models/Customer";
import {Order, OrderDetails} from "../../../../models/Order";
import {CompletedordersService} from "../../../../services/completedorders.service";
import {response} from "express";



@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent implements OnInit{

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private customerService: CustomerService,
              private completedOrderService: CompletedordersService
  ) {}

  id: string
  customer: CustomerDetails=new CustomerDetails()
  orderDetails: OrderDetails=new OrderDetails()

  maxSize: number = 5;
  pageSize: number = 5;
  currentPage: number=0;
  collectionSize: number = 5;

  headersTotals: any[] = [
    { name:'Totale Ordini', value:'completedOrdersCount'},
    { name:'Totale Speso',    value:'totalSpent'}
  ]

  headersOrders: any[] = [
    { name:'ID', value:'id'},
    { name:'Data Ritiro', value:'pickupDate'},
    { name:'Ora Ritiro', value:'pickupTime'},
    { name:'Prezzo', value:'price'}
  ]

  paginationElements: any[] = [
    {
      actionName: '5',
      value: '5'
    },
    {
      actionName: '10',
      value: '10'
    },
    {
      actionName: '25',
      value: '25'
    }
  ];

  details: CustomerDetails[] = []

  completedOrders: Order[] = []

  extras: any[] = [
    {name: '', value:''}
  ]

  dataDetails: any[] = [ new OrderDetails()]
  ngOnInit(): void{
    this.id= String (this.activatedRoute.snapshot.paramMap.get('id'))
    this.getCustomerDetails()
    this.getOrders()

  }

  getOrders(){
    this.completedOrderService.getCompletedOrdersById(this.currentPage, this.pageSize, this.id).subscribe((response: any) =>{
      this.completedOrders=response.content;
      this.collectionSize = response.totalElements;
    })
  }

  getOrderDetails($event: any){
    let orderId = $event.id;
    this.completedOrderService.getDetailsOrderById(orderId).subscribe((response: any) =>{
      this.orderDetails=response;
    })
  }

  getCustomerDetails(){
    this.customerService.getCustomerDetails(this.id).subscribe((response: any) =>{
      this.customer=response
      this.details.push(response)
    })
  }

  selectSize(event: any) {
    this.pageSize = event;
    this.getOrders();
  }

  changePage(event: number) {
    this.currentPage = event - 1;
    this.getOrders();
  }


  protected readonly ButtonTheme = ButtonTheme;
  protected readonly TableTheme = TableTheme;
  protected readonly TableHeadTheme = TableHeadTheme;
}

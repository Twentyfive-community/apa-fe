import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Order } from "../../../../models/Order";
import { CompletedorderService } from "../../../../services/completedorder.service";
import {ButtonTheme} from "twentyfive-style";
import {OrderService} from "../../../../services/order.service";

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.scss']
})
export class UserOrderComponent implements OnInit {
  activeOrders: string | null = '';
  customerId: string = '';

  orders: Order[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private completedOrderService: CompletedorderService,
    private router: Router,
    private orderService:OrderService
  ) { }

  ngOnInit(): void {
    this.activeOrders = this.activatedRoute.snapshot.queryParamMap.get('activeOrders');
    this.customerId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.orders=[]
    if(this.customerId) {
      if (this.activeOrders == 'true') {
        this.loadActiveOrders();

      } else
        this.loadCompletedOrders();
    }
  }

  private loadCompletedOrders(): void {
    this.completedOrderService.getCompletedOrdersByCustomer(this.customerId).subscribe({
      next: (orders) => {
        console.log(orders);  // Aggiungi questo per controllare il dato ricevuto
        this.orders = orders;
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
      }
    });
  }

  private loadActiveOrders(): void {
    this.orderService.getActiveOrdersByCustomer(this.customerId).subscribe({
      next: (orders) => {
        console.log(orders);  // Aggiungi questo per controllare il dato ricevuto
        this.orders = orders;
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
      }
    });
  }

  close(): void {
    this.router.navigate(['../catalogo/profilo']);
  }

  protected readonly ButtonTheme = ButtonTheme;

  goToDetail(orderId:string) {
    this.router.navigate(['../catalogo/dettaglio-ordine',orderId],{queryParams:{activeOrders:this.activeOrders,customerId:this.customerId}});

  }
}

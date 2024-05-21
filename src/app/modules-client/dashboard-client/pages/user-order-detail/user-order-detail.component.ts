// user-order-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../services/order.service';
import { ProductInPurchase } from '../../../../models/Product';
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {OrderDetails} from "../../../../models/Order";
import {CompletedorderService} from "../../../../services/completedorder.service";

@Component({
  selector: 'app-user-order-detail',
  templateUrl: './user-order-detail.component.html',
  styleUrls: ['./user-order-detail.component.scss']
})
export class UserOrderDetailComponent implements OnInit {
  orderId: string = '';
  orderDetails: OrderDetails=new OrderDetails();
  customerId: string = '';
  activeOrders: string | null = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private completedOrderService: CompletedorderService,
  ) {}

  ngOnInit(): void {
    this.activeOrders = this.activatedRoute.snapshot.queryParamMap.get('activeOrders');
    this.customerId= this.activatedRoute.snapshot.queryParamMap.get('customerId')!;
    this.orderId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.orderDetails=new OrderDetails();
    if (this.customerId && this.orderId) {

      if(this.activeOrders=='true')
        this.loadProductsFromActiveOrder();
      else
        this.loadProductsFromCompletedOrder();
    }
  }

  loadProductsFromCompletedOrder(): void {
    this.completedOrderService.getOrderDetails(this.orderId).subscribe({
      next: (orderDetails: any) => {
        this.orderDetails = orderDetails;
      },
      error: (err) => console.error('Error loading completed order details:', err)
    });
  }

  loadProductsFromActiveOrder(): void {
    this.orderService.getOrderDetails(this.orderId).subscribe({
      next: (orderDetails: any) => {
        this.orderDetails = orderDetails;
      },
      error: (err) => console.error('Error loading active order details:', err)
    });
  }

  close(): void {
    this.router.navigate(['../catalogo/ordini',this.customerId],{queryParams:{activeOrders:this.activeOrders}});

  }



  contactUs(): void {
    // Implement the logic to contact, maybe open a mailto or call window
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
}

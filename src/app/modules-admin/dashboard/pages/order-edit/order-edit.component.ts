import {Component, OnInit} from '@angular/core';
import { ButtonSizeTheme, ButtonTheme } from 'twentyfive-style';
import {ActivatedRoute} from "@angular/router";
import {OrderService} from "../../../../services/order.service";
import {OrderDetails} from "../../../../models/Order";

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.scss'
})
export class OrderEditComponent implements OnInit{

  orderId: string | null;
  order: OrderDetails = new OrderDetails();


  constructor(private orderService: OrderService,
              private activatedRouteRoute: ActivatedRoute,) {
  }

  ngOnInit() {
    this.orderId = this.activatedRouteRoute.snapshot.paramMap.get('id');
    this.getOrder();
  }

  getOrder() {
    if (this.orderId !== null) {
      this.orderService.getOrderDetails(this.orderId).subscribe((res: any) => {
        this.order = res
      })
    }
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
}

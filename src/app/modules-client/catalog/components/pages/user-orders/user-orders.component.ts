import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss'
})
export class UserOrdersComponent implements OnInit{
  activeOrders:string|null=''

  constructor(private activedRoute:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activeOrders=this.activedRoute.snapshot.queryParamMap.get('activeOrders');
    console.log(this.activeOrders)

  }

}

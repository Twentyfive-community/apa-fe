import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrl: './user-order.component.scss'
})
export class UserOrderComponent implements OnInit{
  activeOrders:string|null=''

  constructor(private activedRoute:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activeOrders=this.activedRoute.snapshot.queryParamMap.get('activeOrders');
  }

}

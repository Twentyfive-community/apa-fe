// user-order-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../services/order.service';
import { ProductInPurchase } from '../../../../models/Product';
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {OrderDetails} from "../../../../models/Order";
import {CompletedorderService} from "../../../../services/completedorder.service";
import {ProductService} from "../../../../services/product.service";
import {BundleInPurchase} from "../../../../models/Bundle";

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

  productImages: string[]=[];
  bundleImages: string[]=[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private completedOrderService: CompletedorderService,
    private productService:ProductService,
  ) {}

  ngOnInit(): void {
    this.activeOrders = this.activatedRoute.snapshot.queryParamMap.get('activeOrders');
    this.customerId= this.activatedRoute.snapshot.queryParamMap.get('customerId')!;
    this.orderId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.orderDetails=new OrderDetails();
    this.productImages=[];
    this.bundleImages=[];
    if (this.customerId && this.orderId) {

      if(this.activeOrders=='true')
        this.loadProductsFromActiveOrder();
      else
        this.loadProductsFromCompletedOrder();

      console.log('product.nameè')
      for(var product of this.orderDetails.products){
        console.log(product.name)
      }
    }

  }


  loadProductsFromCompletedOrder(): void {
    this.completedOrderService.getOrderDetails(this.orderId).subscribe({
      next: (orderDetails: any) => {
        this.orderDetails = orderDetails;
        this.loadImages();

      },
      error: (err) => console.error('Error loading completed order details:', err)
    });
  }

  loadProductsFromActiveOrder(): void {
    this.orderService.getOrderDetails(this.orderId).subscribe({
      next: (orderDetails: any) => {
        this.orderDetails = orderDetails;
        this.loadImages();
      },
      error: (err) => console.error('Error loading active order details:', err)
    });
  }

  loadImages(){
    for(var product of this.orderDetails.products){
      let id= product.id;
      console.log(id);
      this.productService.getImageUrlByIdWeighted(id).subscribe({
        next:(imgUrl: string)=>{
        console.log(imgUrl);
        this.productImages.push(imgUrl);

        },
        error: (err)=> console.error('Error loading active order details:', err)
    });

    }
    for(var bundle of this.orderDetails.bundles){
      let id= bundle.id;
      console.log(bundle);
      this.productService.getImageUrlByIdTray(id).subscribe({
        next:(imgUrl: string)=>{
          console.log(imgUrl);
          this.bundleImages.push(imgUrl);

        },
        error: (err)=> console.error('Error loading active order details:', err)
      });

    }
  }

  close(): void {
    this.router.navigate(['../catalogo/ordini',this.customerId],{queryParams:{activeOrders:this.activeOrders}});

  }



  contactUs(): void {
    // Implement the logic to contact, maybe open a mailto or call window
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;

  getImageOfProduct(product: ProductInPurchase) {

    let n = this.orderDetails.products.indexOf(product);
    return this.productImages.at(n);
  }

  getImageOfBundle(bundle:BundleInPurchase) {

    let n = this.orderDetails.bundles.indexOf(bundle);
    return this.bundleImages.at(n);
  }
}

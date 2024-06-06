// user-order-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../services/order.service';
import { ProductInPurchase } from '../../../../models/Product';
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {OrderDetails} from "../../../../models/Order";
import {CompletedorderService} from "../../../../services/completedorder.service";
import {ProductService} from "../../../../services/product.service";
import {BundleInPurchase, BundleInPurchaseDetails} from "../../../../models/Bundle";
import {TwentyfiveModalService} from "twentyfive-modal";
import {RxStompServiceService} from "../../../../services/rxstomp/rx-stomp-service.service";

declare var bootstrap: any;
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
  completed = false;
  customerSubscriptionText: any;
  productImages: string[]=[];
  bundleImages: string[]=[];
  customizationsVisible: boolean[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private completedOrderService: CompletedorderService,
    private productService:ProductService,
    private rxStompService: RxStompServiceService
  ) {}

  loadBootstrapJS(): void {
    if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  ngOnInit(): void {
    this.loadBootstrapJS();
    this.activeOrders = this.activatedRoute.snapshot.queryParamMap.get('activeOrders');
    this.customerId= this.activatedRoute.snapshot.queryParamMap.get('customerId')!;
    this.orderId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.orderDetails=new OrderDetails();
    this.productImages=[];
    this.bundleImages=[];
    if (this.customerId && this.orderId) {
      this.customerSubscriptionText = this.rxStompService.watch(`/${this.customerId}`).subscribe((message:any) =>{
        if(message.body == 'COMPLETO' || message.body == 'ANNULLATO'){
          this.completed=true;
        }
          this.loadOrders(this.completed);
      });
    this.loadOrders();
    console.log('product.nameè')
    for(var product of this.orderDetails.products){
      console.log(product.name)
    }
  }

  }

  getCustomization(pip: ProductInPurchase): [string, string][] {
    const customizationArray: [string, string][] = [];
    for (const key in pip.customization) {
      if (pip.customization.hasOwnProperty(key)) {
        customizationArray.push([key, pip.customization[key]]);
      }
    }
    return customizationArray;
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
    const contactModal = new bootstrap.Modal(document.getElementById('contactModal'), {
      keyboard: false
    });
    contactModal.show();

  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;

  getImageOfProduct(product: ProductInPurchase) {

    let n = this.orderDetails.products.indexOf(product);
    return this.productImages.at(n);
  }

  getImageOfBundle(bundle:BundleInPurchaseDetails) {

    let n = this.orderDetails.bundles.indexOf(bundle);
    return this.bundleImages.at(n);
  }

  toggleCustomization(product: ProductInPurchase): void {
    let n = this.orderDetails.products.indexOf(product);
    this.customizationsVisible[n] = !this.customizationsVisible[n];
  }

  getCustomizationVisible(product: ProductInPurchase){
    let n = this.orderDetails.products.indexOf(product);
    return this.customizationsVisible[n];
  }
  loadOrders(completed?:boolean){
    if(this.activeOrders=='true' || completed? completed : false)
      this.loadProductsFromActiveOrder();
    else
      this.loadProductsFromCompletedOrder();
  }
}

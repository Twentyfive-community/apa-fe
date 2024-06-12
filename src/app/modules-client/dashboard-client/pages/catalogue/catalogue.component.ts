import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../../services/category.service";
import {Category} from "../../../../models/Category";
import {Router} from "@angular/router";
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {ProductService} from "../../../../services/product.service";
import {ProductDetails, ProductKg, ProductWeighted, Tray, TrayDetails} from "../../../../models/Product";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {ProductDetailsComponent} from "../product-details/product-details.component";
import {CustomCakeComponent} from "../custom-cake/custom-cake.component";
import {TrayCustomizedComponent} from "../tray-customized/tray-customized.component";
import {CustomerDetails} from "../../../../models/Customer";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {CustomerService} from "../../../../services/customer.service";

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss'
})
export class CatalogueComponent implements OnInit {


  customer: CustomerDetails = new CustomerDetails();
  customerIdkc: string = '';

  categories: Category[] = []
  categoryType = ['productKg', 'productWeighted', 'tray'];
  categoryActive: string = '';
  categoryName: string = '';
  productListKg: ProductKg[]=[];
  trayList: Tray[]=[];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 1;


  productDetails: ProductDetails = new ProductDetails();
  trayDetails: TrayDetails = new TrayDetails();

  loading: boolean = true;



  constructor(private categoryService: CategoryService,
              private genericModalService: TwentyfiveModalGenericComponentService,
              private productService: ProductService,
              private router: Router,
              private keycloackService: SigningKeycloakService,
              private customerService: CustomerService,
  ) {
  }


  ngOnInit() {
    this.getCategories()
    this.getCustomer();
  }


  getCategories() {
    this.categoryService.getAll(this.categoryType).subscribe((response: any) => {
      this.categories = response
      this.activeTab = this.categories[0].id;
      this.categoryActive = this.categories[0].type;
      this.categoryName = this.categories[0].name;
      this.getAll()
    })
  }

  activeTab: string = ''; // Inizializza la tab attiva come vuota

  setActiveTab(category: Category) {
    this.loading = true;
    this.activeTab = category.id; // Imposta l'ID della tab attiva quando viene cliccata
    this.categoryActive = category.type;
    this.categoryName = category.name;
    this.currentPage=1;
    this.getAll()
  }

  getAll(page?:number) {
    this.loading = true;
    switch (this.categoryActive) {
      case 'productKg':
        this.productService.getAllKgActive(this.activeTab, page ? this.currentPage - 1 : 0, this.itemsPerPage)
          .subscribe({
            next: (res: any) => {
              this.productListKg = res.content;
              this.setupPagination(res.totalPages);
            },
            error: (error: any) => {
              this.loading = false;
              console.error('Si è verificato un errore durante il recupero dei dati:', error);
            },
            complete: () => {
              this.loading = false;
            }
          });
        break;
      case 'tray':
        this.productService.getAllTraysActive(this.activeTab,page? this.currentPage-1 : 0, this.itemsPerPage).subscribe( {
          next: (res:any) =>{
            this.trayList = res.content;
            this.setupPagination(res.totalPages);
          },
          error: (error: any) => {
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        })
        break;
    }
  }

  modalProduct(productId: string){
    let r = this.genericModalService.open(ProductDetailsComponent, "s", {});
    r.componentInstance.productId = productId;
    r.componentInstance.categoryType = this.categoryActive;
    r.componentInstance.categoryName = this.categoryName;
    r.result.finally(() => {
      this.getAll()
    })
  }

  getCustomer(){
    let keycloakService=(this.keycloackService)as any;
    this.customerIdkc=keycloakService.keycloakService._userProfile.id;
    if(this.customerIdkc!=null){
      this.customerService.getCustomerByKeycloakId(this.customerIdkc).subscribe((res: any) =>{
        this.customer=res;

      })
    }
  }

  modalCustomCake(){
    let r = this.genericModalService.open(CustomCakeComponent, "s", {});
    r.result.finally( () => {
      this.getAll()
    })
  }


  customizedTray() {
    let r = this.genericModalService.open(TrayCustomizedComponent, "lg", {});
  }

  getProductDetails(event: any) {
    switch (this.categoryActive) {
      case 'productKg':
        this.productService.getByIdKg(event.id).subscribe((response: any) => {
          this.productDetails = response;
        })
        break;
      case 'productWeighted':
        this.productService.getByIdWeighted(event.id).subscribe((response: any) => {
          this.productDetails = response;
        })
        break;
      case 'tray':
        this.productService.getByIdTray(event.id).subscribe((response: any) => {
          this.trayDetails = response;
        })
        break;
    }
  }

  setupPagination(totalPages: number) {
    this.totalPages = totalPages;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAll(this.currentPage-1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getAll(this.currentPage-1);
    }
  }

  goToLogin(){
      this.router.navigate(['../dashboard'])
  }

  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;

}

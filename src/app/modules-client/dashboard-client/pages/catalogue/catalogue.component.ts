import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../../services/category.service";
import {Category} from "../../../../models/Category";
import {Router} from "@angular/router";
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {ProductService} from "../../../../services/product.service";
import {ProductDetails, ProductKg, ProductWeighted, Tray, TrayDetails} from "../../../../models/Product";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {ProductDetailsComponent} from "../product-details/product-details.component";
import {TrayCustomizedComponent} from "../tray-customized/tray-customized.component";
import {CustomerDetails} from "../../../../models/Customer";
import {KeycloakPasswordRecoveryService} from "../../../../services/passwordrecovery.service";
import {CustomerService} from "../../../../services/customer.service";
import {SigningKeycloakService} from "twentyfive-keycloak-new";

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss'
})
export class CatalogueComponent implements OnInit {



  categories: Category[] = []
  categoryType = ['productKg', 'productWeighted', 'tray'];
  categoryActive: string = '';
  categoryName: string = '';
  productListKg: ProductKg[]=[];
  productListWeighted: ProductWeighted[]=[];
  trayList: Tray[]=[];

  productDetails: ProductDetails = new ProductDetails();
  trayDetails: TrayDetails = new TrayDetails();




  constructor(private categoryService: CategoryService,
              private genericModalService: TwentyfiveModalGenericComponentService,
              private productService: ProductService,
              private signingKeycloakService: SigningKeycloakService,
              private customerService:CustomerService,
  ) {
  }


  ngOnInit() {
    this.getCategories()
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
    this.activeTab = category.id; // Imposta l'ID della tab attiva quando viene cliccata
    this.categoryActive = category.type;
    this.categoryName = category.name;
    this.getAll()
  }

  getAll() {
    switch (this.categoryActive) {
      case 'productKg':
        this.productService.getAllKgActive(this.activeTab).subscribe((res: any) => {
          this.productListKg = res
        })
        break;
      case 'tray':
        this.productService.getAllTraysActive(this.activeTab).subscribe((res: any) => {
          this.trayList = res
        })
        break;
    }
  }

  modalProduct(productId: string) {
    let r = this.genericModalService.open(ProductDetailsComponent, "s", {});
    r.componentInstance.productId = productId;
    r.componentInstance.categoryType = this.categoryActive;
    r.componentInstance.categoryName = this.categoryName;
    r.result.finally(() => {
      this.getAll()
    })
  }
  getIngredientListOfProduct(idProd: string) {

  }


  customizedTray() {
    let r = this.genericModalService.open(TrayCustomizedComponent, "l", {});
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
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;

}

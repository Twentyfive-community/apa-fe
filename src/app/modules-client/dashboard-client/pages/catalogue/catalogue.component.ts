import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../../services/category.service";
import {Category} from "../../../../models/Category";
import {Router} from "@angular/router";
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {ProductService} from "../../../../services/product.service";
import {ProductDetails, ProductKg, ProductWeighted, Tray, TrayDetails} from "../../../../models/Product";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {CategoryEditComponent} from "../../../../shared/category-edit/category-edit.component";
import {ProductDetailsComponent} from "../product-details/product-details.component";
import {response} from "express";
import {CustomCakeComponent} from "../custom-cake/custom-cake.component";

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss'
})
export class CatalogueComponent implements OnInit{

  categories: Category[] = []
  categoryType=['productKg','productWeighted','tray'];
  categoryActive: string = '';
  categoryName: string = '';
  productListKg: ProductKg[]=[];
  productListWeighted: ProductWeighted[]=[];
  trayList: Tray[]=[];

  productDetails: ProductDetails = new ProductDetails();
  trayDetails: TrayDetails = new TrayDetails();



  constructor(private categoryService: CategoryService,
              private router: Router,
              private genericModalService: TwentyfiveModalGenericComponentService,
              private productService: ProductService
              ) {
  }


  ngOnInit() {
    this.getCategories()
  }

  getCategories(){
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

  getAll(){
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

  modalProduct(productId: string){
    let r = this.genericModalService.open(ProductDetailsComponent, "s", {});
    r.componentInstance.productId = productId;
    r.componentInstance.categoryType= this.categoryActive;
    r.componentInstance.categoryName= this.categoryName;
    r.result.finally(() => {
      this.getAll()
    })
  }

  modalCustomCake(){
    let r = this.genericModalService.open(CustomCakeComponent, "s", {});
    r.result.finally( () => {
      this.getAll()
    })
  }


  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
}

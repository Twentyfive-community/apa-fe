import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../../services/category.service";
import {Category} from "../../../../models/Category";
import {Router} from "@angular/router";
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {ProductService} from "../../../../services/product.service";
import {ProductDetails, ProductKg, ProductWeighted, Tray, TrayDetails} from "../../../../models/Product";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss'
})
export class CatalogueComponent implements OnInit{

  categories: Category[] = []
  categoryType=['productKg','productWeighted','tray'];
  categoryActive: string = '';
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
      this.getAll()
    })
  }

  activeTab: string = ''; // Inizializza la tab attiva come vuota

  setActiveTab(category: Category) {
    this.activeTab = category.id; // Imposta l'ID della tab attiva quando viene cliccata
    this.categoryActive = category.type;
    console.log(this.activeTab)
    this.getAll()
  }

  getAll(){
    switch (this.categoryActive) {
      case 'productKg':
        this.productService.getAllKg(this.activeTab,0,5, '','').subscribe((res: any) => {
          this.productListKg = res.content
        })
        break;
      case 'productWeighted':
        this.productService.getAllWeighted(this.activeTab,0,5,'','').subscribe((res: any) => {
          this.productListWeighted = res.content
        })
        break;
      case 'tray':
        this.productService.getAllTrays(this.activeTab,0, 5,'','').subscribe((res: any) => {
          this.trayList = res.content
          console.log("SUUUUUS")
          console.log(this.trayList)
        })
        break;
    }
  }

  getProductDetails(event: any) {
    switch (this.categoryActive) {
      case 'productKg':
        this.productService.getByIdKg(event.id).subscribe((response:any) =>{
          this.productDetails=response;
        })
        break;
      case 'productWeighted':
        this.productService.getByIdWeighted(event.id).subscribe((response:any) =>{
          this.productDetails=response;
        })
        break;
      case 'tray':
        this.productService.getByIdTray(event.id).subscribe((response:any) =>{
          this.trayDetails=response;
        })
        break;
    }
  }

  getIngredientListOfProduct(idProd: string){

  }

  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
}

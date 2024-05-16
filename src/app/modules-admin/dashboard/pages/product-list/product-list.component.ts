import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../../services/category.service";
import {Category} from "../../../../models/Category";
import {ProductService} from "../../../../services/product.service";
import {
  ProductKg,
  ProductDetails,
  ProductWeighted,
  ProductWeightedDetails,
  Tray,
  TrayDetails
} from "../../../../models/Product";
import {ToastrService} from "ngx-toastr";
import {TwentyfiveModalService} from "twentyfive-modal";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryEditComponent} from "../../../../shared/category-edit/category-edit.component";
import {
  TwentyfiveModalGenericComponentModule,
  TwentyfiveModalGenericComponentService
} from "twentyfive-modal-generic-component";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit{
  headersKg: any[] = [
    {name: 'Nome', value: 'name',sortable: true},
    {name: 'Allergeni', value: 'allergens.iconUrl'},
    {name: 'Ingredienti', value: 'ingredients'},
    {name: 'Prezzo/Kg', value: 'pricePerKg',sortable: true}
  ];
  headersWeighted: any[] = [
    {name: 'Nome', value: 'name',sortable: true},
    {name: 'Allergeni', value: 'allergens.iconUrl'},
    {name: 'Ingredienti', value: 'ingredients'},
    {name: 'Peso', value: 'weight',sortable: true}
  ];
  headersTray: any[] = [
    {name: 'Nome', value: 'name',sortable: true},
    {name: 'Tipologia', value: 'customized'},
    {name: 'Misure', value: 'measures',sortable: true},
    {name: 'Descrizione', value: 'description'},
  ];
  tableActions: any[] = [
    {
      icon: 'bi bi-pencil-square',
      action: async (myRow: any) => {
        console.log(myRow);
        this.router.navigate(['/dashboard/editingProdotti/', myRow.id], {relativeTo: this.activatedRouteRoute,
          queryParams: {
            categoryId: this.activeTab,
          }});
      },
      actionName: 'Modifica',
      tooltipText: 'Modifica Prodotto',
      placement: 'top',
      showFunction: (myRow: any) => {
        return true;
      }
    },
  ];
  paginationElements: any[] = [
    {
      actionName: '5',
      value: '5'
    },
    {
      actionName: '10',
      value: '10'
    },
    {
      actionName: '25',
      value: '25'
    }
  ];
  extras: any[] = [
    {name: 'prodottoKg', value: 'productKgDetails'}
  ]
  activeTab: string = '';
  pageSize: number = 5
  currentPage: number = 0;
  maxSize: number = 5;
  collectionSize: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';


  categoryType=['productKg','productWeighted','tray'];
  categoryActive: string = '';
  navCategories: Category[]=[];
  productListKg: ProductKg[]=[];
  productListWeighted: ProductWeighted[]=[];
  trayList: Tray[]=[];
  dataDetailsKg: any[] = [new ProductDetails()];
  dataDetailsWeighted: any[] = [new ProductWeightedDetails()];
  dataDetailsTrays: any[] = [new TrayDetails()];

  productDetails: ProductDetails = new ProductDetails();
  trayDetails: TrayDetails = new TrayDetails();

  constructor(private router: Router,
              private activatedRouteRoute: ActivatedRoute,
              private toastrService: ToastrService,
              private modalService: TwentyfiveModalService,
              private categoryService:CategoryService,
              private productService:ProductService,
              private genericModalService:TwentyfiveModalGenericComponentService) {}
  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(){
    this.categoryService.getAll(this.categoryType).subscribe((response: any) => {
      this.navCategories = response;
      if (this.navCategories.length > 0){
        this.activeTab = this.navCategories[0].id;
        this.categoryActive = this.navCategories[0].type;
        this.getAll();
      }
    })
  }
  getAll(page?: number){
    switch (this.categoryActive) {
      case 'productKg':
        this.productService.getAllKg(this.activeTab,page ? page : 0 , this.pageSize, this.sortColumn, this.sortDirection).subscribe((res: any) => {
          this.productListKg = res.content
          this.collectionSize = res.totalElements;
        })
        break;
      case 'productWeighted':
        this.productService.getAllWeighted(this.activeTab,page ? page : 0 , this.pageSize, this.sortColumn, this.sortDirection).subscribe((res: any) => {
          this.productListWeighted = res.content
          this.collectionSize = res.totalElements;
        })
        break;
      case 'tray':
        this.productService.getAllTrays(this.activeTab,page ? page : 0 , this.pageSize, this.sortColumn, this.sortDirection).subscribe((res: any) => {
          this.trayList = res.content
          this.collectionSize = res.totalElements;
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
  changePage(event: number) {
    this.currentPage = event;
    this.getAll(this.currentPage-1);
  }

  selectSize(event: any) {
    this.pageSize = event;
    this.getAll();
  }
  setActiveTab(category: Category) {
    this.sortDirection='';
    this.sortColumn='';
    this.collectionSize = 90;
    this.activeTab = category.id;
    this.categoryActive = category.type;
    this.getAll();
  }

  sortingColumn(event: any) {
    this.sortColumn = event.sortColumn;
    this.sortDirection = event.sortDirection;
    this.getAll(this.currentPage-1);
  }
  switch(event: any) {
    switch (this.categoryActive) {
      case 'productKg':
        if (event.active) {
          this.productService.disableByIdKg(event.id).subscribe({
            error: () => {
              this.toastrService.error("Errore nel disattivare questo prodotto!");
              this.getAll(this.currentPage-1);
            },
            complete: () => {
              this.getAll(this.currentPage-1);
            }
          });
        } else {
          this.productService.activateByIdKg(event.id).subscribe({
            error: () => {
              this.toastrService.error("Errore nell\'attivare questo prodotto!");
              this.getAll(this.currentPage-1);
            },
            complete: () => {
              this.getAll(this.currentPage-1);
            }
          });
        }
        break;
      case 'productWeighted':
        if (event.active) {
          this.productService.disableByIdWeighted(event.id).subscribe({
            error: () => {
              this.toastrService.error("Errore nel disattivare questo prodotto!");
              this.getAll(this.currentPage-1);
            },
            complete: () => {
              this.getAll(this.currentPage-1);
            }
          });
        } else {
          this.productService.activateByIdWeighted(event.id).subscribe({
            error: () => {
              this.toastrService.error("Errore nell\'attivare questo prodotto!");
              this.getAll(this.currentPage-1);
            },
            complete: () => {
              this.getAll(this.currentPage-1);
            }
          });
        }
        break;
      case 'tray':
        this.productService.activateOrDisableTray(event.id).subscribe({
          error: () => {
            this.toastrService.error("Errore nell\'attivare o disattivare questo vassoio!");
            this.getAll(this.currentPage-1);
          },
          complete: () => {
            this.getAll(this.currentPage-1);
          }
        });
        break;
    }
  }
  editCategoryToModify(){
    let r = this.genericModalService.open(CategoryEditComponent, "lg", {});
    r.componentInstance.categoryId = this.activeTab;
    r.result.finally(() => {
      this.getCategories()
    })
  }

  disableCategory(){
    this.modalService.openModal(
      'Sei sicuro di voler cancellare questa categoria?',
      'Abilita',
      'Annulla',
      'Conferma',
      {
        showIcon: true,
        size: 'md',
        onConfirm: (() => {
          this.categoryService.disableCategory(this.activeTab).subscribe({
            next: (() =>{
              this.getCategories();
            })
          });
        })
      });
  }

  editCategory() {
    let r = this.genericModalService.open(CategoryEditComponent, "lg", {});
    r.componentInstance.categoryType=this.categoryType;
    r.result.finally(() => {
      this.getCategories()
    })
  }

  goToEdit() {
    this.router.navigate(['/dashboard/editingProdotti'], {queryParams: {categoryId: this.activeTab}});
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
}
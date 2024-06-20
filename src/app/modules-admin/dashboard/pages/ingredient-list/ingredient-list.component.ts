import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ButtonSizeTheme, ButtonTheme, TableHeadTheme, TableTheme} from "twentyfive-style";
import {Ingredient} from "../../../../models/Ingredient";
import {CustomerService} from "../../../../services/customer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TwentyfiveModalService} from "twentyfive-modal";
import {IngredientService} from "../../../../services/ingredient.service";
import {Category} from "../../../../models/Category";
import {CategoryService} from "../../../../services/category.service";
import {response} from "express";
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {CategoryEditComponent} from "../../../../shared/category-edit/category-edit.component";

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.scss'
})
export class IngredientListComponent implements OnInit, AfterViewInit{

  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
  protected readonly TableTheme = TableTheme;
  protected readonly TableHeadTheme = TableHeadTheme;

  activeTab: string | null; // Inizializza la tab attiva come vuota

  @ViewChild('allergenColumnRef', {static: true}) allergenColumnRef!: TemplateRef<any>;

  columnTemplateRefs: { [key: string]: TemplateRef<any> } = {};

  currentPage: number=0;
  maxSize: number = 5;
  pageSize: number = 25;
  sortColumn: string='';
  sortDirection: string='';
  loading:boolean = true;

  headers: any[] = [
    { name:'Nome', value:'name'},
    { name:'Allergeni', value:'allergens'},
    { name:'Descrizione', value:'note'}
  ]
  paginationElements: any[] = [
    {
      actionName: '25',
      value: '25'
    },
    {
      actionName: '50',
      value: '50'
    },
    {
      actionName: '100',
      value: '100'
    }
  ];

  ingredients: Ingredient[] = []

  categories: Category[] = []
  disabledCategories: Category[] = [];
  changeTab = false;

  constructor(private ingredientService: IngredientService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: TwentyfiveModalService,
              private genericModalService: TwentyfiveModalGenericComponentService) {
  }

  ngOnInit(): void {
    this.activeTab = this.activatedRoute.snapshot.queryParamMap.get('activeTab');
    this.getCategories()
  }

  ngAfterViewInit() {
    this.columnTemplateRefs['allergens'] = this.allergenColumnRef;
  }

  goToNew() {
    this.router.navigate(['/dashboard/editingIngredienti'], {queryParams: {activeTab: this.activeTab}});
  }

  goToEdit(event: any) {
    this.router.navigate(['/dashboard/editingIngredienti', event.id], {queryParams: {activeTab: this.activeTab}});
  }

  editCategoryToModify() {
    let r = this.genericModalService.open(CategoryEditComponent, "lg", {});
    r.componentInstance.categoryId = this.activeTab;
    r.result.finally(() => {
      this.getCategories()
    })
  }

  editCategory() {
    let r = this.genericModalService.open(CategoryEditComponent, "lg", {});
    r.componentInstance.categoryId = '';
    r.result.finally(() => {
      this.getCategories()
    })
  }

  disableCategory() {
    this.modalService.openModal(
      'Sei sicuro di voler disabilitare questa categoria?',
      'Disabilita',
      'Annulla',
      'Conferma',
      {
        showIcon: true,
        size: 'md',
        onConfirm: (() => {
          this.categoryService.disableCategory(this.activeTab!).subscribe({
            next: (() => {
              this.getCategories();
            })
          });
        })
      });
  }

  enableCategory(id: string) {
    this.modalService.openModal(
      'Sei sicuro di voler abilitare questa categoria?',
      'Abilita',
      'Annulla',
      'Conferma',
      {
        showIcon: true,
        size: 'md',
        onConfirm: (() => {
          this.categoryService.enableCategory(id).subscribe({
            next: (() => {
              this.getCategories();
            })
          });
        })
      });
  }

  getAll(id: string, page?: number) {
    const currentPage = page ? page : 0;
    this.ingredientService.getAll(id, page ? page : 0, this.pageSize, this.sortColumn, this.sortDirection).subscribe((response: any) => {
      console.log({
        id: id,
        page: currentPage,
        pageSize: this.pageSize,
        sortColumn: this.sortColumn,
        sortDirection: this.sortDirection
      });
      this.ingredients = response.content;
      this.maxSize = response.totalElements;
    })

  }

  getCategories() {
    this.categoryService.getAll(["ingredienti"]).subscribe((response: any) => {
      this.categories = response
      if (!this.activeTab) {
        this.activeTab = this.categories[0].id;
      }
      this.getAll(this.activeTab!)
    })
    this.categoryService.getAllDisabled(["ingredienti"]).subscribe((response: any) => {
      this.disabledCategories = response;
    })
  }


  setActiveTab(tabId: string) {
    if(this.activeTab != tabId) {
      this.activeTab = tabId;
      this.changeTab = true;
      this.currentPage = 0;
      this.getAll(tabId);
    }
  }

  disableStatus(id: string) {
    this.ingredientService.disableIngredient(id).subscribe({
      next: (() => {
        this.getAll(this.activeTab!, this.currentPage);
      })
    });
  }


  activateStatus(id: string) {
    this.ingredientService.activeIngredient(id).subscribe({
      next: (() => {
        this.getAll(this.activeTab!);
      })
    });
  }


  selectSize(event: any) {
    this.pageSize = event;
    this.getAll(this.activeTab!)
  }

  changePage(event: number) {
    this.currentPage = event - 1;
    if (this.changeTab) {
      this.changeTab = false;
    }
    this.getAll(this.activeTab!, this.currentPage);

    //cambio tab, setto currentPage a 0 allora una navigazione la devo bloccare 1
  }

  sortingColumn(event: any) {
    this.sortColumn = event.sortColumn;
    this.sortDirection = event.sortDirection;
    this.getAll(this.activeTab!, this.currentPage);
  }


  activeOrDisable(event: any) {
    if (event.active) {
      this.disableStatus(event.id)
    } else {
      this.activateStatus(event.id)
    }
  }

}

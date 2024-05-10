import {Component, OnInit} from '@angular/core';
import {ButtonSizeTheme, ButtonTheme, TableHeadTheme, TableTheme} from "twentyfive-style";
import {Ingredient} from "../../../../models/Ingredient";
import {CustomerService} from "../../../../services/customer.service";
import {Router} from "@angular/router";
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
export class IngredientListComponent implements OnInit{

  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
  protected readonly TableTheme = TableTheme;
  protected readonly TableHeadTheme = TableHeadTheme;

  currentPage: number=0;
  maxSize: number = 5;
  pageSize: number = 5;
  sortColumn: string='';
  sortDirection: string='';

  headers: any[] = [
    { name:'Nome',    value:'name'},
    { name:'Allergeni',   value:'allergens.iconUrl'},
    { name:'Descrizione', value:'note'},
    { name:'Alcolico', value:'alcoholicString'},
    { name:'Status', value:'status'}
  ]

  ingredients: Ingredient[] = []
  categories: Category[] = []

  /*
  tableActions: any[]=[
    {
      icon:'bi bi-pencil-square',
      action: async(event: any) =>{
        this.router.navigate(['/dashboard/editingIngredienti', event.id],{ queryParams: { activeTab: this.activeTab } } )
      },
      actionName:'Modifica',
      toolTipText:'Modifica',
      placement: 'top',
      showFunction: () => {
      }
    },
    {
      icon:'bi bi-toggle-on',
      action:async (myRow: any) =>{
        this.modalService.openModal(
          'Sei sicuro di voler disabilitare questo ingrediente?',
          'Disabilita',
          'Annulla',
          'Conferma',
          {
            showIcon: true,
            size: 'md',
            onConfirm: (() => {
              this.disableStatus(myRow.id);
            })
          });
      },
      actionName: 'Disabilita',
      tooltipText: 'Disabilita',
      placement: 'top',
      showFunction: (myRow: any) => {
        return myRow.active==true;
      }
    },
    {
      icon:'bi bi-toggle-off',
      action:async (myRow: any) =>{
        this.modalService.openModal(
          'Sei sicuro di voler abilitare questo ingrediente?',
          'Abilita',
          'Annulla',
          'Conferma',
          {
            showIcon: true,
            size: 'md',
            onConfirm: (() => {
              this.activateStatus(myRow.id);
            })
          });
      },
      actionName: 'Abilita',
      tooltipText: 'Abilita',
      placement: 'top',
      showFunction: (myRow: any) => {
        return myRow.active==false;
      }
    }
  ]
*/
  constructor(private ingredientService: IngredientService,
              private categoryService: CategoryService,
              private router: Router,
              private modalService: TwentyfiveModalService,
              private genericModalService: TwentyfiveModalGenericComponentService) {}

  ngOnInit(): void {
    this.getCategories()
  }

  goToEdit(){
    this.router.navigate(['/dashboard/editingIngredienti'], { queryParams: { activeTab: this.activeTab } });
  }

  editCategoryToModify(){
    let r = this.genericModalService.open(CategoryEditComponent, "lg", {});
    r.componentInstance.categoryId = this.activeTab;
    r.result.finally(() => {
      this.getCategories()
    })
  }

  editCategory(){
    let r = this.genericModalService.open(CategoryEditComponent, "lg", {});
    r.componentInstance.categoryId = '';
    r.result.finally(() => {
      this.getCategories()
    })
  }

  disableCategory(){
    this.modalService.openModal(
      'Sei sicuro di voler abilitare questo ingrediente?',
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

  getAll(id: string , page?: number){
    this.ingredientService.getAll(id,page? page : 0, this.pageSize, this.sortColumn, this.sortDirection).subscribe((response: any) => {
      this.ingredients = response.content;
      this.maxSize = response.totalElements;
    })

  }

  getCategories(){
    this.categoryService.getAll(["ingredienti"]).subscribe((response: any) => {
      this.categories = response
      this.activeTab = this.categories[0].id;
      this.getAll(this.activeTab)
    })
  }

  activeTab: string = ''; // Inizializza la tab attiva come vuota

  setActiveTab(tabId: string) {
    this.activeTab = tabId; // Imposta l'ID della tab attiva quando viene cliccata
    this.getAll(tabId)
  }

  disableStatus(id: string){
    this.ingredientService.disableIngredient(id).subscribe({
      next: (() => {
        this.getAll(this.activeTab);
      })
    });
  }


  activateStatus(id: string){
    this.ingredientService.activeIngredient(id).subscribe({
      next: (() => {
        this.getAll(this.activeTab);
      })
    });
  }


  selectSize(event: any){
    this.pageSize=event;
    this.getAll(this.activeTab)
  }

  changePage(event: number){
    this.currentPage = event;
    this.getAll(this.activeTab, this.currentPage-1);
  }

  sortingColumn(event: any){
    this.sortColumn = event.sortColumn;
    this.sortDirection = event.sortDirection;
    this.getAll(this.activeTab)
  }


  activeOrDisable(event: any) {
    if(event.active){
      this.disableStatus(event.id)
    }
    else{
      this.activateStatus(event.id)
    }

  }

  modifyIngredient(event: any){
    this.router.navigate(['/dashboard/editingIngredienti', event.id],{ queryParams: { activeTab: this.activeTab } })
  }

}

import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ButtonSizeTheme, ButtonTheme, TableHeadTheme, TableTheme} from "twentyfive-style";
import {Category} from "../../../../models/Category";
import {MenusectionService} from "../../../../services/menusection.service";
import {CategoryService} from "../../../../services/category.service";
import {ToastrService} from "ngx-toastr";
import {MenuitemService} from "../../../../services/menuitem.service";
import {MenuItem, MenuItemToAdd} from "../../../../models/Menu";
import {CategoryEditComponent} from "../../../../shared/category-edit/category-edit.component";
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {TwentyfiveModalService} from "twentyfive-modal";
declare var bootstrap: any;
@Component({
  selector: 'app-menu-section-details',
  templateUrl: './menu-section-details.component.html',
  styleUrl: './menu-section-details.component.scss'
})
export class MenuSectionDetailsComponent implements OnInit,AfterViewInit{

  headers: any[] = [
    { name:'Nome', value:'name'},
    { name:'Allergeni', value:'allergens'},
    { name:'Descrizione', value:'description'},
    { name:'Prezzo', value:'price'}
  ];
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

  @ViewChild('allergenColumnRef', {static: true}) allergenColumnRef!: TemplateRef<any>;
  columnTemplateRefs: { [key: string]: TemplateRef<any> } = {};

  idSection: string | null;
  categories: Category[] = []
  disabledCategories: Category[] = [];
  items: MenuItem[] = []
  item: MenuItemToAdd = new MenuItemToAdd();
  activeTab: string | null;
  sortDirection: string ="";
  sortColumn: string ="";
  selectedCategoryToChange:string;
  selectedCategoryId:string;
  categoryActive: string;

  pageSize: number = 25
  currentPage: number = 0;
  maxSize: number = 5;
  collectionSize: number = 0;

  protected readonly ButtonTheme = ButtonTheme;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private menusectionService:MenusectionService,
              private menuitemService:MenuitemService,
              private categoryService:CategoryService,
              private toastr:ToastrService,
              private genericModalService:TwentyfiveModalGenericComponentService,
              private modalService:TwentyfiveModalService) {
  }
  ngOnInit(): void {
    this.idSection = this.activatedRoute.snapshot.paramMap.get('id');
    this.activeTab = this.activatedRoute.snapshot.queryParamMap.get('activeTab');
    this.loadBootstrapJS();
    this.getAllCategories();
  }
  ngAfterViewInit() {
    this.columnTemplateRefs['allergens'] = this.allergenColumnRef;
  }
  getAll(page?: number){
    this.menuitemService.getAllByIdCategoryPaginated(this.activeTab!,page ? page : 0 , this.pageSize, this.sortColumn, this.sortDirection).subscribe({
      next:(res:any) => {
        this.items = res.content;
        this.collectionSize = res.totalElements;
      },
      error:(err:any) => {
        console.error(err);
        this.toastr.error("Errore nel recuperare i prodotti!")
      }
    })
  }
  getAllCategories(){
    this.categoryService.getAllByIdSection(this.idSection!).subscribe((response: any) => {
      this.categories = response;
      if (this.activeTab){
        this.categoryService.getById(this.activeTab!).subscribe((response: any) => {
          this.categoryActive = response.type;
          this.getAll();
        })
      } else {
        if (this.categories.length > 0){
          this.activeTab = this.categories[0].id;
          this.categoryActive = this.categories[0].type;
          this.getAll();
        }
      }

    });
    this.categoryService.getAllDisabledByIdSection(this.idSection!).subscribe((response: any) => {
      this.disabledCategories = response;
    });

  }
  setActiveTab(category: Category) {
    this.sortDirection='';
    this.sortColumn='';
    this.activeTab = category.id;
    this.getAll();
  }
  goToNew() {
    this.router.navigate(['/dashboard/editingProdotti'], {queryParams: {categoryId: this.activeTab,idSection:this.idSection}});
  }
  goToEdit(event:any) {
    this.router.navigate(['/dashboard/editingProdotti',event.id], {queryParams: {categoryId: this.activeTab,idSection:this.idSection}});
  }
  changeCategoryOrder(id: string) {
    this.selectedCategoryToChange=id;
    // Open the modal
    const modal = new bootstrap.Modal(document.getElementById('changeOrderModal'), {});
    modal.show();

  }
  confirmChangeOrder() {
    const currentIndex = this.categories.findIndex(category => category.id === this.selectedCategoryToChange);
    const newIndex = this.categories.findIndex(category => category.id === this.selectedCategoryId);

    if (currentIndex >= 0 && newIndex >= 0 && currentIndex !== newIndex) {

      // Clona l'array e scambia gli elementi
      const newCategories = [...this.categories];
      const tmp = newCategories[currentIndex];
      newCategories[currentIndex] = newCategories[newIndex];
      newCategories[newIndex] = tmp;

      // Aggiorna l'array originale con quello modificato
      this.categories = newCategories;


    }
    // Chiudi il modal e aggiorna le priorità
    const modal = bootstrap.Modal.getInstance(document.getElementById('changeOrderModal'));
    modal.hide();
    this.updateOrderPriorities();
  }

  updateOrderPriorities() {
    // Crea una mappa delle priorità usando reduce
    const priorityMap = this.categories.reduce((map, category, index) => {
      map[category.id] = index;
      return map;
    }, {} as { [key: string]: number });

    // Invia la mappa delle priorità al backend
    this.categoryService.setOrderPriorities(priorityMap).subscribe({

    });
  }
  loadBootstrapJS(): void {
    if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }
  editCategoryToModify(){
    let r = this.genericModalService.open(CategoryEditComponent, "lg", {});
    r.componentInstance.categoryId = this.activeTab;
    r.componentInstance.sectionMenu = true;
    r.componentInstance.idSection = this.idSection;
    r.result.finally(() => {
      this.getAllCategories();
    })
  }

  disableCategory(){
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
            error:(err) =>{
              console.error(err);
              this.toastr.error("Impossibile disattivare questa categoria!");
            },
            complete: (() =>{
              this.toastr.success("Categoria disattivata con successo!");
              this.getAllCategories();
            }),
          });
        })
      });
  }
  activeOrDisable(event: any) {
    this.menuitemService.activateOrDisable(event.id).subscribe({
      error:(err:any) =>{
        console.error(err);
        this.toastr.error('errore nel modificare il prodotto!');
      },
      complete:() =>{
        let message = event.active ? 'Prodotto disattivato con successo!' : 'Prodotto attivato con successo!';
        this.toastr.success(message);
        this.getAll(this.currentPage-1);
      }
    })
  }
  deleteCategory(id:string) {
    this.modalService.openModal(
      'Sei sicuro di voler eliminare definitivamente questa categoria?',
      'Elimina',
      'Annulla',
      'Conferma',
      {
        showIcon: true,
        size: 'md',
        onConfirm: (() => {
          this.categoryService.deleteCategory(id).subscribe({
            error:(err) =>{
              console.error(err);
              this.toastr.error("Impossibile cancellare questa categoria!");
            },
            complete: (() =>{
              this.toastr.success("Categoria cancellata con successo!");
              this.getAllCategories();
            })
          });
        })
      });
  }

  changePage(event: number) {
    this.currentPage = event;
    this.getAll(this.currentPage-1);
  }

  selectSize(event: any) {
    this.pageSize = event;
    this.getAll();
  }

  sortingColumn(event: any) {
    this.sortColumn = event.sortColumn;
    this.sortDirection = event.sortDirection;
    this.getAll(this.currentPage-1);
  }
  editCategory() {
    let r = this.genericModalService.open(CategoryEditComponent, "lg", {});
    r.componentInstance.sectionMenu = true;
    r.componentInstance.idSection = this.idSection;
    r.result.finally(() => {
      this.getAllCategories()
    })
  }
  enableCategory(id:string){
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
            error:(err) =>{
              console.error(err);
              this.toastr.error("Impossibile attivare questa categoria!");
            },
            complete: (() =>{
              this.toastr.success("Categoria attivata con successo!");
              this.getAllCategories();
            }),
          });
        })
      });
  }


  close(){
    this.router.navigate(["/dashboard/menu"]);
  }

  protected readonly TableHeadTheme = TableHeadTheme;
  protected readonly TableTheme = TableTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
}

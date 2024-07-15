import {Component, OnInit} from '@angular/core';
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {Category} from "../../models/Category";
import {CategoryService} from "../../services/category.service";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.scss'
})
export class CategoryEditComponent implements OnInit{

  // Mappa di traduzione per visualizzare le categorie in italiano
  categoryTypeTranslationMap: { [key: string]: string } = {
    ingredienti: 'Ingredienti',
    productKg: 'Prodotto al kg',
    productWeighted: 'Prodotto al pezzo',
    tray: 'Vassoio'
  };
  categoryId: string | '';
  categoryType: string[] | null;
  category: Category = new Category();
  selectedCategoryName: string;
  sectionMenu: boolean | null;
  idSection: string | null;
  constructor(private modalService: TwentyfiveModalGenericComponentService,
              private categoryService: CategoryService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    if(this.categoryId)
      this.findCategoryById()
    if(this.sectionMenu && this.idSection){
      this.category.idSection=this.idSection;
    }
  }

  findCategoryById(){
    this.categoryService.getCategory(this.categoryId).subscribe((response:any)=>{
      this.category=response;
    })
  }

  close() {
    this.modalService.close();
  }

  onInputChange(event: any, type: string) {
    switch (type) {
      case 'name':
        this.category.name = event.target.value;
        break;
    }
  }


  saveNewCategory(){
    if(this.categoryId=='' && !this.categoryType && !this.sectionMenu){
      this.category.type="ingredienti"
    }
    if (this.isValid()){
      this.categoryService.saveCategory(this.category).subscribe({
        error:() =>{
          this.toastrService.error("Errore nel salvare la categoria");
          this.close()
        },
        complete:() =>{
          this.toastrService.success("Categoria salvata con successo");
          this.close()
        }
      });
    } else {
      this.toastrService.error("Compilare nome e scegliere un tipo categoria apposita!");
    }
  }

  setActiveCategory(category: string) {
    this.selectedCategoryName=category;
    this.category.type=this.selectedCategoryName;
  }

  isValid(){
    if(this.sectionMenu){
      return this.category.name;
    } else {
      return this.category.name && this.category.type;
    }
  }
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
}

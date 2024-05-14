import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ButtonSizeTheme, ButtonTheme, ChipTheme} from "twentyfive-style";
import {TwentyfiveModalService} from "twentyfive-modal";
import {Category} from "../../../../models/Category";
import {CategoryService} from "../../../../services/category.service";
import {ProductService} from "../../../../services/product.service";
import {ProductDetails, ProductToEdit, TrayDetails, WeightRange} from "../../../../models/Product";
import {IngredientService} from "../../../../services/ingredient.service";
import {ToastrService} from "ngx-toastr";
import {Measure} from "../../../../models/Measure";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit{

  categoryId: string | null;
  productId:string | null;

  category: Category = new Category();

  productToAdd: ProductToEdit = new ProductToEdit();

  ingredientNames: any = [];
  selectedIngredients: string[] = [];

  pricePerKg = 0;
  weight = 0;
  minWeight = 0;
  maxWeight = 0;
  measure: { label: string, weight: number }[] = [
    { label: '', weight: 0 }
  ];
  i = 0;
  constructor(private router: Router,
              private modalService: TwentyfiveModalService,
              private toastrService: ToastrService,
              private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private categoryService: CategoryService,
              private ingredientService: IngredientService) {
  }

  ngOnInit(): void {
    this.categoryId=this.activatedRoute.snapshot.queryParamMap.get('categoryId');
    this.productId=this.activatedRoute.snapshot.paramMap.get('id');
    if(this.categoryId){
      this.categoryService.getById(this.categoryId).subscribe((response:any) =>{
        this.category=response;
        this.productToAdd.categoryId=this.categoryId;
        if (this.productId){
          this.getProductDetails(this.productId);
        }
        if (!(this.category.type=="tray")){
          this.getAllIngredients();
        }
      })
    }
  }
  getAllIngredients(){
    this.ingredientService.getAllByTypeCategories(['ingredienti']).subscribe((response:any) => {
      this.ingredientNames=response;
    });
  }
  getProductDetails(event: any) {
    switch (this.category.type) {
      case 'productKg':
        this.productService.getByIdKg(event).subscribe((response:any) =>{
          this.productToAdd=response;
          this.pricePerKg=parseFloat(response.pricePerKg.replace('€ ', ''));
          this.productToAdd.pricePerKg =this.pricePerKg;
          this.minWeight=this.productToAdd.weightRange.minWeight;
          this.maxWeight=this.productToAdd.weightRange.maxWeight;
          this.selectedIngredients=response.ingredients;
        })
        break;
      case 'productWeighted':
        this.productService.getByIdWeighted(event).subscribe((response:any) =>{
          this.productToAdd=response;
          this.weight=parseFloat(response.weight.replace('Kg ', ''));
          this.productToAdd.weight =this.weight;
          this.selectedIngredients=response.ingredients;
        })
        break;
      case 'tray':
        this.productService.getByIdTray(event).subscribe((response:any) =>{
          this.productToAdd=response;
          this.productToAdd.measures=response.measuresList;
          this.measure = this.productToAdd.measures.slice();
          this.i = this.measure.length;
          this.measure[this.i] = { label: '', weight: 0 };
          this.pricePerKg=this.productToAdd.pricePerKg;
        })
        break;
    }
  }

  close() {

    this.modalService.openModal(
      'Procedendo in questo modo si perderanno i dati inseriti. Continuare?',
      '',
      'Annulla',
      'Conferma',
      {
        size: 'md',
        onConfirm: (() => {
          this.router.navigate(['../dashboard/prodotti']);
        })
      });
  }

  closeIconClicked(index: number) {
    this.selectedIngredients.splice(index, 1); // Rimuove solo la chip specifica
  }


  onInputChangeProduct(event: any, type: string, index?:number) {
      switch (type) {
        case 'name':
          this.productToAdd.name = event.target.value;
          break;
        case 'weight':
          this.productToAdd.weight = event.target.value;
          break;
        case 'description':
          this.productToAdd.description = event.target.value;
          break;
        case 'pricePerKg':
          this.productToAdd.pricePerKg = event.target.value;
          break;
        case 'minWeight':
          this.productToAdd.weightRange.minWeight= event.target.value;
          this.minWeight=this.productToAdd.weightRange.minWeight;
          break;
        case 'maxWeight':
          this.productToAdd.weightRange.maxWeight= event.target.value;
          this.maxWeight=this.productToAdd.weightRange.maxWeight;
          break;
        case 'labelMeasure':
          this.measure[index ?? 0].label= event.target.value;
          break;
        case 'weightMeasure':
          this.measure[index ?? 0].weight= event.target.value;
          break;
      }
  }

  toggleIngredient(ingredient: any) {
    if(!this.selectedIngredients.includes(ingredient.name)){
      const index = this.selectedIngredients.indexOf(ingredient);
      if (index !== -1) {
        this.selectedIngredients.splice(index, 1);
      } else {
        this.selectedIngredients.push(ingredient.name);
      }
    }
  }
  async insertIngredientFoundByName(): Promise<string[]> {
    const promises = this.selectedIngredients.map(name => {
      return new Promise<string>((resolve, reject) => {
        this.ingredientService.getByName(name).subscribe(
          (response: any) => {
            resolve(response.id as string); // type assertion
          },
          error => {
            reject(error);
          }
        );
      });
    });

    try {
      const ingredientIds = await Promise.all(promises);
      return ingredientIds;
    } catch (error) {
      console.error("Errore nel recupero degli ingredienti:", error);
      throw error; // Gestisci l'errore in base alle tue esigenze
    }
  }


  async saveNewProduct() {
    switch(this.category.type){
      case 'productWeighted':
        if (this.isValid()) {
          this.productToAdd.ingredientIds = await this.insertIngredientFoundByName();
          this.productService.saveWeighted(this.productToAdd).subscribe({
            error: () => {
              this.toastrService.error("Errore nel salvataggio del prodotto!");
            },
            complete: () => {
              this.toastrService.success("Prodotto salvato con successo");
              this.router.navigate(['../dashboard/prodotti']);
            }
          })
        } else {
          this.toastrService.error("Non tutti i campi sono validi!");
        }
        break;
      case 'productKg':
        this.productToAdd.ingredientIds=await this.insertIngredientFoundByName();
        this.productService.saveKg(this.productToAdd).subscribe({
          error: () => {
            this.toastrService.error("Errore nel salvataggio del prodotto!");
          },
          complete: () => {
            this.toastrService.success("Prodotto salvato con successo");
            this.router.navigate(['../dashboard/prodotti']);
          }
        })
        break;
      case 'tray':
        this.productService.saveTray(this.productToAdd).subscribe({
          error: () => {
            this.toastrService.error("Errore nel salvataggio del prodotto!");
          },
          complete: () => {
            this.toastrService.success("Prodotto salvato con successo");
            this.router.navigate(['../dashboard/prodotti']);
          }
        })    }
  }

  changeCustomized() {
    this.productToAdd.customized=!this.productToAdd.customized;
  }

  private isValid(){
    return this.productToAdd.name && this.selectedIngredients.length>0 && this.productToAdd.weight>0;
  }

  addMeasure() {
    if (this.measure[this.i] && this.measure[this.i].label !== '' && this.measure[this.i].weight > 0) {
      this.productToAdd.measures.push({...this.measure[this.i]}); // Creare una copia dell'oggetto
      this.i++;
      this.measure[this.i] = { label: '', weight: 0 };
    } else {
      this.toastrService.error("Misura incompleta");
    }
  }

  clearMeasureValue() {
    this.measure[this.i]= {label: '',weight: 0};
  }
  deleteMeasureValue(i: number) {
    if (i >= 0 && i < this.measure.length) {
      this.productToAdd.measures.splice(i, 1);
      this.measure.splice(i, 1);
      this.measure[this.i] = { label: '', weight: 0 };
    }
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ChipTheme = ChipTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
}

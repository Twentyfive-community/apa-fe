import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ButtonSizeTheme, ButtonTheme, ChipTheme, InputTheme, LabelTheme} from "twentyfive-style";
import {TwentyfiveModalService} from "twentyfive-modal";
import {Category} from "../../../../models/Category";
import {CategoryService} from "../../../../services/category.service";
import {ProductService} from "../../../../services/product.service";
import {ProductToEdit} from "../../../../models/Product";
import {IngredientService} from "../../../../services/ingredient.service";
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../../../environments/environment";
import {cloneDeep, isEqual} from "lodash";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {
  @ViewChild('dropZone') dropZoneRef!: ElementRef;
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  navigationType: 'back' | 'save' | null = null;

  categoryId: string | null;
  productId: string | null;

  file: File | null;

  test: string = '';

  category: Category = new Category();

  productToAdd: ProductToEdit = new ProductToEdit();

  originalProduct: ProductToEdit = new ProductToEdit();
  originalMeasure: { label: string, weight: number }[] = [
    {label: '', weight: 0}
  ];
  ingredientNames: any = [];
  selectedIngredients: string[] = [];

  pricePerKg = 0;
  weight = 0;
  minWeight = 0;
  maxWeight = 0;
  measure: { label: string, weight: number }[] = [
    {label: '', weight: 0}
  ];
  i = 0;
  constructor(private router: Router,
              private modalService: TwentyfiveModalService,
              private toastrService: ToastrService,
              private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private categoryService: CategoryService,
              public ingredientService: IngredientService) {
  }

  ngOnInit(): void {
    this.categoryId = this.activatedRoute.snapshot.queryParamMap.get('categoryId');
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.categoryService.getById(this.categoryId).subscribe((response: any) => {
        this.category = response;
        if (this.productId) {
          this.getProductDetails(this.productId);
        } else {
          this.productToAdd.categoryId = this.categoryId;
          this.originalProduct.categoryId = this.categoryId;
        }
        if (!(this.category.type == "tray")) {
          this.getAllIngredients();
        }
      })
    }
  }

  getAllIngredients() {
    this.ingredientService.getAllByTypeCategories('ingredienti').subscribe((response: any) => {
      this.ingredientNames = response;
    });
  }

  getProductDetails(event: any) {
    switch (this.category.type) {
      case 'productKg':
        this.productService.getByIdKg(event).subscribe((response: any) => {
          this.productToAdd = response;
          this.originalProduct = cloneDeep(response);
          this.productToAdd.categoryId = this.categoryId;
          this.originalProduct.categoryId = this.categoryId;
          this.pricePerKg = parseFloat(response.pricePerKg.replace('€ ', ''));
          this.productToAdd.pricePerKg = this.pricePerKg;
          this.originalProduct.pricePerKg = cloneDeep(this.pricePerKg);
          this.minWeight = this.productToAdd.weightRange.minWeight;
          this.maxWeight = this.productToAdd.weightRange.maxWeight;
          this.selectedIngredients = response.ingredients;
        })
        break;
      case 'productWeighted':
        this.productService.getByIdWeighted(event).subscribe((response: any) => {
          this.productToAdd = response;
          this.originalProduct = cloneDeep(response);
          this.productToAdd.categoryId = this.categoryId;
          this.originalProduct.categoryId = this.categoryId;
          this.weight = parseFloat(response.weight.replace('Kg ', ''));
          this.productToAdd.weight = this.weight;
          this.originalProduct.weight = cloneDeep(this.weight);
          this.selectedIngredients = response.ingredients;
        })
        break;
      case 'tray':
        this.productService.getByIdTray(event).subscribe((response: any) => {
          this.productToAdd = response;
          this.originalProduct = cloneDeep(response);
          this.originalProduct.measures = cloneDeep(response.measuresList);
          this.productToAdd.categoryId = this.categoryId;
          this.originalProduct.categoryId = this.categoryId;
          this.productToAdd.measures = response.measuresList;
          this.measure = this.productToAdd.measures.slice();
          this.originalMeasure = cloneDeep(this.originalProduct.measures);
          this.i = this.measure.length;
          this.measure[this.i] = {label: '', weight: 0};
          this.originalMeasure[this.i] = {label: '', weight: 0};
          this.pricePerKg = this.productToAdd.pricePerKg;
        })
        break;
    }
  }

  close() {
          this.navigationType="back";
          this.router.navigate(['../dashboard/prodotti'], {queryParams: {activeTab: this.categoryId}});
  }

  closeIconClicked(index: number) {
    this.selectedIngredients.splice(index, 1); // Rimuove solo la chip specifica
  }


  onInputChangeProduct(event: any, type: string, index?: number) {
    switch (type) {
      case 'name':
        this.productToAdd.name = event.target.value;
        break;
      case 'weight':
        this.productToAdd.weight = Number(event.target.value);
        break;
      case 'description':
        this.productToAdd.description = event.target.value;
        break;
      case 'pricePerKg':
        this.productToAdd.pricePerKg = Number(event.target.value);
        break;
      case 'minWeight':
        this.productToAdd.weightRange.minWeight = Number(event.target.value);
        this.minWeight = this.productToAdd.weightRange.minWeight;
        break;
      case 'maxWeight':
        this.productToAdd.weightRange.maxWeight = Number(event.target.value);
        this.maxWeight = this.productToAdd.weightRange.maxWeight;
        break;
      case 'labelMeasure':
        this.measure[index ?? 0].label = event.target.value;
        break;
      case 'weightMeasure':
        this.measure[index ?? 0].weight = Number(event.target.value);
        break;
    }
  }

  toggleIngredient(ingredient: any) {
    if (!this.selectedIngredients.includes(ingredient.item.value)) {
      const index = this.selectedIngredients.indexOf(ingredient.item);
      if (index !== -1) {
        this.selectedIngredients.splice(index, 1);
      } else {
        this.selectedIngredients.push(ingredient.item.value);
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

  uploadImage() {
    this.productService.uploadPic(this.file!,this.productToAdd.name).subscribe();
    this.productToAdd.imageUrl = `${environment.ftpDownloadUrl}${this.productToAdd.name}`+'/'+`${this.file!.name}`;
  }


  async saveNewProduct() {
    this.navigationType="save"
    if (this.isValid()) {
      if (this.file) {
        await this.uploadImage();
      }
      switch (this.category.type) {
        case 'productWeighted':
          if (this.isValid()) {
            this.productToAdd.ingredientIds = await this.insertIngredientFoundByName();
            this.productService.saveWeighted(this.productToAdd).subscribe({
              error: (errorResponse) => {
                if (errorResponse.error.status === 'NOT_ACCEPTABLE') { // Controlla lo status code per l'errore specifico
                  this.toastrService.error("Esiste già un prodotto con questo nome!");
                }
              },
              complete: () => {
                this.toastrService.success("Prodotto salvato con successo");
                this.router.navigate(['../dashboard/prodotti'], {queryParams: {activeTab: this.categoryId}});
              }
            })
          }
          break;
        case 'productKg':
          this.productToAdd.ingredientIds = await this.insertIngredientFoundByName();
          this.productService.saveKg(this.productToAdd).subscribe({
            error: (errorResponse) => {
              if (errorResponse.error.status === 'NOT_ACCEPTABLE') { // Controlla lo status code per l'errore specifico
                this.toastrService.error("Esiste già un prodotto con questo nome!");
              }
            },
            complete: () => {
              this.toastrService.success("Prodotto salvato con successo");
              this.router.navigate(['../dashboard/prodotti'], {queryParams: {activeTab: this.categoryId}});
            }
          })
          break;
        case 'tray':
          this.productService.saveTray(this.productToAdd).subscribe({
            error: (errorResponse) => {
              if (errorResponse.error.status === 'NOT_ACCEPTABLE') { // Controlla lo status code per l'errore specifico
                this.toastrService.error("Esiste già un prodotto con questo nome!");
              }
            },
            complete: () => {
              this.toastrService.success("Prodotto salvato con successo");
              this.router.navigate(['../dashboard/prodotti'], {queryParams: {activeTab: this.categoryId}});
            }
          })
          break;
      }
    }
  }

  private isValid() {
    if (!this.productToAdd.name) {
      this.toastrService.error("Inserire un nome valido al prodotto!");
      return false;
    }
    switch (this.category.type) {
      case "productKg":
        if (this.selectedIngredients.length == 0 && this.productToAdd.name != "Torta Personalizzata") {
          this.toastrService.error("Inserire almeno un ingrediente!");
          return false;
        }
        if (!(this.productToAdd.pricePerKg) || this.productToAdd.pricePerKg <= 0) {
          this.toastrService.error("Il prezzo non può essere inferiore o uguale a 0!");
          return false;
        }
        if (!(this.productToAdd.weightRange.minWeight) || this.productToAdd.weightRange.minWeight <= 0) {
          this.toastrService.error("Il peso minimo non può essere inferiore o uguale a 0!");
          return false;
        }
        if (!(this.productToAdd.weightRange.maxWeight) || this.productToAdd.weightRange.maxWeight < this.productToAdd.weightRange.minWeight) {
          this.toastrService.error("Il peso massimo non può essere inferiore al peso minimo!");
          return false;
        }
        break;
      case "productWeighted":
        if (!(this.selectedIngredients.length > 0)) {
          this.toastrService.error("Inserire almeno un ingrediente!");
          return false;
        }
        if (!(this.productToAdd.weight) || this.productToAdd.weight <= 0) {
          this.toastrService.error("Il peso non può essere minore o uguale a 0!");
        }
        break;
      case "tray":
        if (!(this.productToAdd.pricePerKg) || this.productToAdd.pricePerKg <= 0) {
          this.toastrService.error("Il prezzo non può essere inferiore o uguale a 0!");
          return false;
        }
        if (!(this.productToAdd.measures) || this.productToAdd.measures.length == 0) {
          this.toastrService.error("Inserire almeno una misura!");
          return false;
        }
        for (let i = 0; i < this.productToAdd.measures.length; i++) {
          if (this.productToAdd.measures[i].label == '') {
            this.toastrService.error("Una delle misure ha un nome incompleto!");
            return false;
          }
          if (this.productToAdd.measures[i].weight <= 0) {
            this.toastrService.error("Una delle misure ha il peso minore o uguale a 0!");
            return false;
          }
        }
        break;
    }
    return true;
  }

  addMeasure() {
    if (this.measure[this.i] && this.measure[this.i].label !== '' && this.measure[this.i].weight > 0) {
      this.productToAdd.measures.push({...this.measure[this.i]}); // Creare una copia dell'oggetto
      this.i++;
      this.measure[this.i] = {label: '', weight: 0};
    } else {
      this.toastrService.error("Misura incompleta");
    }
  }

  clearMeasureValue() {
    this.measure[this.i] = {label: '', weight: 0};
  }

  deleteMeasureValue(i: number) {
    if (i >= 0 && i < this.measure.length) {
      this.productToAdd.measures.splice(i, 1);
      this.measure.splice(i, 1);
      this.measure[this.i] = {label: '', weight: 0};
    }
  }

  delete() {
    switch (this.category.type){
      case 'productKg':
        this.modalService.openModal(
          `ATTENZIONE! Procedendo si andra' ad eliminare definitivamente il prodotto "${this.productToAdd.name}" ! Procedere?`,
          'Cancella Prodotto',
          'Annulla',
          'Conferma',
          {
            showIcon: true,
            size: 'md',
            onConfirm: (() => {
              this.productService.deleteByIdKg(this.productId!).subscribe({
                error:(err) =>{
                  console.error(err);
                  this.toastrService.error('Errore nell\'eliminare il prodotto!');
                },
                complete:() => {
                  this.toastrService.success('Prodotto eliminato con successo!');
                  this.router.navigate(['../dashboard/prodotti'], { queryParams: { activeTab: this.categoryId } });
                }
              })
            })
          });
        break;
      case 'productWeighted':
        this.modalService.openModal(
          `ATTENZIONE! Procedendo si andra' ad eliminare definitivamente il prodotto "${this.productToAdd.name}" ! Procedere?`,
          'Cancella Prodotto',
          'Annulla',
          'Conferma',
          {
            showIcon: true,
            size: 'md',
            onConfirm: (() => {
              this.productService.deleteByIdWeighted(this.productId!).subscribe({
                error:(err) =>{
                  console.error(err);
                  this.toastrService.error('Errore nell\'eliminare il prodotto!');
                },
                complete:() => {
                  this.toastrService.success('Prodotto eliminato con successo!');
                  this.router.navigate(['../dashboard/prodotti'], { queryParams: { activeTab: this.categoryId } });
                }
              })
            })
          });
        break;
      case 'tray':
        this.modalService.openModal(
          `ATTENZIONE! Procedendo si andra' ad eliminare definitivamente il vassoio "${this.productToAdd.name}" ! Procedere?`,
          'Cancella Vassoio',
          'Annulla',
          'Conferma',
          {
            showIcon: true,
            size: 'md',
            onConfirm: (() => {
              this.productService.deleteByIdTray(this.productId!).subscribe({
                error:(err) =>{
                  console.error(err);
                  this.toastrService.error('Errore nell\'eliminare il vassoio!');
                },
                complete:() => {
                  this.toastrService.success('Vassoio eliminato con successo!');
                  this.router.navigate(['../dashboard/prodotti'], { queryParams: { activeTab: this.categoryId } });
                }
              })
            })
          });
        break;
    }
  }

  hasChanges(): boolean {
    return !isEqual(this.productToAdd,this.originalProduct);
  }
    handleDragOver(event: DragEvent) {
    event.preventDefault(); // Impedisce il comportamento predefinito del browser
  }

  handleDrop(event: DragEvent) {
    event.preventDefault(); // Impedisce il comportamento predefinito del browser
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList) {
    this.file = files[0];
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.file = null;
    this.productToAdd.imageUrl = '';
    // Reimposta il valore dell'input del file a null per consentire la selezione dello stesso file
    this.fileInputRef.nativeElement.value = '';
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ChipTheme = ChipTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly LabelTheme = LabelTheme;
  protected readonly InputTheme = InputTheme;
}

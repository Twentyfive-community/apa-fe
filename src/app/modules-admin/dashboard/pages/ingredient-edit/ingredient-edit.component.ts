import {Component, OnInit} from '@angular/core';
import {ButtonSizeTheme, ButtonTheme, ChipTheme} from "twentyfive-style";
import {IngredientService} from "../../../../services/ingredient.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TwentyfiveModalService} from "twentyfive-modal";
import {ToastrService} from "ngx-toastr";
import {Allergen, Ingredient, IngredientToSave} from "../../../../models/Ingredient";
import {AllergenService} from "../../../../services/allergen.service";

@Component({
  selector: 'app-ingredient-edit',
  templateUrl: './ingredient-edit.component.html',
  styleUrl: './ingredient-edit.component.scss'
})
export class IngredientEditComponent implements OnInit{

  categoryId: string | null;
  ingredient: Ingredient = new Ingredient()
  ingredientToSave: IngredientToSave = new IngredientToSave()
  ingredientId: string | null;

  allergens: Allergen[] = []
  selectedAllergens: Allergen[] = []
  selectedAllergensNames: string[] = []


  ngOnInit(): void {
    this.ingredientId=this.activatedRoute.snapshot.paramMap.get('id');
    this.categoryId = this.activatedRoute.snapshot.queryParamMap.get('activeTab');
    this.getAllergens();
    this.getIngredientDetails()

  }

  constructor(private ingredientService: IngredientService,
              private router: Router,
              private modalService: TwentyfiveModalService,
              private toastrService: ToastrService,
              private activatedRoute: ActivatedRoute,
              private allergenService: AllergenService) {
  }

  onInputChange(event: any, type: string) {
    switch (type) {
      case 'name':
        this.ingredient.name = event.target.value;
        this.ingredientToSave.name=this.ingredient.name
        break;
      case 'note':
        this.ingredient.note = event.target.value;
        this.ingredientToSave.description=this.ingredient.note
        break;
    }
  }

  closeChip(allergenToRemove: Allergen){
    this.selectedAllergens = this.selectedAllergens.filter(allergen => allergen !== allergenToRemove);
    this.selectedAllergensNames = this.selectedAllergensNames.filter(allergen => allergen !== allergenToRemove.name)
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
          this.router.navigate(['../dashboard/ingredienti']);
        })
      });
  }


  getAllergens(){
    this.allergenService.getAll().subscribe((response:any)=>{
      this.allergens=response;
    })
  }

  getIngredientDetails(){
    if(this.ingredientId!=null){
      this.ingredientService.getIngredientById(this.ingredientId).subscribe( (res:any) => {
        this.ingredient = res
        this.ingredientToSave.id = this.ingredientId!
        this.ingredientToSave.name = this.ingredient.name
        this.ingredientToSave.description = this.ingredient.note
        this.ingredientToSave.categoryId = this.ingredient.idCategory
        this.ingredientToSave.active = this.ingredient.active
        this.ingredientToSave.alcoholic = this.ingredient.alcoholic
        for (const allergen of this.ingredient.allergens) {
        this.selectedAllergensNames.push(allergen.name)
        this.selectedAllergens.push(allergen);
        }
      })
      console.log(this.selectedAllergens);
    }
  }


  saveNewIngredient(){

    this.ingredientToSave.categoryId=this.categoryId!;
    this.ingredientToSave.allergenNames=this.selectedAllergensNames;
    this.ingredientToSave.alcoholic=this.ingredient.alcoholic;
    console.log(this.ingredientToSave);
    this.ingredientService.saveIngredient(this.ingredientToSave).subscribe({
      error:() =>{
        this.toastrService.error("Errore nel salvare l'ingrediente");
      },
      complete:() =>{
        this.toastrService.success("Ingrediente salvato con successo");
        this.router.navigate(['../dashboard/ingredienti']);
      }
    });
  }

  toggleAllergen(allergen: any) {
    if(!this.selectedAllergens.includes(allergen) && !this.selectedAllergensNames.includes(allergen.name)){
      const index = this.selectedAllergens.indexOf(allergen);
      if (index !== -1) {
        // Rimuovi l'allergene dalla lista degli allergeni selezionati
        this.selectedAllergens.splice(index, 1);
        this.selectedAllergensNames.splice(index, 1);
      } else {
        // Aggiungi l'allergene alla lista degli allergeni selezionati
        this.selectedAllergens.push(allergen);
        this.selectedAllergensNames.push(allergen.name)
      }
    }
  }

  changeAlcholic(){
    if(!this.ingredient.alcoholic)
      this.ingredient.alcoholic=true;
    else
      this.ingredient.alcoholic=false;
  }


  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;


  protected readonly ChipTheme = ChipTheme;
}

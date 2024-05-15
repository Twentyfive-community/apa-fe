import { Component, OnInit } from '@angular/core';
import { ButtonSizeTheme, ButtonTheme, ChipTheme } from "twentyfive-style";
import { IngredientService } from "../../../../services/ingredient.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TwentyfiveModalService } from "twentyfive-modal";
import { ToastrService } from "ngx-toastr";
import { Ingredient, IngredientToSave } from "../../../../models/Ingredient";
import { AllergenService } from "../../../../services/allergen.service";
import { Allergen } from "../../../../models/Allergen";

@Component({
  selector: 'app-ingredient-edit',
  templateUrl: './ingredient-edit.component.html',
  styleUrl: './ingredient-edit.component.scss'
})
export class IngredientEditComponent implements OnInit {

  categoryId: string | null;
  ingredient: Ingredient = new Ingredient();
  originalIngredient: Ingredient = new Ingredient();  // Initialized with empty strings
  ingredientToSave: IngredientToSave = new IngredientToSave();
  ingredientId: string | null;

  allergens: Allergen[] = [];
  selectedAllergens: Allergen[] = [];
  selectedAllergensNames: string[] = [];

  constructor(
    private ingredientService: IngredientService,
    private router: Router,
    private modalService: TwentyfiveModalService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private allergenService: AllergenService
  ) { }

  ngOnInit(): void {
    this.categoryId = this.activatedRoute.snapshot.queryParamMap.get('activeTab');
    this.ingredientId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.ingredientId) {
      this.getAllergens();
      this.getIngredientDetails();
    } else {
      this.initializeIngredient();
      this.getAllergens(); // Ensure allergens are initialized even when creating a new ingredient
    }
  }

  initializeIngredient() {
    this.ingredient.name = '';
    this.ingredient.alcoholic = false;
    this.ingredient.note = '';
    this.ingredient.allergens = [];
    this.originalIngredient = { ...this.ingredient }; // Copy initial state
  }

  onInputChange(event: any, type: string) {
    switch (type) {
      case 'name':
        this.ingredient.name = event.target.value;
        break;
      case 'note':
        this.ingredient.note = event.target.value;
        break;
    }
  }

  closeChip(allergenToRemove: Allergen) {
    this.selectedAllergens = this.selectedAllergens.filter(allergen => allergen !== allergenToRemove);
    this.selectedAllergensNames = this.selectedAllergensNames.filter(allergen => allergen !== allergenToRemove.name);
  }

  close() {
    if (this.hasChanges()) {
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
    } else {
      this.router.navigate(['../dashboard/ingredienti']);
    }
  }

  getAllergens() {
    this.allergenService.getAll().subscribe((response: any) => {
      this.allergens = response;
    });
  }

  getIngredientDetails() {
    if (this.ingredientId != null) {
      this.ingredientService.getIngredientById(this.ingredientId).subscribe((res: any) => {
        this.ingredient = res;
        this.originalIngredient = { ...res }; // Save a copy of the original ingredient data
        this.originalIngredient.allergens = res.allergens || []; // Ensure allergens is an array
        for (const allergen of this.ingredient.allergens) {
          this.selectedAllergensNames.push(allergen.name);
          this.selectedAllergens.push(allergen);
        }
      });
    }
  }

  saveNewIngredient() {
    this.ingredientToSave.id = this.ingredientId!;
    this.ingredientToSave.categoryId = this.categoryId!;
    this.ingredientToSave.name = this.ingredient.name;
    this.ingredientToSave.description = this.ingredient.note;
    this.ingredientToSave.alcoholic = this.ingredient.alcoholic;
    this.ingredientToSave.active = this.ingredient.active;
    this.ingredientToSave.allergenNames = this.selectedAllergensNames;
    console.log(this.ingredientToSave);
    this.ingredientService.saveIngredient(this.ingredientToSave).subscribe({
      error: () => {
        this.toastrService.error("Errore nel salvare l'ingrediente");
      },
      complete: () => {
        this.toastrService.success("Ingrediente salvato con successo");
        this.router.navigate(['../dashboard/ingredienti']);
      }
    });
  }

  toggleAllergen(allergen: any) {
    const index = this.selectedAllergens.indexOf(allergen);
    if (index !== -1) {
      // Rimuovi l'allergene dalla lista degli allergeni selezionati
      this.selectedAllergens.splice(index, 1);
      this.selectedAllergensNames.splice(this.selectedAllergensNames.indexOf(allergen.name), 1);
    } else {
      // Aggiungi l'allergene alla lista degli allergeni selezionati
      this.selectedAllergens.push(allergen);
      this.selectedAllergensNames.push(allergen.name);
    }
  }

  changeAlcholic() {
    this.ingredient.alcoholic = !this.ingredient.alcoholic;
  }

  hasChanges(): boolean {
    return this.ingredient.name !== this.originalIngredient.name ||
      this.ingredient.note !== this.originalIngredient.note ||
      this.ingredient.alcoholic !== this.originalIngredient.alcoholic ||
      this.ingredient.active !== this.originalIngredient.active ||
      JSON.stringify(this.selectedAllergensNames) !== JSON.stringify(this.originalIngredient.allergens.map(a => a.name));
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ChipTheme = ChipTheme;
}

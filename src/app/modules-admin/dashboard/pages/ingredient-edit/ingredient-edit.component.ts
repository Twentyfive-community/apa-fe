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

  navigationType: 'back' | 'save' | null = null;

  activeTab: string | null;
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
    this.activeTab = this.activatedRoute.snapshot.queryParamMap.get('activeTab');
    this.ingredientId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.ingredientId) {
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
    this.selectedAllergens = this.selectedAllergens.filter(allergen => allergen.id !== allergenToRemove.id);
    this.selectedAllergensNames = this.selectedAllergensNames.filter(name => name !== allergenToRemove.name);
    this.allergens.push(allergenToRemove); // Re-add the allergen to the available list
  }

  close() {
    this.navigationType="back"
    this.router.navigate(['../dashboard/ingredienti'], { queryParams: { activeTab: this.activeTab } });
  }

  getAllergens() {
    this.allergenService.getAll().subscribe((response: any) => {
      this.allergens = response.filter((allergen: Allergen) =>
        !this.selectedAllergens.some(selected => selected.id === allergen.id));
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
        this.getAllergens(); // Ensure allergens list is updated after setting selected allergens
      });
    }
  }

  saveNewIngredient() {
    this.ingredientToSave.id = this.ingredientId!;
    this.ingredientToSave.categoryId = this.activeTab!;
    this.ingredientToSave.name = this.ingredient.name;
    this.ingredientToSave.description = this.ingredient.note;
    this.ingredientToSave.alcoholic = this.ingredient.alcoholic;
    this.ingredientToSave.active = this.ingredient.active;
    this.ingredientToSave.allergenNames = this.selectedAllergensNames;
    this.navigationType="save"
    if(this.isValid()) {
      this.ingredientService.saveIngredient(this.ingredientToSave).subscribe({
        error: () => {
          this.toastrService.error("Errore nel salvare l'ingrediente");
        },
        complete: () => {
          this.toastrService.success("Ingrediente salvato con successo");
          this.router.navigate(['../dashboard/ingredienti'], { queryParams: { activeTab: this.activeTab } });
        }
      });
    } else {
      this.toastrService.error("Non tutti i campi sono validi!");
    }
  }

  delete() {
    this.modalService.openModal(
      `ATTENZIONE! Procedendo si andra' ad eliminare definitivamente l'ingrediente ${this.ingredient.name}! Procedere?`,
      'Cancella Ingrediente',
      'Annulla',
      'Conferma',
      {
        showIcon: true,
        size: 'md',
        onConfirm: (() => {
          this.ingredientService.deleteById(this.ingredientId!).subscribe({
            error:(err) =>{
              console.error(err);
              this.toastrService.error('Errore nell\'eliminare l\'ingrediente!');
            },
            complete:() => {
              this.toastrService.success('Ingrediente eliminato con successo!');
              this.router.navigate(['../dashboard/ingredienti'], { queryParams: { activeTab: this.activeTab } });
            }
          })
        })
      });
  }
  toggleAllergen(allergen: Allergen) {
    const allergenId = allergen.id;
    const index = this.selectedAllergens.findIndex(a => a.id === allergenId);
    if (index === -1) {
      // Aggiungi l'allergene alla lista degli allergeni selezionati solo se non è già presente
      this.selectedAllergens.push(allergen);
      this.selectedAllergensNames.push(allergen.name);
      // Rimuovi l'allergene dalla lista degli allergeni disponibili
      this.allergens = this.allergens.filter(a => a.id !== allergen.id);
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

  private isValid(): boolean {
    return this.ingredientToSave.name != '';
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ChipTheme = ChipTheme;

}

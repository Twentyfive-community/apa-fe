import {Allergen} from "./Allergen";

export class Ingredient {
  id: string;
  name: string;
  allergens: Allergen[];
  idCategory: string;
  note: string;
  active: boolean = true ;
  alcoholic: boolean =false;
}

export class IngredientToSave{
  id: string;
  name: string;
  allergenNames: string[];
  categoryId: string;
  description: string;
  active: boolean;
  alcoholic: boolean = false;
  status: string;
  alcoholicString: string;

}

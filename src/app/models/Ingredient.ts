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
  active: boolean = true;
  alcoholic: boolean = false;
}

export class Allergen {
  id: string;
  name: string;
  iconUrl: string;
}

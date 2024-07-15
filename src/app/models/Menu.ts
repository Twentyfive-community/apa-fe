import {Allergen} from "./Allergen";

export class MenuSection {
    id:string;
    name:string;
    active:boolean = true;
}
export class MenuItem {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: string;
  allergens: Allergen[] ;
  imageUrl: string;
  active: boolean;
}

export class MenuItemToAdd {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: string;
  allergenNames: string[] ;
  imageUrl: string;
  active: boolean;
}

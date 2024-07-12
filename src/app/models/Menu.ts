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
  price: number;
  allergens: Allergen[] ;
  imageUrl: string;
}

export class MenuItemDetails {

}

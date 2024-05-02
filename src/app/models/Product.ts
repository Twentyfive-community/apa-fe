export class Product {
  id: string;
  name: string;
  ingredientIds: any[];
  description: string;
  categoryId: string;
  imageUrl: string;
  active: boolean;
}

export class ProductInPurchase {
  productId: string;
  name: string;
  weight: number;
  quantity: number;
  shape: string;
  customization: Map<string, string>;
  chocolateChips: boolean;
  text: string;
  attachment: string;
  deliveryDate: string;
  totalPrice: number;
}

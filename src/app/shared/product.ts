import { Tax } from "./tax";

export interface Product {
  productName: string;
  price: number;
  quantity: number;
  total: number;
  taxes: {
    tax: Tax[];
  };
}

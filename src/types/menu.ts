export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  isvegetarian: boolean;
  isspicy: boolean;
  category: string;
  menu_img?: string;
  quantity?: number;
  specialInstructions?: string;
  sold_out: boolean;
  square_variation_id?: string | null;
}

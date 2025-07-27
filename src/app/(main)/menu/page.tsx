import { Suspense } from 'react';
import MenuHeader from '@/components/menu/MenuHeader';
import MenuNotes from '@/components/menu/MenuNotes';
import MenuClient from './MenuClient';

// Static menu data for static export
const staticMenuItems = [
  {
    id: 1,
    name: "Chicken Dum Biryani",
    description: "Slow-cooked biryani with tender chicken pieces. Aromatic rice dish packed with traditional spices and flavors.",
    price: "11.99",
    isvegetarian: false,
    isspicy: true,
    category: "Biryani",
    menu_img: "/Menu_Images/chicken-dum-biryani.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 8,
    name: "Butter Chicken",
    description: "Creamy, mildly spiced chicken in a luxurious tomato-based sauce. Beloved North Indian comfort dish.",
    price: "11.99",
    isvegetarian: false,
    isspicy: false,
    category: "Non-Veg Curry",
    menu_img: "/Menu_Images/butter-chicken.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 24,
    name: "Aloo Samosa",
    description: "Classic potato-filled pastry triangles. Iconic Indian street food with a crispy exterior.",
    price: "4.99",
    isvegetarian: true,
    isspicy: false,
    category: "Snacks",
    menu_img: "/Menu_Images/aloo-samosa.jpeg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 5,
    name: "Veg Biryani",
    description: "Aromatic rice dish loaded with mixed vegetables. Flavorful and satisfying vegetarian biryani preparation.",
    price: "9.99",
    isvegetarian: true,
    isspicy: false,
    category: "Biryani",
    menu_img: "/Menu_Images/veg-biryani.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 15,
    name: "Parotta",
    description: "Thin, flaky layers of soft, golden-brown flatbread with a delightful chewiness.",
    price: "3.99",
    isvegetarian: true,
    isspicy: false,
    category: "Indian Breads",
    menu_img: "/Menu_Images/parotta.jpg",
    sold_out: false,
    square_variation_id: null
  }
];

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MenuHeader />
      <Suspense fallback={<div>Loading menu...</div>}>
        <MenuClient initialMenuItems={staticMenuItems} />
      </Suspense>
      <MenuNotes />
    </div>
  );
} 

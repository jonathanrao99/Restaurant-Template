import { Suspense } from 'react';
import MenuHeader from '@/components/menu/MenuHeader';
import MenuNotes from '@/components/menu/MenuNotes';
import MenuClient from './MenuClient';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Comprehensive static menu data for fallback
const staticMenuItems = [
  // Biryani Category
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
    id: 2,
    name: "Chicken 65 Biryani",
    description: "Spicy and tangy biryani with chicken 65 style preparation. Bold flavors with a kick of heat.",
    price: "12.99",
    isvegetarian: false,
    isspicy: true,
    category: "Biryani",
    menu_img: "/Menu_Images/chicken-65-biryani.jpeg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 3,
    name: "Paneer Biryani",
    description: "Rich and creamy biryani with fresh paneer cubes. Perfect for vegetarians who love rich flavors.",
    price: "10.99",
    isvegetarian: true,
    isspicy: false,
    category: "Biryani",
    menu_img: "/Menu_Images/paneer-biryani.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 4,
    name: "Mutton Biryani",
    description: "Traditional mutton biryani with tender goat meat. Rich and aromatic with authentic spices.",
    price: "13.99",
    isvegetarian: false,
    isspicy: true,
    category: "Biryani",
    menu_img: "/Menu_Images/mutton biryani.png",
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

  // Breakfast Category
  {
    id: 6,
    name: "Idly",
    description: "Soft and fluffy steamed rice cakes. Traditional South Indian breakfast served with sambhar and chutney.",
    price: "6.99",
    isvegetarian: true,
    isspicy: false,
    category: "Breakfast",
    menu_img: "/Menu_Images/idly.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 7,
    name: "Vada",
    description: "Crispy lentil fritters with a soft center. Perfect accompaniment to idly or dosa.",
    price: "5.99",
    isvegetarian: true,
    isspicy: false,
    category: "Breakfast",
    menu_img: "/Menu_Images/vada.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 8,
    name: "Idly Vada",
    description: "Combination of soft idly and crispy vada. Complete South Indian breakfast experience.",
    price: "8.99",
    isvegetarian: true,
    isspicy: false,
    category: "Breakfast",
    menu_img: "/Menu_Images/idly-vada.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 9,
    name: "Dosa",
    description: "Crispy rice and lentil crepe. Classic South Indian breakfast with sambhar and coconut chutney.",
    price: "7.99",
    isvegetarian: true,
    isspicy: false,
    category: "Breakfast",
    menu_img: "/Menu_Images/dosa.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 10,
    name: "Masala Dosa",
    description: "Dosa filled with spiced potato mixture. Hearty and satisfying breakfast option.",
    price: "8.99",
    isvegetarian: true,
    isspicy: false,
    category: "Breakfast",
    menu_img: "/Menu_Images/masala-dosa.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 11,
    name: "Mysore Masala Dosa",
    description: "Spicy dosa with red chutney and potato filling. Bold flavors for spice lovers.",
    price: "9.99",
    isvegetarian: true,
    isspicy: true,
    category: "Breakfast",
    menu_img: "/Menu_Images/mysore-masala-dosa.jpeg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 12,
    name: "Cheese Dosa",
    description: "Dosa filled with melted cheese. Rich and indulgent breakfast choice.",
    price: "10.99",
    isvegetarian: true,
    isspicy: false,
    category: "Breakfast",
    menu_img: "/Menu_Images/cheese-dosa.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 13,
    name: "Egg Dosa",
    description: "Dosa with beaten egg spread on top. Protein-rich breakfast option.",
    price: "9.99",
    isvegetarian: false,
    isspicy: false,
    category: "Breakfast",
    menu_img: "/Menu_Images/egg-dosa.jpeg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 14,
    name: "Paneer Dosa",
    description: "Dosa filled with spiced paneer. Vegetarian protein option for breakfast.",
    price: "10.99",
    isvegetarian: true,
    isspicy: false,
    category: "Breakfast",
    menu_img: "/Menu_Images/paneer-dosa.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 15,
    name: "Chole Poori",
    description: "Deep-fried bread served with spicy chickpea curry. Classic North Indian breakfast combination.",
    price: "7.99",
    isvegetarian: true,
    isspicy: true,
    category: "Breakfast",
    menu_img: "/Menu_Images/poori-chole.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 16,
    name: "Aloo Poori",
    description: "Deep-fried bread with spiced potato curry. Satisfying breakfast or meal option.",
    price: "8.99",
    isvegetarian: true,
    isspicy: false,
    category: "Breakfast",
    menu_img: "/Menu_Images/aloo-poori.jpeg",
    sold_out: false,
    square_variation_id: null
  },

  // Non-Veg Curry Category
  {
    id: 17,
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
    id: 18,
    name: "Chicken Curry",
    description: "Classic Indian chicken curry with aromatic spices. Tender chicken in a rich, flavorful gravy.",
    price: "10.99",
    isvegetarian: false,
    isspicy: true,
    category: "Non-Veg Curry",
    menu_img: "/Menu_Images/chicken-curry.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 19,
    name: "Chicken Tikka Masala",
    description: "Tender chicken tikka in a creamy, spiced tomato sauce. A British-Indian fusion favorite.",
    price: "12.99",
    isvegetarian: false,
    isspicy: false,
    category: "Non-Veg Curry",
    menu_img: "/Menu_Images/chicken-tikka-masala.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 20,
    name: "Mutton Curry",
    description: "Traditional goat meat curry with rich spices. Hearty and flavorful meat dish.",
    price: "12.99",
    isvegetarian: false,
    isspicy: true,
    category: "Non-Veg Curry",
    menu_img: "/Menu_Images/mutton-curry.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 21,
    name: "Chicken Wings",
    description: "Crispy chicken wings with spicy marinade. Perfect appetizer or snack.",
    price: "9.99",
    isvegetarian: false,
    isspicy: true,
    category: "Non-Veg Curry",
    menu_img: "/Menu_Images/chicken-wings.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 22,
    name: "Chicken Lollipop",
    description: "Spicy chicken lollipops with tangy sauce. Popular Indo-Chinese appetizer.",
    price: "10.99",
    isvegetarian: false,
    isspicy: true,
    category: "Non-Veg Curry",
    menu_img: "/Menu_Images/chicken-lollipop.jpeg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 23,
    name: "Chilli Chicken",
    description: "Spicy and tangy chicken with green chilies. Bold flavors with a kick.",
    price: "11.99",
    isvegetarian: false,
    isspicy: true,
    category: "Non-Veg Curry",
    menu_img: "/Menu_Images/chilli-chiken.jpg",
    sold_out: false,
    square_variation_id: null
  },

  // Veg Curry Category
  {
    id: 24,
    name: "Dal Tadka",
    description: "Classic tempered lentils with aromatic spices. Comforting and nutritious Indian staple.",
    price: "8.99",
    isvegetarian: true,
    isspicy: false,
    category: "Veg Curry",
    menu_img: "/Menu_Images/dal-tadka.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 25,
    name: "Bhindi Masala",
    description: "Spiced okra cooked with onions and tomatoes. Crispy and flavorful vegetarian delight.",
    price: "9.99",
    isvegetarian: true,
    isspicy: true,
    category: "Veg Curry",
    menu_img: "/Menu_Images/bhindi-masala.jpeg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 26,
    name: "Paneer Butter Masala",
    description: "Creamy paneer in rich tomato-based gravy. Vegetarian alternative to butter chicken.",
    price: "11.99",
    isvegetarian: true,
    isspicy: false,
    category: "Veg Curry",
    menu_img: "/Menu_Images/paneer-butter-masala.jpg",
    sold_out: false,
    square_variation_id: null
  },

  // Indian Breads Category
  {
    id: 27,
    name: "Parotta",
    description: "Thin, flaky layers of soft, golden-brown flatbread with a delightful chewiness.",
    price: "3.99",
    isvegetarian: true,
    isspicy: false,
    category: "Indian Breads",
    menu_img: "/Menu_Images/parotta.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 28,
    name: "Roti",
    description: "Whole wheat flatbread cooked on griddle. Healthy and traditional Indian bread.",
    price: "2.99",
    isvegetarian: true,
    isspicy: false,
    category: "Indian Breads",
    menu_img: "/Menu_Images/roti.jpg",
    sold_out: false,
    square_variation_id: null
  },

  // Chaat Category
  {
    id: 31,
    name: "Pani Puri",
    description: "Crispy puris filled with spiced potatoes and tangy tamarind water. Explosion of flavors.",
    price: "6.99",
    isvegetarian: true,
    isspicy: true,
    category: "Chaat",
    menu_img: "/Menu_Images/pani-puri.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 32,
    name: "Bhel Puri",
    description: "Crunchy puffed rice mixed with chutneys, vegetables, and sev. Refreshing street food.",
    price: "7.99",
    isvegetarian: true,
    isspicy: false,
    category: "Chaat",
    menu_img: "/Menu_Images/bhel-puri.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 33,
    name: "Dahi Puri",
    description: "Crispy puris topped with yogurt, chutneys, and spices. Cool and creamy chaat.",
    price: "7.99",
    isvegetarian: true,
    isspicy: false,
    category: "Chaat",
    menu_img: "/Menu_Images/dahi-puri.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 34,
    name: "Samosa Chat",
    description: "Crushed samosas topped with chutneys, yogurt, and spices. Hearty chaat option.",
    price: "8.99",
    isvegetarian: true,
    isspicy: true,
    category: "Chaat",
    menu_img: "/Menu_Images/samosa-chat.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 35,
    name: "Papdi Chaat",
    description: "Crispy papdis topped with potatoes, chutneys, and yogurt. Classic chaat preparation.",
    price: "7.99",
    isvegetarian: true,
    isspicy: false,
    category: "Chaat",
    menu_img: "/Menu_Images/papdi-chaat.jpg",
    sold_out: false,
    square_variation_id: null
  },

  // Snacks Category
  {
    id: 36,
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
    id: 37,
    name: "Chicken Samosa",
    description: "Spiced chicken-filled pastry triangles. Non-vegetarian twist on the classic samosa.",
    price: "5.99",
    isvegetarian: false,
    isspicy: true,
    category: "Snacks",
    menu_img: "/Menu_Images/chicken-samosa.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 38,
    name: "Onion Samosa",
    description: "Crispy samosas filled with spiced onions and herbs. Light and flavorful snack.",
    price: "4.49",
    isvegetarian: true,
    isspicy: false,
    category: "Snacks",
    menu_img: "/Menu_Images/onion-samosa.jpeg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 39,
    name: "Onion Pakoda",
    description: "Crispy onion fritters with gram flour. Perfect rainy day snack.",
    price: "4.99",
    isvegetarian: true,
    isspicy: false,
    category: "Snacks",
    menu_img: "/Menu_Images/onion-pakoda.jpeg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 40,
    name: "Chicken Pakoda",
    description: "Spicy chicken fritters with gram flour. Crispy and flavorful snack.",
    price: "5.99",
    isvegetarian: false,
    isspicy: true,
    category: "Snacks",
    menu_img: "/Menu_Images/chicken-pakoda.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 41,
    name: "Paneer Pakoda",
    description: "Crispy paneer fritters with gram flour. Vegetarian protein snack.",
    price: "5.99",
    isvegetarian: true,
    isspicy: false,
    category: "Snacks",
    menu_img: "/Menu_Images/paneer pakoda.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 42,
    name: "Palak Pakoda",
    description: "Spinach fritters with gram flour. Healthy and crispy snack option.",
    price: "4.99",
    isvegetarian: true,
    isspicy: false,
    category: "Snacks",
    menu_img: "/Menu_Images/palak-pakoda.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 43,
    name: "Mirchi Bajji",
    description: "Stuffed green chili fritters. Spicy and crispy street food.",
    price: "4.99",
    isvegetarian: true,
    isspicy: true,
    category: "Snacks",
    menu_img: "/Menu_Images/mirchi-bajji.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 44,
    name: "Mysore Bonda",
    description: "Spicy potato fritters with gram flour. South Indian snack specialty.",
    price: "4.99",
    isvegetarian: true,
    isspicy: true,
    category: "Snacks",
    menu_img: "/Menu_Images/mysore-bonda.jpg",
    sold_out: false,
    square_variation_id: null
  },

  // Chinese Non-Veg Category
  {
    id: 45,
    name: "Chicken Manchurian",
    description: "Indo-Chinese style chicken in spicy, tangy sauce. Perfect blend of Indian and Chinese flavors.",
    price: "11.99",
    isvegetarian: false,
    isspicy: true,
    category: "Chinese Non-Veg",
    menu_img: "/Menu_Images/chicken-manchurian.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 46,
    name: "Chicken Fried Rice/Noodles",
    description: "Fragrant Rice/Noodles stir-fried with chicken, vegetables, and soy sauce. Classic Chinese comfort food.",
    price: "10.99",
    isvegetarian: false,
    isspicy: false,
    category: "Chinese Non-Veg",
    menu_img: "/Menu_Images/chicken-fried-rice.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 47,
    name: "Egg Fried Rice/Noodles",
    description: "Fragrant Rice/Noodles stir-fried with eggs, vegetables, and soy sauce. Protein-rich Chinese dish.",
    price: "9.99",
    isvegetarian: false,
    isspicy: false,
    category: "Chinese Non-Veg",
    menu_img: "/Menu_Images/egg fried rice.webp",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 48,
    name: "Chilli Chicken",
    description: "Spicy chicken in sweet and spicy chilli sauce. Bold and fiery Chinese preparation.",
    price: "12.99",
    isvegetarian: false,
    isspicy: true,
    category: "Chinese Non-Veg",
    menu_img: "/Menu_Images/chilli-chiken.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 49,
    name: "Schezwan Egg Fried Rice/Noodles",
    description: "Spicy egg fried rice/noodles prepared in schezwan sauce. Protein-rich Chinese dish.",
    price: "10.99",
    isvegetarian: false,
    isspicy: true,
    category: "Chinese Non-Veg",
    menu_img: "/Menu_Images/schezwan-egg.jpg",
    sold_out: false,
    square_variation_id: null
  },

  // Chinese Veg Category
  {
    id: 50,
    name: "Paneer Manchurian",
    description: "Crispy paneer in spicy, tangy Indo-Chinese sauce. Vegetarian alternative to chicken manchurian.",
    price: "10.99",
    isvegetarian: true,
    isspicy: true,
    category: "Chinese Veg",
    menu_img: "/Menu_Images/paneer-manchurian.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 51,
    name: "Veg Fried Rice/Noodles",
    description: "Colorful Rice/Noodles stir-fried with fresh vegetables and soy sauce. Healthy and delicious.",
    price: "9.99",
    isvegetarian: true,
    isspicy: false,
    category: "Chinese Veg",
    menu_img: "/Menu_Images/veg-fried-rice.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 52,
    name: "Babycorn Manchurian",
    description: "Crispy baby corn in spicy, tangy sauce. Vegetarian Indo-Chinese appetizer.",
    price: "9.99",
    isvegetarian: true,
    isspicy: true,
    category: "Chinese Veg",
    menu_img: "/Menu_Images/babycorn-manchurian.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 53,
    name: "Gobi 65",
    description: "Spicy cauliflower fritters. Popular vegetarian appetizer with bold flavors.",
    price: "8.99",
    isvegetarian: true,
    isspicy: true,
    category: "Chinese Veg",
    menu_img: "/Menu_Images/gobi-65.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 54,
    name: "Schezwan Veg Rice/Noodles",
    description: "Spicy Rice/Noodles with vegetables in schezwan sauce. Fiery vegetarian Chinese dish.",
    price: "9.99",
    isvegetarian: true,
    isspicy: true,
    category: "Chinese Veg",
    menu_img: "/Menu_Images/schezwan-veg-noodles.jpg",
    sold_out: false,
    square_variation_id: null
  },

  // Drinks Category
  {
    id: 55,
    name: "Mango Lassi",
    description: "Sweet and creamy mango yogurt drink. Refreshing and traditional Indian beverage.",
    price: "4.99",
    isvegetarian: true,
    isspicy: false,
    category: "Drinks",
    menu_img: "/Menu_Images/mango-lassi.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 56,
    name: "Lassi",
    description: "Traditional sweet yogurt drink. Cooling and refreshing beverage.",
    price: "3.99",
    isvegetarian: true,
    isspicy: false,
    category: "Drinks",
    menu_img: "/Menu_Images/lassi.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 57,
    name: "Tea",
    description: "Traditional Indian masala chai. Warm and comforting beverage.",
    price: "2.99",
    isvegetarian: true,
    isspicy: false,
    category: "Drinks",
    menu_img: "/Menu_Images/tea.webp",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 58,
    name: "Coca Cola",
    description: "Classic carbonated soft drink. Refreshing beverage option.",
    price: "2.99",
    isvegetarian: true,
    isspicy: false,
    category: "Drinks",
    menu_img: "/Menu_Images/coca-cola.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 59,
    name: "Sprite",
    description: "Lemon-lime carbonated soft drink. Crisp and refreshing beverage.",
    price: "2.99",
    isvegetarian: true,
    isspicy: false,
    category: "Drinks",
    menu_img: "/Menu_Images/sprite.webp",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 60,
    name: "Thums Up",
    description: "Indian cola brand. Strong and flavorful carbonated drink.",
    price: "2.99",
    isvegetarian: true,
    isspicy: false,
    category: "Drinks",
    menu_img: "/Menu_Images/thums-up.jpeg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 61,
    name: "Frooti",
    description: "Mango-flavored juice drink. Sweet and tropical beverage.",
    price: "3.99",
    isvegetarian: true,
    isspicy: false,
    category: "Drinks",
    menu_img: "/Menu_Images/frooti.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 62,
    name: "Limca",
    description: "Lemon-lime flavored soft drink. Tangy and refreshing beverage.",
    price: "2.99",
    isvegetarian: true,
    isspicy: false,
    category: "Drinks",
    menu_img: "/Menu_Images/limca.jpg",
    sold_out: false,
    square_variation_id: null
  },

  // Sweets Category
  {
    id: 63,
    name: "Gulab Jamun",
    description: "Soft, spongy milk solids soaked in sugar syrup. Classic Indian dessert.",
    price: "5.99",
    isvegetarian: true,
    isspicy: false,
    category: "Sweets",
    menu_img: "/Menu_Images/gulab-jamun.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 64,
    name: "Rasmalai",
    description: "Soft cottage cheese patties in sweetened milk. Elegant and creamy dessert.",
    price: "6.99",
    isvegetarian: true,
    isspicy: false,
    category: "Sweets",
    menu_img: "/Menu_Images/rasmalai.webp",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 65,
    name: "Double Ka Meetha",
    description: "Bread pudding in sweet milk. Traditional Hyderabadi dessert.",
    price: "6.99",
    isvegetarian: true,
    isspicy: false,
    category: "Sweets",
    menu_img: "/Menu_Images/double-ka-meetha.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 66,
    name: "Sheer Khurma",
    description: "Vermicelli pudding with nuts and dates. Rich and festive dessert.",
    price: "7.99",
    isvegetarian: true,
    isspicy: false,
    category: "Sweets",
    menu_img: "/Menu_Images/sheer-khurma.jpg",
    sold_out: false,
    square_variation_id: null
  }
];

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MenuHeader />
      <Suspense fallback={
        <div className="min-h-screen bg-desi-cream flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading menu..." />
        </div>
      }>
        <MenuClient initialMenuItems={staticMenuItems} />
      </Suspense>
      <MenuNotes />
    </div>
  );
} 

import {
  Wheat,
  Beef,
  Droplets,
  PencilLine,
  Pill,
  CupSoda,
  Apple,
  SprayCan,
  Home,
  Baby,
  PawPrint,
  Plug,
  Dumbbell,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

import cerealsImg from "@/assets/categories/cereals-grains.jpg";
import butcheryImg from "@/assets/categories/butchery.jpg";
import sanitaryImg from "@/assets/categories/sanitary-essentials.jpg";
import stationeryImg from "@/assets/categories/stationery.jpg";
import pharmaImg from "@/assets/categories/pharmaceuticals.jpg";
import snacksImg from "@/assets/categories/snacks-drinks.jpg";
import personalCareImg from "@/assets/categories/personal-care.jpg";
import householdImg from "@/assets/categories/household-essentials.jpg";

export type Category = {
  slug: string;
  name: string;
  icon: LucideIcon;
  image?: string;
};

export const allCategoriesIcon = LayoutGrid;

export const categories: Category[] = [
  { slug: "cereals-grains", name: "Cereals & Grains", icon: Wheat, image: cerealsImg },
  { slug: "butchery", name: "Butchery", icon: Beef, image: butcheryImg },
  { slug: "sanitary-essentials", name: "Sanitary Essentials", icon: Droplets, image: sanitaryImg },
  { slug: "stationery", name: "Stationery", icon: PencilLine, image: stationeryImg },
  { slug: "pharmaceuticals", name: "Pharmaceuticals", icon: Pill, image: pharmaImg },
  { slug: "snacks-drinks", name: "Snacks & Drinks", icon: CupSoda, image: snacksImg },
  { slug: "fruits-vegetables", name: "Fruits & Vegetables", icon: Apple },
  { slug: "personal-care", name: "Personal Care", icon: SprayCan, image: personalCareImg },
  {
    slug: "household-essentials",
    name: "Household Essentials",
    icon: Home,
    image: householdImg,
  },
  { slug: "baby-care", name: "Baby Care", icon: Baby },
  { slug: "pet-supplies", name: "Pet Supplies", icon: PawPrint },
  { slug: "electronics", name: "Electronics", icon: Plug },
  { slug: "sports-fitness", name: "Sports & Fitness", icon: Dumbbell },
];

export const popularCategorySlugs = [
  "cereals-grains",
  "butchery",
  "sanitary-essentials",
  "stationery",
  "pharmaceuticals",
  "snacks-drinks",
  "personal-care",
  "household-essentials",
];

export type Shop = {
  slug: string;
  name: string;
  tagline: string;
  delivery: string;
  rating: number;
  verified: boolean;
  branch: string;
  /** Short branded text shown inside the logo tile, e.g. "QM" */
  logoText: string;
  /** Tailwind bg class for the logo tile */
  logoBg: string;
  /** Tailwind text class for the logo text */
  logoColor: string;
};

export const shops: Shop[] = [
  {
    slug: "quickmart",
    name: "QuickMart",
    tagline: "Everyday groceries & fresh produce",
    delivery: "20–40 mins",
    rating: 4.7,
    verified: true,
    branch: "Ruaraka Branch",
    logoText: "QM",
    logoBg: "bg-[#E31837]",
    logoColor: "text-white",
  },
  {
    slug: "chandarana",
    name: "Chandarana",
    tagline: "Imported goods & premium essentials",
    delivery: "25–45 mins",
    rating: 4.6,
    verified: true,
    branch: "Thika Road Mall",
    logoText: "CH",
    logoBg: "bg-[#00529B]",
    logoColor: "text-white",
  },
  {
    slug: "naivas",
    name: "Naivas",
    tagline: "Kenya's favourite supermarket",
    delivery: "15–35 mins",
    rating: 4.8,
    verified: true,
    branch: "Roysambu Branch",
    logoText: "NV",
    logoBg: "bg-[#FF6B00]",
    logoColor: "text-white",
  },
  {
    slug: "carrefour",
    name: "Carrefour",
    tagline: "Bulk shopping & household deals",
    delivery: "30–50 mins",
    rating: 4.5,
    verified: true,
    branch: "Garden City Mall",
    logoText: "CA",
    logoBg: "bg-[#004F9F]",
    logoColor: "text-white",
  },
  {
    slug: "goodlife-pharmacy",
    name: "Goodlife Pharmacy",
    tagline: "Licensed pharmacy & wellness",
    delivery: "20–40 mins",
    rating: 4.9,
    verified: true,
    branch: "Allsops Branch",
    logoText: "GL",
    logoBg: "bg-[#00843D]",
    logoColor: "text-white",
  },
  {
    slug: "campus-butchery",
    name: "Campus Butchery",
    tagline: "Fresh cuts, hostel-friendly portions",
    delivery: "15–30 mins",
    rating: 4.4,
    verified: true,
    branch: "KCA Gate B",
    logoText: "CB",
    logoBg: "bg-[#8B1A1A]",
    logoColor: "text-white",
  },
];

export type Product = {
  id: string;
  name: string;
  size: string;
  category: string;
  shop: string;
  price: number;
  wasPrice?: number;
  studentDeal?: boolean;
  inStock: boolean;
  prescriptionRequired?: boolean;
  description: string;
};

export const products: Product[] = [
  // Cereals & Grains
  {
    id: "p-001",
    name: "Pembe Maize Flour",
    size: "2 kg pack",
    category: "cereals-grains",
    shop: "naivas",
    price: 189,
    wasPrice: 215,
    studentDeal: true,
    inStock: true,
    description: "Fine sifted maize flour for smooth ugali — a hostel kitchen staple.",
  },
  {
    id: "p-002",
    name: "Pearl White Rice",
    size: "5 kg bag",
    category: "cereals-grains",
    shop: "quickmart",
    price: 890,
    inStock: true,
    description: "Long grain white rice, cooks fast and stretches across the week.",
  },
  {
    id: "p-003",
    name: "Weetabix Whole Wheat",
    size: "24 biscuits",
    category: "cereals-grains",
    shop: "chandarana",
    price: 640,
    inStock: true,
    description: "Quick breakfast cereal for early morning lectures.",
  },
  {
    id: "p-004",
    name: "Ndengu (Green Grams)",
    size: "1 kg",
    category: "cereals-grains",
    shop: "naivas",
    price: 240,
    inStock: true,
    description: "Cleaned green grams, high protein and budget friendly.",
  },
  {
    id: "p-005",
    name: "Jogoo Porridge Flour",
    size: "1 kg",
    category: "cereals-grains",
    shop: "carrefour",
    price: 165,
    inStock: true,
    description: "Multi-grain porridge flour, fortified with vitamins.",
  },
  // Butchery
  {
    id: "p-010",
    name: "Beef Sirloin Cuts",
    size: "500 g",
    category: "butchery",
    shop: "campus-butchery",
    price: 375,
    inStock: true,
    description: "Fresh sirloin trimmed into stew-ready cuts, packed same day.",
  },
  {
    id: "p-011",
    name: "Goat Meat Mixed Cuts",
    size: "1 kg",
    category: "butchery",
    shop: "campus-butchery",
    price: 720,
    inStock: true,
    description: "Bone-in goat meat, ideal for weekend nyama choma.",
  },
  {
    id: "p-012",
    name: "Kenchic Chicken Drumsticks",
    size: "700 g",
    category: "butchery",
    shop: "naivas",
    price: 495,
    wasPrice: 560,
    studentDeal: true,
    inStock: true,
    description: "Chilled drumsticks, portioned for two to three meals.",
  },
  {
    id: "p-013",
    name: "Beef Minced Meat",
    size: "500 g",
    category: "butchery",
    shop: "quickmart",
    price: 340,
    inStock: false,
    description: "Lean minced beef for quick pasta and chapati fillings.",
  },
  // Sanitary Essentials
  {
    id: "p-020",
    name: "Always Ultra Sanitary Pads",
    size: "Pack of 10",
    category: "sanitary-essentials",
    shop: "naivas",
    price: 165,
    studentDeal: true,
    inStock: true,
    description: "Ultra thin pads with wings for all-day comfort.",
  },
  {
    id: "p-021",
    name: "Velvex Toilet Tissue",
    size: "10 rolls",
    category: "sanitary-essentials",
    shop: "quickmart",
    price: 480,
    inStock: true,
    description: "2-ply soft tissue rolls, hostel bulk pack.",
  },
  {
    id: "p-022",
    name: "Dettol Hand Sanitiser",
    size: "250 ml",
    category: "sanitary-essentials",
    shop: "goodlife-pharmacy",
    price: 340,
    inStock: true,
    description: "70% alcohol sanitising gel with moisturiser.",
  },
  {
    id: "p-023",
    name: "Kleenex Wet Wipes",
    size: "72 wipes",
    category: "sanitary-essentials",
    shop: "chandarana",
    price: 295,
    inStock: true,
    description: "Fragrance-free wipes for hands and surfaces.",
  },
  // Stationery
  {
    id: "p-030",
    name: "Exercise Books A4 Squared",
    size: "Pack of 6, 200 pages",
    category: "stationery",
    shop: "carrefour",
    price: 420,
    wasPrice: 480,
    studentDeal: true,
    inStock: true,
    description: "Hard-cover A4 exercise books for coursework and revision.",
  },
  {
    id: "p-031",
    name: "Bic Ballpoint Pens",
    size: "Pack of 10, blue",
    category: "stationery",
    shop: "naivas",
    price: 210,
    inStock: true,
    description: "Smooth-writing pens that survive a full semester.",
  },
  {
    id: "p-032",
    name: "Oxford Scientific Calculator",
    size: "FX-991 class",
    category: "stationery",
    shop: "chandarana",
    price: 1850,
    inStock: true,
    description: "Exam-approved scientific calculator with 417 functions.",
  },
  {
    id: "p-033",
    name: "Geometrical Set",
    size: "9 pieces",
    category: "stationery",
    shop: "carrefour",
    price: 320,
    inStock: true,
    description: "Metal instrument box for technical drawing units.",
  },
  // Pharmaceuticals
  {
    id: "p-040",
    name: "Panadol Extra Tablets",
    size: "24 tablets",
    category: "pharmaceuticals",
    shop: "goodlife-pharmacy",
    price: 280,
    inStock: true,
    description: "Paracetamol and caffeine tablets for headaches and fever.",
  },
  {
    id: "p-041",
    name: "Amoxicillin 500 mg Capsules",
    size: "21 capsules",
    category: "pharmaceuticals",
    shop: "goodlife-pharmacy",
    price: 640,
    inStock: true,
    prescriptionRequired: true,
    description:
      "Broad spectrum antibiotic. A valid prescription is verified by the pharmacist before dispatch.",
  },
  {
    id: "p-042",
    name: "Bandage & First Aid Kit",
    size: "Compact kit",
    category: "pharmaceuticals",
    shop: "goodlife-pharmacy",
    price: 950,
    inStock: true,
    description: "Plasters, gauze, antiseptic and tape in a sealed pouch.",
  },
  {
    id: "p-043",
    name: "Vitamin C 1000 mg",
    size: "30 tablets",
    category: "pharmaceuticals",
    shop: "goodlife-pharmacy",
    price: 520,
    studentDeal: true,
    inStock: true,
    description: "Effervescent immune support tablets, orange flavour.",
  },
  // Snacks & Drinks
  {
    id: "p-050",
    name: "Tropical Heat Potato Crisps",
    size: "125 g",
    category: "snacks-drinks",
    shop: "quickmart",
    price: 140,
    inStock: true,
    description: "Salted crisps for late night study sessions.",
  },
  {
    id: "p-051",
    name: "Coca-Cola Soda",
    size: "2 litres",
    category: "snacks-drinks",
    shop: "naivas",
    price: 180,
    wasPrice: 210,
    studentDeal: true,
    inStock: true,
    description: "Chilled 2 litre bottle, shareable with roommates.",
  },
  {
    id: "p-052",
    name: "Delmonte Mango Juice",
    size: "1 litre",
    category: "snacks-drinks",
    shop: "chandarana",
    price: 265,
    inStock: true,
    description: "No-added-sugar mango juice blend.",
  },
  {
    id: "p-053",
    name: "Britania Digestive Biscuits",
    size: "400 g",
    category: "snacks-drinks",
    shop: "carrefour",
    price: 210,
    inStock: true,
    description: "Wheat digestive biscuits, good with tea.",
  },
  // Fruits & Vegetables
  {
    id: "p-060",
    name: "Sweet Bananas",
    size: "1 kg bunch",
    category: "fruits-vegetables",
    shop: "naivas",
    price: 150,
    inStock: true,
    description: "Ripe local bananas, ready to eat.",
  },
  {
    id: "p-061",
    name: "Tomatoes",
    size: "1 kg",
    category: "fruits-vegetables",
    shop: "quickmart",
    price: 130,
    inStock: true,
    description: "Firm cooking tomatoes sourced from Mwea farms.",
  },
  {
    id: "p-062",
    name: "Sukuma Wiki (Kale)",
    size: "2 bunches",
    category: "fruits-vegetables",
    shop: "quickmart",
    price: 60,
    studentDeal: true,
    inStock: true,
    description: "Freshly cut kale, chopped on request.",
  },
  {
    id: "p-063",
    name: "Avocado Hass",
    size: "4 pieces",
    category: "fruits-vegetables",
    shop: "carrefour",
    price: 190,
    inStock: true,
    description: "Creamy Hass avocados at eating ripeness.",
  },
  // Personal Care
  {
    id: "p-070",
    name: "Nivea Body Lotion",
    size: "400 ml",
    category: "personal-care",
    shop: "chandarana",
    price: 690,
    inStock: true,
    description: "Rich nourishing lotion for dry skin.",
  },
  {
    id: "p-071",
    name: "Colgate Toothpaste",
    size: "150 g",
    category: "personal-care",
    shop: "naivas",
    price: 245,
    inStock: true,
    description: "Cavity protection toothpaste with fluoride.",
  },
  {
    id: "p-072",
    name: "Geisha Soap Bars",
    size: "Pack of 4",
    category: "personal-care",
    shop: "quickmart",
    price: 320,
    wasPrice: 365,
    studentDeal: true,
    inStock: true,
    description: "Beauty soap bars, four-pack for the semester.",
  },
  {
    id: "p-073",
    name: "Nice & Lovely Roll-On",
    size: "50 ml",
    category: "personal-care",
    shop: "carrefour",
    price: 175,
    inStock: true,
    description: "48-hour protection anti-perspirant roll-on.",
  },
  // Household Essentials
  {
    id: "p-080",
    name: "Omo Washing Powder",
    size: "1 kg",
    category: "household-essentials",
    shop: "naivas",
    price: 330,
    inStock: true,
    description: "Hand-wash detergent powder for hostel laundry.",
  },
  {
    id: "p-081",
    name: "Jik Bleach",
    size: "750 ml",
    category: "household-essentials",
    shop: "quickmart",
    price: 195,
    inStock: true,
    description: "Disinfectant bleach for surfaces and whites.",
  },
  {
    id: "p-082",
    name: "Scouring Pads & Sponges",
    size: "Pack of 6",
    category: "household-essentials",
    shop: "carrefour",
    price: 155,
    studentDeal: true,
    inStock: true,
    description: "Kitchen sponges and scourers for shared kitchens.",
  },
  {
    id: "p-083",
    name: "Energy Saving Bulb",
    size: "9 W, warm white",
    category: "household-essentials",
    shop: "carrefour",
    price: 260,
    inStock: true,
    description: "LED bulb that keeps the hostel room bright and cheap.",
  },
  // Baby Care
  {
    id: "p-090",
    name: "Pampers Baby Dry",
    size: "Size 3, 34 pieces",
    category: "baby-care",
    shop: "carrefour",
    price: 1290,
    inStock: true,
    description: "Overnight dryness nappies for babies 6–10 kg.",
  },
  {
    id: "p-091",
    name: "Johnson's Baby Jelly",
    size: "250 g",
    category: "baby-care",
    shop: "naivas",
    price: 320,
    inStock: true,
    description: "Gentle petroleum jelly for delicate skin.",
  },
  // Pet Supplies
  {
    id: "p-100",
    name: "Pet Dry Food",
    size: "1.5 kg",
    category: "pet-supplies",
    shop: "chandarana",
    price: 980,
    inStock: true,
    description: "Balanced dry kibble for adult dogs.",
  },
  {
    id: "p-101",
    name: "Cat Litter",
    size: "5 litres",
    category: "pet-supplies",
    shop: "carrefour",
    price: 750,
    inStock: true,
    description: "Clumping litter with odour control.",
  },
  // Electronics
  {
    id: "p-110",
    name: "Oraimo 20 W Charger",
    size: "USB-C fast charge",
    category: "electronics",
    shop: "quickmart",
    price: 1450,
    studentDeal: true,
    inStock: true,
    description: "Fast wall charger with cable, one year warranty.",
  },
  {
    id: "p-111",
    name: "Extension Cable",
    size: "4-way, 3 m",
    category: "electronics",
    shop: "carrefour",
    price: 990,
    inStock: true,
    description: "Surge-protected extension for hostel rooms.",
  },
  {
    id: "p-112",
    name: "Wired Earphones",
    size: "3.5 mm jack",
    category: "electronics",
    shop: "quickmart",
    price: 620,
    inStock: true,
    description: "In-ear earphones with inline mic for online classes.",
  },
  // Sports & Fitness
  {
    id: "p-120",
    name: "Skipping Rope",
    size: "Adjustable 3 m",
    category: "sports-fitness",
    shop: "carrefour",
    price: 480,
    inStock: true,
    description: "Steel-core skipping rope for quick cardio.",
  },
  {
    id: "p-121",
    name: "Dumbbell Set",
    size: "2 × 5 kg",
    category: "sports-fitness",
    shop: "carrefour",
    price: 3200,
    inStock: true,
    description: "Vinyl-coated dumbbells for room workouts.",
  },
  {
    id: "p-122",
    name: "Yoga Mat",
    size: "6 mm",
    category: "sports-fitness",
    shop: "chandarana",
    price: 1750,
    inStock: true,
    description: "Non-slip exercise mat with carry strap.",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getShop(slug: string) {
  return shops.find((s) => s.slug === slug);
}

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function categoryName(slug: string) {
  return getCategory(slug)?.name ?? slug;
}

export function shopName(slug: string) {
  return getShop(slug)?.name ?? slug;
}

export type OrderStatus = "preparing" | "dispatched" | "delivered" | "cancelled";

export type DemoOrder = {
  id: string;
  placedAt: string;
  status: OrderStatus;
  items: { productId: string; qty: number }[];
  deliveryFee: number;
  discount: number;
  address: string;
  courier: string;
};

export const demoOrders: DemoOrder[] = [
  {
    id: "AQ-10428",
    placedAt: "Today, 12:40 PM",
    status: "dispatched",
    items: [
      { productId: "p-001", qty: 2 },
      { productId: "p-020", qty: 1 },
      { productId: "p-051", qty: 1 },
    ],
    deliveryFee: 120,
    discount: 60,
    address: "KCA University, Ruaraka — Hostel Block C",
    courier: "Brian K. · Rider",
  },
  {
    id: "AQ-10391",
    placedAt: "Today, 09:15 AM",
    status: "preparing",
    items: [
      { productId: "p-010", qty: 1 },
      { productId: "p-062", qty: 2 },
    ],
    deliveryFee: 100,
    discount: 0,
    address: "KCA University, Ruaraka — Hostel Block C",
    courier: "Awaiting assignment",
  },
  {
    id: "AQ-10254",
    placedAt: "Mon, 28 Aug",
    status: "delivered",
    items: [
      { productId: "p-030", qty: 1 },
      { productId: "p-031", qty: 1 },
      { productId: "p-032", qty: 1 },
    ],
    deliveryFee: 150,
    discount: 60,
    address: "KCA University, Ruaraka — Hostel Block C",
    courier: "Mercy W. · Rider",
  },
  {
    id: "AQ-10188",
    placedAt: "Fri, 22 Aug",
    status: "cancelled",
    items: [{ productId: "p-013", qty: 2 }],
    deliveryFee: 100,
    discount: 0,
    address: "KCA University, Ruaraka — Hostel Block C",
    courier: "Cancelled — item out of stock",
  },
];

export const deliveryLocations = [
  "KCA University, Nairobi",
  "Kenyatta University, Kahawa",
  "University of Nairobi, Main Campus",
  "JKUAT, Juja",
  "Strathmore University, Madaraka",
  "Multimedia University, Rongai",
];

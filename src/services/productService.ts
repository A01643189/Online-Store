import { Product, ProductsResponse } from "../types/products.ts";
import { addDoc, collection, doc, getDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig.ts";

// Sample product seed data
const products: Omit<Product, 'id'>[] = [
  {
    title: "Wireless Mouse",
    description: "Ergonomic wireless mouse with long battery life.",
    price: 25.99,
    category: "Electronics",
    image: "https://www.keychron.mx/cdn/shop/files/Lemokey-G1-wireless-mouse-black.jpg?v=1724653193",
    stock: 50,
    rating: 4.5,
    createdAt: Timestamp.now()
  },
  {
    title: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with blue switches.",
    price: 79.99,
    category: "Electronics",
    image: "https://media.wired.com/photos/65b0438c22aa647640de5c75/master/w_2560,c_limit/MechanicalKeyboard-Guide-Gear-GettyImages-1313504623.jpg",
    stock: 30,
    rating: 4.7,
    createdAt: Timestamp.now()
  },
  {
    title: "Gaming Headset",
    description: "Surround sound gaming headset with noise cancellation.",
    price: 49.99,
    category: "Accessories",
    image: "https://assets2.razerzone.com/images/pnx.assets/57c2af30b5d9a2b699b3e896b788e00f/headsetlandingpg-500x500-blacksharkv2pro2023.jpg",
    stock: 20,
    rating: 4.6,
    createdAt: Timestamp.now()
  },
  {
    title: "Smartphone Stand",
    description: "Adjustable smartphone stand for desk use.",
    price: 15.99,
    category: "Accessories",
    image: "https://www.apps2car.com/cdn/shop/products/tripod-phone-stand.jpg?v=1652323294",
    stock: 100,
    rating: 4.3,
    createdAt: Timestamp.now()
  },
  {
    title: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with deep bass.",
    price: 39.99,
    category: "Audio",
    image: "https://cdn.thewirecutter.com/wp-content/media/2024/11/portablebluetoothspeakers-2048px9481.jpg?auto=webp&quality=75&width=1024",
    stock: 25,
    rating: 4.8,
    createdAt: Timestamp.now()
  },
  {
    title: "USB-C Hub",
    description: "5-in-1 USB-C hub with HDMI and SD card reader.",
    price: 29.99,
    category: "Electronics",
    image: "https://m.media-amazon.com/images/I/61Bm+9UTP6L._AC_UF1000,1000_QL80_.jpg",
    stock: 40,
    rating: 4.5,
    createdAt: Timestamp.now()
  },
  {
    title: "Laptop Stand",
    description: "Aluminum laptop stand for better ergonomics.",
    price: 34.99,
    category: "Office",
    image: "https://m.media-amazon.com/images/I/71xlXzGX9aL._AC_SL1500_.jpg",
    stock: 60,
    rating: 4.7,
    createdAt: Timestamp.now()
  },
  {
    title: "Wireless Charger",
    description: "Fast wireless charger for Qi-compatible devices.",
    price: 19.99,
    category: "Accessories",
    image: "https://www.ikea.com/mx/en/images/products/livboj-wireless-charger-white__0721950_pe733427_s5.jpg?f=s",
    stock: 35,
    rating: 4.6,
    createdAt: Timestamp.now()
  },
  {
    title: "Noise Cancelling Earbuds",
    description: "Wireless earbuds with active noise cancellation.",
    price: 89.99,
    category: "Audio",
    image: "https://cdn.thewirecutter.com/wp-content/media/2023/09/noise-cancelling-headphone-2048px0872.jpg",
    stock: 15,
    rating: 4.9,
    createdAt: Timestamp.now()
  },
  {
    title: "4K Monitor",
    description: "27-inch 4K UHD monitor with HDR support.",
    price: 299.99,
    category: "Electronics",
    image: "https://assets-prd.ignimgs.com/2024/10/08/alienware-aw3225qf-1718732594021-1728418469322.jpg",
    stock: 10,
    rating: 4.8,
    createdAt: Timestamp.now()
  }
];

// Upload products if collection is empty
export const initializeProducts = async () => {
  try {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);

    if (snapshot.size === 0) {
      for (const product of products) {
        await addDoc(productsCollection, product);
        console.log(`Added: ${product.title}`);
      }
      console.log("All products added successfully.");
    }
  } catch (error) {
    console.error("Error initializing products: ", error);
  }
};

// Fetch all products from Firestore
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

let allProducts: Product[];

export const fetchProducts = async (params: {
  page: number;
  perPage?: number;
  category?: string;
  query?: string;
  source: string;
}): Promise<ProductsResponse> => {
  const perPage = params.perPage || 20;
  const startIndex = (params.page - 1) * perPage;

  allProducts = await getProducts();
  let filteredProducts = [...allProducts];

  if (params.category?.trim()) {
    const categoryFilter = params.category.toLowerCase();
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === categoryFilter
    );
  }

  if (params.query) {
    const query = params.query.toLowerCase();
    filteredProducts = filteredProducts.filter(
      p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    );
  }

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + perPage);

  return {
    data: paginatedProducts,
    totalPages,
    currentPage: params.page
  };
};

// Get a single product by ID
export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  const productRef = doc(db, "products", id);
  const productSnap = await getDoc(productRef);

  if (productSnap.exists()) {
    return {
      id: productSnap.id,
      ...productSnap.data()
    } as Product;
  }

  return undefined;
};

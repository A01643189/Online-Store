/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/api.ts
import { Product, ProductsResponse } from '../types/products';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase'; 

const categories = ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'];
const brands = ['Apple', 'Samsung', 'Nike', 'Sony', 'Adidas', 'Dell', 'LG'];

const mockProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
    id: (i + 1).toString(),
    title: `Product ${i + 1}`,
    price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
    rating: Math.floor(Math.random() * 3) + 2,
    image: `https://picsum.photos/300/300?random=${i}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    brand: brands[Math.floor(Math.random() * brands.length)],
    description: `This is a detailed description for Product ${i + 1}. It includes all relevant features and specifications.`,
    stock: Math.floor(Math.random() * 100),
  }));  

export const initializeProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const snapshot = await getDocs(productsCollection);
  
      if (snapshot.size === 0) {
        for (const product of mockProducts) {
          await setDoc(doc(productsCollection, product.id), product);

          console.log(`Added: ${product.title}`);
        }
        console.log('All products added successfully.');
      }
    } catch (error) {
      console.error('Error initializing products: ', error);
    }
  };

  
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, 'products');
    const snapshot = await getDocs(productsCollection);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProducts = async (params: {
  page: number;
  perPage?: number;
  category?: string;
  query?: string;
}): Promise<ProductsResponse> => {
  const allProducts = await getProducts();

  const perPage = params.perPage || 20;
  const startIndex = (params.page - 1) * perPage;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Filter products by category if specified
  let filteredProducts = [...allProducts];
  if (params.category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === params.category?.toLowerCase()
    );
  }

  // Filter by search query if specified
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredProducts = filteredProducts.filter(
      p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  // Calculate pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + perPage);

  return {
    data: paginatedProducts,
    totalPages,
    currentPage: params.page
  };
};

// Utility function for single product fetch
export const fetchProductById = async (id: string): Promise<Product | undefined> => {
    const productRef = doc(db, 'products', id); 
    const productSnap = await getDoc(productRef);
  
    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        ...productSnap.data()
      } as Product;
    } else {
      return undefined;
    }
};

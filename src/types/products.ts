// src/types/products.ts

export interface Product {
    rating: number;
    id: string;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    stock: number;
    createdAt: Date;
};

export interface AdminContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: number) => void;
};

export interface ProductsResponse {
    data: Product[];
    totalPages: number;
    currentPage: number;
}
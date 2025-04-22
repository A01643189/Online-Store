import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import {CartProvider} from "./context/CartContext.tsx";
import {OrderProvider} from "./context/OrderContext.tsx";
import {AdminProvider} from "./context/AdminContext.tsx";
import { initializeProducts } from './services/productService.ts';
import {AuthProvider} from "./context/AuthContext.tsx";
import {ProductProvider} from "./context/ProductContext.tsx";

await initializeProducts();


const main = async () => {ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode> 
        <AuthProvider> 
            <ProductProvider> 
                <OrderProvider> 
                    <AdminProvider> 
                        <CartProvider> 
                            <App /> 
                        </CartProvider> 
                    </AdminProvider> 
                </OrderProvider> 
            </ProductProvider> 
        </AuthProvider> 
    </React.StrictMode> 
    );
}

main();
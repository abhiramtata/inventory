import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "../types";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../api";

type ProductContextType = {
  products: Product[];
  loading: boolean;
  error: string;
  add: (p: Omit<Product, "id">) => Promise<void>;
  edit: (id: number, p: Partial<Product>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  reload: () => Promise<void>;
};

const ProductContext = createContext<ProductContextType | null>(null);

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductProvider");
  return ctx;
}

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function add(p: Omit<Product, "id">) {
    try {
      setError("");
      setLoading(true);
      const created = await createProduct(p);
      setProducts(prev => [...prev, created]);
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  async function edit(id: number, p: Partial<Product>) {
    try {
      setError("");
      setLoading(true);
      const updated = await updateProduct(id, p);
      setProducts(prev => prev.map(x => (x.id === id ? updated : x)));
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: number) {
    try {
      setError("");
      setLoading(true);
      await deleteProduct(id);
      setProducts(prev => prev.filter(x => x.id !== id));
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  const value: ProductContextType = { products, loading, error, add, edit, remove, reload: load };
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

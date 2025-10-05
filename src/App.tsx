import React, { useState } from "react";
import { ProductProvider, useProducts } from "./context/ProductContext";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import { Product } from "./types";
import "./App.css";

function Dashboard() {
  const { error, reload } = useProducts();
  const [editing, setEditing] = useState<Product | null>(null);

  return (
    <div className="wrapper">
      <h1>Inventory Dashboard</h1>

      {error && (
        <div className="error row">
          <span>{error}</span>
          <button onClick={reload}>Retry</button>
        </div>
      )}

      <ProductForm editing={editing} onDoneEdit={() => setEditing(null)} />
      <ProductTable onEdit={(p) => setEditing(p)} />
    </div>
  );
}

export default function App() {
  return (
    <ProductProvider>
      <Dashboard />
    </ProductProvider>
  );
}

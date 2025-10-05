import React from "react";
import { useProducts } from "../context/ProductContext";
import { Product } from "../types";

type Props = { onEdit: (p: Product) => void };

export default function ProductTable({ onEdit }: Props) {
  const { products, remove, edit, loading } = useProducts();

  async function incStock(p: Product, delta: number) {
    const next = Math.max(0, p.stock + delta);
    await edit(p.id, { stock: next });
  }

  return (
    <div className="card">
      <h2>Inventory</h2>
      {loading && <div className="info">Loading...</div>}
      {!loading && products.length === 0 && <div className="info">No products yet.</div>}

      {products.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "35%" }}>Name</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th>Category</th>
              <th style={{ width: "28%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.category || "-"}</td>
                <td className="actions">
                  <button onClick={() => incStock(p, +1)}>+1</button>
                  <button onClick={() => incStock(p, -1)}>-1</button>
                  <button onClick={() => onEdit(p)}>Edit</button>
                  <button onClick={() => remove(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

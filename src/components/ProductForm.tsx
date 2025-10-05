import React, { useEffect, useState } from "react";
import { useProducts } from "../context/ProductContext";
import { Product } from "../types";

type Props = {
  editing?: Product | null;
  onDoneEdit?: () => void;
};

export default function ProductForm({ editing = null, onDoneEdit }: Props) {
  const { add, edit, loading } = useProducts();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPrice(editing.price);
      setStock(editing.stock);
      setCategory(editing.category || "");
    } else {
      setName("");
      setPrice(0);
      setStock(0);
      setCategory("");
    }
  }, [editing]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    if (editing) {
      await edit(editing.id, { name, price, stock, category });
      onDoneEdit && onDoneEdit();
    } else {
      await add({ name, price, stock, category });
      setName(""); setPrice(0); setStock(0); setCategory("");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card">
      <h2>{editing ? "Edit Product" : "Add Product"}</h2>
      <div className="row">
        <label className="field">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" required />
        </label>
        <label className="field">
          <span>Price (₹)</span>
          <input type="number" value={price} min={0} onChange={(e) => setPrice(Number(e.target.value))} required />
        </label>
        <label className="field">
          <span>Stock</span>
          <input type="number" value={stock} min={0} onChange={(e) => setStock(Number(e.target.value))} required />
        </label>
        <label className="field">
          <span>Category</span>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Optional" />
        </label>
      </div>
      <div className="row">
        <button type="submit" disabled={loading}>{editing ? "Save Changes" : "Add"}</button>
        {editing && onDoneEdit && <button type="button" onClick={onDoneEdit}>Cancel</button>}
      </div>
    </form>
  );
}

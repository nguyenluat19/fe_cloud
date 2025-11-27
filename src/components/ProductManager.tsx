import { useEffect, useState } from "react";

const API = "https://beckdoan-production.up.railway.app/api/v1";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- LOAD SP ---
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.log("Lỗi load sản phẩm:", err);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API}/products`);
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.log("Lỗi load sản phẩm:", err);
      }
    };

    loadProducts();
  }, []);

  // --- TÌM KIẾM ---
  const handleSearch = async () => {
    if (!search.trim()) return fetchProducts();

    try {
      const res = await fetch(`${API}/search?keyword=${search}`);
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.log("Lỗi tìm kiếm:", err);
    }
  };

  const onKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // --- THÊM SP ---
  const addProduct = async () => {
    if (!form.name || !form.price || !form.description || !form.image) {
      return alert("Nhập đủ thông tin!");
    }

    try {
      await fetch(`${API}/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          priceGoc: form.price,
          quantity: 1,
        }),
      });

      fetchProducts();
      setForm({ name: "", price: "", description: "", image: "" });
    } catch (err) {
      console.log("Lỗi thêm:", err);
    }
  };

  // --- XÓA SP ---
  const deleteProduct = async (id: string) => {
    if (!confirm("Xóa sản phẩm này?")) return;

    try {
      await fetch(`${API}/delete/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.log("Lỗi xóa:", err);
    }
  };

  // --- SỬA SP ---
  const startEdit = (p: Product) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      price: p.price.toString(),
      description: p.description,
      image: p.image,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await fetch(`${API}/update/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      fetchProducts();
      setEditingId(null);
      setForm({ name: "", price: "", description: "", image: "" });
    } catch (err) {
      console.log("Lỗi sửa:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {/* --- Tìm kiếm --- */}
      <div style={{ marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={onKeyDownSearch}
          style={{ width: "70%", padding: 6 }}
        />
        <button onClick={handleSearch} style={{ padding: 6, marginLeft: 10 }}>
          Tìm
        </button>
      </div>

      {/* --- Form thêm/sửa --- */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <input
          type="text"
          placeholder="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ flex: 1, padding: 6 }}
        />
        <input
          type="number"
          placeholder="Giá"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          style={{ width: 120, padding: 6 }}
        />
        <input
          type="text"
          placeholder="Link ảnh"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          style={{ flex: 1, padding: 6 }}
        />
        <input
          type="text"
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ flex: 1, padding: 6 }}
        />
        {editingId ? (
          <button onClick={saveEdit} style={{ padding: 6 }}>
            Lưu
          </button>
        ) : (
          <button onClick={addProduct} style={{ padding: 6 }}>
            Thêm
          </button>
        )}
      </div>

      {/* --- Table hiển thị sản phẩm --- */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5", textAlign: "left" }}>
            <th style={{ padding: "10px" }}>Ảnh</th>
            <th style={{ padding: "10px" }}>Tên</th>
            <th style={{ padding: "10px" }}>Giá</th>
            <th style={{ padding: "10px" }}>Mô tả</th>
            <th style={{ padding: "10px" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p._id}
              style={{
                borderBottom: "1px solid #ddd",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9f9f9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "white")
              }
            >
              <td style={{ padding: "10px" }}>
                <img
                  src={p.image}
                  width={60}
                  style={{ borderRadius: "5px", objectFit: "cover" }}
                />
              </td>
              <td style={{ padding: "10px", fontWeight: 500 }}>{p.name}</td>
              <td
                style={{ padding: "10px", color: "#ff4500", fontWeight: 600 }}
              >
                {p.price.toLocaleString()}đ
              </td>
              <td style={{ padding: "10px", maxWidth: "300px" }}>
                {p.description}
              </td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => startEdit(p)}
                  style={{
                    padding: "5px 10px",
                    marginRight: 5,
                    backgroundColor: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Sửa
                </button>
                <button
                  onClick={() => deleteProduct(p._id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                Không có sản phẩm
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

import "./index.css";
import ProductManager from "./components/ProductManager";

export default function App() {
  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>Quản Lý Sản Phẩm</h1>
      <ProductManager />
    </div>
  );
}

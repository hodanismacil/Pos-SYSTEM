import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import  { ImportProductsModal } from "./ImportProductsModal";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  X,
  Loader2,
  Tag,
  Barcode,
  Layers,
  ShoppingCart,
  ArrowRight,
  Upload, // 2. Import Upload icon
} from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string | null;
  categoryId: number;
  category?: Category;
}

interface ProductForm {
  name: string;
  sku: string;
  barcode: string;
  price: string;
  stock: string;
  description: string;
  imageUrl: string;
  categoryId: string;
}

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  barcode: "",
  price: "",
  stock: "",
  description: "",
  imageUrl: "",
  categoryId: "",
};

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 3. State-ka maamulaya Import Modal-ka
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [form, setForm] = useState<ProductForm>(emptyForm);

  // GET PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // GET CATEGORIES
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // FORM INPUT
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // OPEN ADD
  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // OPEN EDIT
  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      categoryId: String(product.categoryId),
    });
    setShowModal(true);
  };

  // SAVE PRODUCT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const payload = {
        name: form.name,
        sku: form.sku,
        barcode: form.barcode,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        imageUrl: form.imageUrl || null,
        categoryId: Number(form.categoryId),
      };

      if (editingId) {
        const response = await api.put(`/products/${editingId}`, payload);
        if (response.data.success) {
          setProducts((prev) =>
            prev.map((product) =>
              product.id === editingId ? response.data.data : product
            )
          );
        }
      } else {
        const response = await api.post("/products", payload);
        if (response.data.success) {
          setProducts((prev) => [response.data.data, ...prev]);
        }
      }

      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setSaving(false);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      const response = await api.delete(`/products/${id}`);
      if (response.data.success) {
        setProducts((prev) => prev.filter((product) => product.id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // HANDLER FOR BUYING / GO TO CHECKOUT
  const handleBuyProduct = (productId: number) => {
    navigate(`/pos?productId=${productId}`);
  };

  // SEARCH
  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.barcode.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 px-2 sm:px-4">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Inventory Management
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-white tracking-tight">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your stock, categories, prices, and product details.
          </p>
        </div>

        {/* BATOONADA SARA (ACTIONS) */}
        <div className="flex items-center gap-3">
          {/* 4. BATOONKA IMPORT EXCEL */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20 active:scale-95"
          >
            <Upload size={18} />
            Import Excel
          </button>

          {/* Batoonka Add Product */}
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={18} />
            Add New Product
          </button>
        </div>
      </div>

      {/* SEARCH BAR & COUNTER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-[#101631]/80 p-4 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by name, SKU, or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0a1026] py-2.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition"
          />
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-400">
            Showing <strong className="text-white">{filteredProducts.length}</strong> of{" "}
            <strong className="text-white">{products.length}</strong> products
          </span>
        </div>
      </div>

      {/* PRODUCTS CARDS GRID */}
      {loading ? (
        <div className="flex h-72 items-center justify-center rounded-2xl border border-white/10 bg-[#101631]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-purple-400" size={36} />
            <p className="text-sm text-slate-400">Loading inventory...</p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#101631] p-6 text-center">
          <div className="rounded-full bg-purple-500/10 p-4 text-purple-400">
            <Package size={36} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-white">No products found</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm">
            Try adjusting your search query or click "Add New Product" to create one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const categoryName =
              product.category?.name ||
              categories.find((c) => c.id === product.categoryId)?.name ||
              "Uncategorized";

            return (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101631] shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer"
                onClick={() => handleBuyProduct(product.id)}
              >
                {/* IMAGE SHOWCASE */}
                <div className="relative h-48 w-full overflow-hidden bg-[#0a1026]">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-900/20 to-slate-900">
                      <Package size={40} className="text-purple-400/50" />
                    </div>
                  )}

                  {/* STOCK BADGE */}
                  <span
                    className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-md shadow-md ${
                      product.stock === 0
                        ? "border-red-500/40 bg-red-950/80 text-red-400"
                        : product.stock <= 5
                        ? "border-amber-500/40 bg-amber-950/80 text-amber-300"
                        : "border-emerald-500/40 bg-emerald-950/80 text-emerald-300"
                    }`}
                  >
                    {product.stock === 0
                      ? "Out of Stock"
                      : `${product.stock} in Stock`}
                  </span>

                  {/* CATEGORY BADGE */}
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur-md">
                    <Tag size={12} className="text-purple-400" />
                    {categoryName}
                  </span>
                </div>

                {/* CARD CONTENT */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    {/* TITLE & PRICE */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 text-base font-bold text-white group-hover:text-purple-300 transition">
                        {product.name}
                      </h3>
                      <span className="text-lg font-extrabold text-emerald-400">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>

                    {/* DESCRIPTION */}
                    <p className="mt-2 line-clamp-2 text-xs text-slate-400 min-h-[32px]">
                      {product.description || "No description provided."}
                    </p>

                    {/* SKU & BARCODE */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/5 pt-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1">
                        <Layers size={13} className="text-slate-400" />
                        <span>
                          SKU: <strong className="text-slate-200">{product.sku}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1">
                        <Barcode size={13} className="text-slate-400" />
                        <span>{product.barcode}</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION & BUY BUTTONS */}
                  <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                    {/* BUY NOW BUTTON */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyProduct(product.id);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-xs font-bold text-white shadow-md transition duration-300 hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/20 active:scale-95"
                    >
                      <ShoppingCart size={15} />
                      Buy Now / Checkout
                      <ArrowRight size={14} />
                    </button>

                    {/* EDIT & DELETE */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(product);
                        }}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-500/10 py-2 text-xs font-medium text-blue-400 transition hover:bg-blue-500/20 active:scale-95"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product.id);
                        }}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-500/10 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20 active:scale-95"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#101631] shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {editingId
                    ? "Update product details and inventory settings."
                    : "Fill in the information to list a new item."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* NAME */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Product Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="HP EliteBook 840 G8"
                    className="w-full rounded-xl border border-white/10 bg-[#0a1026] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500 transition"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    SKU
                  </label>
                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    required
                    placeholder="HP840G8"
                    className="w-full rounded-xl border border-white/10 bg-[#0a1026] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500 transition"
                  />
                </div>

                {/* BARCODE */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Barcode
                  </label>
                  <input
                    name="barcode"
                    value={form.barcode}
                    onChange={handleChange}
                    required
                    placeholder="987654321"
                    className="w-full rounded-xl border border-white/10 bg-[#0a1026] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500 transition"
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#0a1026] px-4 py-3 text-sm text-white outline-none focus:border-purple-500 transition"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PRICE */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Price ($)
                  </label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    required
                    placeholder="950"
                    className="w-full rounded-xl border border-white/10 bg-[#0a1026] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500 transition"
                  />
                </div>

                {/* STOCK */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Stock Quantity
                  </label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    placeholder="20"
                    className="w-full rounded-xl border border-white/10 bg-[#0a1026] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500 transition"
                  />
                </div>
              </div>

              {/* IMAGE */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Image URL
                </label>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/product.jpg"
                  className="w-full rounded-xl border border-white/10 bg-[#0a1026] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500 transition"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter detailed product description..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#0a1026] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500 transition"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editingId ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. IMPORT PRODUCTS MODAL RENDER */}
      <ImportProductsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          fetchProducts(); // Refreshes the product grid after file upload success
        }}
      />
    </div>
  );
};

export default Products;
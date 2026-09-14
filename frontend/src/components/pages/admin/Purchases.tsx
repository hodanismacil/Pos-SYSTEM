import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Loader2,
  Building2,
  PackageCheck,
  Calendar,
  DollarSign,
  X,
  Eye,
} from "lucide-react";

interface Supplier {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface PurchaseItemInput {
  productId: number;
  quantity: number;
  price: number;
}

interface PurchaseItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
}

interface Purchase {
  id: number;
  supplierId: number;
  supplier: Supplier;
  totalAmount: number;
  createdAt: string;
  purchaseItems: PurchaseItem[];
}

const API_BASE_URL = "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const Purchases: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  // Form State
  const [supplierId, setSupplierId] = useState<number | "">("");
  const [cartItems, setCartItems] = useState<PurchaseItemInput[]>([]);

  // Cart Add State
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [costPrice, setCostPrice] = useState<number>(0);

  // 1. FETCH PURCHASES, SUPPLIERS & PRODUCTS
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resPurchases, resSuppliers, resProducts] = await Promise.all([
        axios.get(`${API_BASE_URL}/purchases`, getAuthHeader()),
        axios.get(`${API_BASE_URL}/suppliers`, getAuthHeader()),
        axios.get(`${API_BASE_URL}/products`, getAuthHeader()),
      ]);

      setPurchases(resPurchases.data.data || resPurchases.data);
      setSuppliers(resSuppliers.data.data || resSuppliers.data);
      setProducts(resProducts.data.data || resProducts.data);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      alert(error.response?.data?.message || "Failed to load purchases data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Product Select in Restock Form
  const handleProductSelect = (pId: number) => {
    setSelectedProductId(pId);
    const prod = products.find((p) => p.id === pId);
    if (prod) setCostPrice(prod.price);
  };

  // Add Item to Temporary Cart
  const handleAddToCart = () => {
    if (!selectedProductId || quantity <= 0 || costPrice <= 0) {
      alert("Fadlan dooro alaabta, tirada, iyo qiimaha saxda ah!");
      return;
    }

    const existingIndex = cartItems.findIndex(
      (item) => item.productId === Number(selectedProductId)
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += Number(quantity);
      updated[existingIndex].price = Number(costPrice);
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          productId: Number(selectedProductId),
          quantity: Number(quantity),
          price: Number(costPrice),
        },
      ]);
    }

    setSelectedProductId("");
    setQuantity(1);
    setCostPrice(0);
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  // Calculate Total
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  // 2. SUBMIT NEW PURCHASE (RESTOCK)
  const handleSubmitPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || cartItems.length === 0) {
      alert("Fadlan dooro Supplier-ka oo ku dar ugu yaraan hal item cart-ka!");
      return;
    }

    try {
      setSubmitLoading(true);
      await axios.post(
        `${API_BASE_URL}/purchases`,
        {
          supplierId: Number(supplierId),
          items: cartItems,
        },
        getAuthHeader()
      );

      setIsModalOpen(false);
      setCartItems([]);
      setSupplierId("");
      fetchData(); // Refresh DB Data & Stock
    } catch (error: any) {
      console.error("Error creating purchase:", error);
      alert(error.response?.data?.message || "Failed to process purchase");
    } finally {
      setSubmitLoading(false);
    }
  };

  // 3. DELETE PURCHASE RECORD
  const handleDeletePurchase = async (id: number) => {
    if (
      !window.confirm(
        "Ma xaqiijinaysaa in aad tirtirto iibkan? Tani waxay hoos u dhigi doontaa stock-ka alaabta!"
      )
    )
      return;

    try {
      await axios.delete(`${API_BASE_URL}/purchases/${id}`, getAuthHeader());
      fetchData();
    } catch (error: any) {
      console.error("Error deleting purchase:", error);
      alert(error.response?.data?.message || "Failed to delete purchase");
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-6 space-y-8 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold tracking-wide text-xs uppercase mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Stock Restock & Procurement
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Purchases Management
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          New Restock / Purchase
        </button>
      </div>

      {/* TABLE DATA */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-cyan-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading purchases history...</span>
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center p-12 text-slate-500">
            No purchase records found in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4 pl-6">Purchase ID</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="p-4 pl-6 font-bold text-cyan-400">
                      #{purchase.id}
                    </td>
                    <td className="p-4 font-semibold text-slate-100">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-400" />
                        {purchase.supplier?.name || "N/A"}
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <PackageCheck className="w-4 h-4 text-cyan-400" />
                        {purchase.purchaseItems?.length || 0} Products
                      </div>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">
                      ${purchase.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedPurchase(purchase)}
                          className="p-2 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-slate-700/60 hover:border-cyan-500/40 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePurchase(purchase.id)}
                          className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700/60 hover:border-rose-500/40 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL FOR NEW PURCHASE / RESTOCK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/40">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                New Purchase (Stock Restock)
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPurchase} className="p-6 space-y-6">
              {/* SUPPLIER SELECT */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Supplier
                </label>
                <select
                  required
                  value={supplierId}
                  onChange={(e) => setSupplierId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ADD ITEM TO CART SECTION */}
              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                <p className="text-xs font-semibold uppercase text-cyan-400">
                  Add Item to Restock List
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductSelect(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Product --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Cost Price ($)"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>

              {/* CART ITEMS TABLE */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Subtotal</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {cartItems.map((item, index) => {
                      const prod = products.find((p) => p.id === item.productId);
                      return (
                        <tr key={index}>
                          <td className="p-3 font-medium text-slate-200">
                            {prod?.name || `#${item.productId}`}
                          </td>
                          <td className="p-3 text-slate-300">{item.quantity}</td>
                          <td className="p-3 text-slate-300">${item.price}</td>
                          <td className="p-3 font-bold text-cyan-400">
                            ${(item.quantity * item.price).toFixed(2)}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveFromCart(index)}
                              className="text-rose-400 hover:text-rose-300 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* TOTAL & ACTIONS */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <p className="text-xs text-slate-400">Total Purchase Amount</p>
                  <h4 className="text-2xl font-bold text-emerald-400">
                    ${calculateTotal().toFixed(2)}
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:opacity-95 disabled:opacity-50"
                  >
                    {submitLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Complete Restock
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PURCHASE DETAILS MODAL */}
      {selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">
                Purchase Details #{selectedPurchase.id}
              </h3>
              <button
                onClick={() => setSelectedPurchase(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1 text-slate-300">
              <p>
                <strong>Supplier:</strong> {selectedPurchase.supplier?.name}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedPurchase.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Total Amount:</strong>{" "}
                <span className="text-emerald-400 font-bold">
                  ${selectedPurchase.totalAmount}
                </span>
              </p>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Item Name</th>
                    <th className="p-2.5">Qty</th>
                    <th className="p-2.5">Price</th>
                    <th className="p-2.5">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {selectedPurchase.purchaseItems?.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5 text-slate-200">{item.productName}</td>
                      <td className="p-2.5 text-slate-300">{item.quantity}</td>
                      <td className="p-2.5 text-slate-300">${item.price}</td>
                      <td className="p-2.5 font-bold text-cyan-400">
                        ${item.subTotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, DollarSign, CheckCircle, Loader2 } from "lucide-react";
import api from "../api/api"; // Hubi wadada backend API-gaaga

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function RegisterSale() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // 1. Soo qaad alaabta backend-ka
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products");
        if (res.data?.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Ku dar Cart-ka
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // 3. Badal tirada Cart-ka
  const updateQuantity = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 4. Dhameystir iibka (Backend Post Request)
  const handleCheckout = async (paymentMethod: string) => {
    if (cart.length === 0) return;
    try {
      setCheckoutLoading(true);
      const saleData = {
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity, price: item.price })),
        totalAmount: total,
        paymentMethod,
      };

      await api.post("/sales", saleData);
      setSuccessMsg(true);
      setCart([]);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
      
      {/* BIDIX: ALAABTA IYO RAADINTA */}
      <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
        
        {/* Search & Categories */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Raadi badeecad ama skaan gareey barcode-ka..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#101631] pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-rose-600 text-white"
                    : "bg-[#101631] text-slate-400 border border-white/5 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Alaabta Grid-keeda */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-rose-500" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto pr-1 flex-1">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#101631] p-4 text-left hover:border-rose-500/50 hover:bg-slate-800/50 transition group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    {product.category || "General"}
                  </span>
                  <h3 className="font-bold text-white text-sm mt-1 group-hover:text-rose-400 transition">
                    {product.name}
                  </h3>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-base font-black text-emerald-400">${product.price}</span>
                  <span className="rounded-lg bg-rose-500/10 p-1.5 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition">
                    <Plus size={16} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MIDIG: CART-KA IYO CHECKOUT-KA */}
      <div className="rounded-2xl border border-white/10 bg-[#101631] p-5 flex flex-col justify-between shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-rose-400" size={20} />
              <h2 className="font-bold text-white">Current Order</h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold">{cart.length} items</span>
          </div>

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400 font-semibold">
              <CheckCircle size={16} /> Iibku si toos ah ayuu u dhacay!
            </div>
          )}

          {/* Item-maanta Cart-ka ku jira */}
          <div className="space-y-3 max-h-[42vh] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <p className="text-center py-12 text-xs text-slate-500">Cart-ku waa madhan yahay</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl bg-[#0a1026] p-3 border border-white/5">
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <span className="text-xs text-emerald-400 font-semibold">${item.price * item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="rounded-md bg-white/5 p-1 text-slate-300 hover:bg-white/10"
                    >
                      {item.quantity === 1 ? <Trash2 size={13} className="text-rose-400" /> : <Minus size={13} />}
                    </button>
                    <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="rounded-md bg-white/5 p-1 text-slate-300 hover:bg-white/10"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Xisaabta iyo Badhamada Lacag Bixinta */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="flex items-center justify-between text-white text-lg font-black">
            <span>Wadarta (Total)</span>
            <span className="text-emerald-400">${total.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              disabled={cart.length === 0 || checkoutLoading}
              onClick={() => handleCheckout("CASH")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-white hover:bg-white/10 disabled:opacity-50"
            >
              <DollarSign size={15} /> Cash
            </button>
            <button
              disabled={cart.length === 0 || checkoutLoading}
              onClick={() => handleCheckout("MOBILE_MONEY")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-white hover:bg-white/10 disabled:opacity-50"
            >
              <CreditCard size={15} /> Zaad / eDahab
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
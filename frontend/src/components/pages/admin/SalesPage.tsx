import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  User,
  CreditCard,
  Banknote,
  CheckCircle2,
  Loader2,
  Package,
  X,
  Printer,
  Smartphone,
  Tag,
  Download,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
}

interface Customer {
  id: number;
  name: string;
  phoneNumber: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

type PaymentMethod = "CASH" | "ZAAD" | "EDAHAB" | "SAHAL" | "CARD";

interface CompletedSale {
  id?: number | string;
  date: string;
  customerName: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  total: number;
  discount?: number;
  paidAmount: number;
  changeAmount: number;
  paymentMethod: PaymentMethod;
}

const Sales = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ZAAD");
  const [paidAmount, setPaidAmount] = useState("");
  const [discount, setDiscount] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [processingSale, setProcessingSale] = useState(false);

  // Receipt Modal State
  const [completedSaleData, setCompletedSaleData] = useState<CompletedSale | null>(null);

  // FETCH PRODUCTS + CUSTOMERS
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, customersResponse] = await Promise.all([
          api.get("/products"),
          api.get("/customers"),
        ]);

        if (productsResponse.data.success) {
          setProducts(productsResponse.data.data);
        }

        if (customersResponse.data.success) {
          setCustomers(customersResponse.data.data);
        }
      } catch (error) {
        console.error("Error loading POS data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // EXPORT TO EXCEL / CSV FUNCTION
  const exportCartToExcel = () => {
    if (cart.length === 0) {
      alert("Cart-ku waa madhan yahay! Ku dar alaab si aad xogta u export-garayso.");
      return;
    }

    const exportData = cart.map((item, index) => ({
      "#": index + 1,
      "Product Name": item.product.name,
      "SKU": item.product.sku,
      "Price ($)": item.product.price.toFixed(2),
      "Quantity": item.quantity,
      "Total ($)": (item.product.price * item.quantity).toFixed(2),
    }));

    const headers = Object.keys(exportData[0]).join(",");
    const rows = exportData.map((row) =>
      Object.values(row)
        .map((val) => `"${val}"`)
        .join(",")
    );

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `POS_Cart_Export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SEARCH PRODUCTS
  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return products;

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query) ||
        product.barcode?.toLowerCase().includes(query)
      );
    });
  }, [products, search]);

  // CART ACTIONS
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.product.id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) {
          alert("Not enough stock available.");
          return currentCart;
        }

        return currentCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId: number) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.product.id !== productId) return item;
        if (item.quantity >= item.product.stock) return item;
        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.product.id !== productId) return item;
          return { ...item, quantity: item.quantity - 1 };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((currentCart) => currentCart.filter((item) => item.product.id !== productId));
  };

  // TOTALS & DISCOUNT COMPUTATION
  const subtotalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const discountVal = Number(discount) || 0;
  const finalTotal = Math.max(0, subtotalAmount - discountVal);

  const paid = Number(paidAmount) || (paymentMethod !== "CASH" ? finalTotal : 0);
  const changeAmount = paid >= finalTotal ? paid - finalTotal : 0;

  // COMPLETE SALE
  const completeSale = async () => {
    if (cart.length === 0) {
      alert("Please add a product to the cart.");
      return;
    }

    if (paid < finalTotal) {
      alert(`Paid amount must be at least $${finalTotal.toFixed(2)}`);
      return;
    }

    try {
      setProcessingSale(true);

      const payload = {
        customerId: customerId ? Number(customerId) : null,
        paymentMethod,
        paidAmount: paid,
        discount: discountVal,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/sales", payload);

      if (response.data.success) {
        const selectedCustomer = customers.find((c) => c.id === Number(customerId));

        const saleReceipt: CompletedSale = {
          id: response.data.data?.id || Date.now(),
          date: new Date().toLocaleString(),
          customerName: selectedCustomer ? selectedCustomer.name : "Walk-in Customer",
          items: cart.map((item) => ({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
          subtotal: subtotalAmount,
          discount: discountVal,
          total: finalTotal,
          paidAmount: paid,
          changeAmount: changeAmount,
          paymentMethod: paymentMethod,
        };

        setCompletedSaleData(saleReceipt);

        setCart([]);
        setCustomerId("");
        setPaidAmount("");
        setDiscount("");

        const productsResponse = await api.get("/products");
        if (productsResponse.data.success) {
          setProducts(productsResponse.data.data);
        }
      } else {
        alert(response.data.message || "Sale failed.");
      }
    } catch (error: any) {
      console.error("Error completing sale:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong while creating the sale."
      );
    } finally {
      setProcessingSale(false);
    }
  };

  const clearCart = () => {
    setCart([]);
    setPaidAmount("");
    setDiscount("");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 10px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-purple-400">Point of Sale</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Sales / POS</h1>
          <p className="mt-2 text-sm text-slate-400">
            Create a new sale and manage your cart.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* EXCEL BUTTON */}
          <button
            onClick={exportCartToExcel}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
          >
            <Download size={18} />
            Export Excel
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#101631] px-4 py-3">
            <ShoppingCart size={18} className="text-purple-400" />
            <span className="text-sm text-slate-400">Cart</span>
            <span className="font-bold text-white">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN POS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
        {/* PRODUCTS SECTION */}
        <div className="rounded-2xl border border-white/10 bg-[#101631]">
          <div className="border-b border-white/10 p-5">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product, SKU or barcode..."
                className="w-full rounded-xl border border-white/10 bg-[#0a1026] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500/50"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex h-80 items-center justify-center">
              <Loader2 size={30} className="animate-spin text-purple-400" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-80 flex-col items-center justify-center">
              <Package size={45} className="text-slate-600" />
              <p className="mt-4 text-sm text-slate-400">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const cartItem = cart.find((item) => item.product.id === product.id);
                const quantityInCart = cartItem?.quantity || 0;
                const outOfStock = product.stock <= 0;

                return (
                  <div
                    key={product.id}
                    className="group rounded-2xl border border-white/10 bg-[#0a1026] p-4 transition hover:border-purple-500/30"
                  >
                    <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-xl bg-[#111a38]">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package size={42} className="text-slate-600" />
                      )}

                      {quantityInCart > 0 && (
                        <div className="absolute right-2 top-2 rounded-full bg-purple-600 px-2.5 py-1 text-xs font-bold text-white">
                          {quantityInCart}
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <h3 className="truncate font-semibold text-white">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        SKU: {product.sku}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-purple-400">
                          ${product.price.toFixed(2)}
                        </span>
                        <span
                          className={`text-xs ${
                            outOfStock
                              ? "text-red-400"
                              : product.stock <= 5
                              ? "text-yellow-400"
                              : "text-emerald-400"
                          }`}
                        >
                          Stock: {product.stock}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        disabled={outOfStock}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-slate-700"
                      >
                        <Plus size={17} />
                        {outOfStock ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CART SECTION */}
        <div className="rounded-2xl border border-white/10 bg-[#101631]">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                <ShoppingCart size={19} className="text-purple-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Current Sale</h2>
                <p className="text-xs text-slate-500">
                  {cart.length} item{cart.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-[380px] space-y-3 overflow-y-auto p-5">
            {cart.length === 0 ? (
              <div className="flex h-52 flex-col items-center justify-center">
                <ShoppingCart size={40} className="text-slate-700" />
                <p className="mt-4 text-sm text-slate-500">
                  Your cart is empty
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Add products to start a sale
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="rounded-xl border border-white/5 bg-[#0a1026] p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {item.product.name}
                      </p>
                      <p className="mt-1 text-xs text-purple-400">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-600 hover:text-red-400"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111a38] p-1">
                      <button
                        onClick={() => decreaseQuantity(item.product.id)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.product.id)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CHECKOUT */}
          <div className="border-t border-white/10 p-5">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                <User size={14} />
                Customer (Optional)
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0a1026] px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
              >
                <option value="">Select customer (Walk-in)</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} — {customer.phoneNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* PAYMENT METHOD SELECTION */}
            <div className="mt-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                <CreditCard size={14} />
                Payment Method
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "ZAAD", label: "Zaad", icon: Smartphone },
                  { id: "EDAHAB", label: "eDahab", icon: Smartphone },
                  { id: "SAHAL", label: "Sahal", icon: Smartphone },
                  { id: "CASH", label: "Cash", icon: Banknote },
                  { id: "CARD", label: "Card", icon: CreditCard },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as PaymentMethod)}
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl border py-2.5 text-xs font-semibold transition ${
                        isSelected
                          ? "border-purple-500 bg-purple-500/10 text-purple-400 shadow-md shadow-purple-500/10"
                          : "border-white/10 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      <Icon size={15} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DISCOUNT INPUT */}
            <div className="mt-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                <Tag size={14} />
                Discount ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-white/10 bg-[#0a1026] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
              />
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white">${subtotalAmount.toFixed(2)}</span>
              </div>
              {discountVal > 0 && (
                <div className="flex justify-between text-sm text-red-400">
                  <span>Discount</span>
                  <span>-${discountVal.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-purple-400">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-slate-400">
                Paid Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder={finalTotal ? finalTotal.toFixed(2) : "0.00"}
                className="w-full rounded-xl border border-white/10 bg-[#0a1026] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
              />
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-500/10 px-4 py-3">
              <span className="text-sm text-emerald-400">Change</span>
              <span className="font-bold text-emerald-400">
                ${changeAmount.toFixed(2)}
              </span>
            </div>

            <button
              onClick={completeSale}
              disabled={processingSale || cart.length === 0}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {processingSale ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Complete Sale
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RECEIPT MODAL */}
      {completedSaleData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#101631] p-6 text-white shadow-2xl">
            <div className="no-print mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-400">
                <CheckCircle2 size={20} /> Sale Completed!
              </h3>
              <button
                onClick={() => setCompletedSaleData(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div id="printable-receipt" className="font-mono text-sm text-slate-800">
              <div className="mb-3 border-b border-dashed border-gray-400 pb-3 text-center">
                <h2 className="text-xl font-bold uppercase tracking-wider">POS STORE</h2>
                <p className="text-xs text-gray-500">Hargeisa, Somalia</p>
                <p className="text-xs text-gray-500">Invoice: #{completedSaleData.id}</p>
                <p className="text-xs text-gray-500">{completedSaleData.date}</p>
              </div>

              <div className="mb-3 text-xs">
                <p><strong>Customer:</strong> {completedSaleData.customerName}</p>
                <p><strong>Payment Method:</strong> {completedSaleData.paymentMethod}</p>
              </div>

              <table className="mb-3 w-full border-b border-dashed border-gray-400 pb-2 text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-1">Item</th>
                    <th className="text-center">Qty</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {completedSaleData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="max-w-[100px] truncate py-1">{item.name}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right">${item.price.toFixed(2)}</td>
                      <td className="text-right">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mb-3 space-y-1 border-b border-dashed border-gray-400 pb-3 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${completedSaleData.subtotal.toFixed(2)}</span>
                </div>
                {!!completedSaleData.discount && completedSaleData.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-${completedSaleData.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span>TOTAL:</span>
                  <span>${completedSaleData.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid Amount:</span>
                  <span>${completedSaleData.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Change:</span>
                  <span>${completedSaleData.changeAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-gray-500">
                <p>Mahadsanid! Waad ku mahadsantahay iibsigaaga.</p>
              </div>
            </div>

            <div className="no-print mt-6 flex gap-3">
              <button
                onClick={handlePrint}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                <Printer size={18} /> Print Receipt
              </button>
              <button
                onClick={() => setCompletedSaleData(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
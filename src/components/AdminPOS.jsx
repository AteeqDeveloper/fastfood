import { useState, useMemo, useEffect, useRef } from "react";
import { deals } from "../data/deals";
import { supabaseClient } from "../lib/supabaseClient";
import QuantityStepper from "./QuantityStepper";
import {
  Search,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  Smartphone,
  Utensils,
  ShoppingBag,
  Bike,
  Plus,
  RotateCcw,
  CheckCircle2,
  Receipt,
  Tag,
  Percent,
  X,
  History,
  ArrowRight,
} from "lucide-react";

const ORDER_TYPES = [
  { id: "dine_in", label: "Dine-In", icon: Utensils },
  { id: "takeaway", label: "Takeaway", icon: ShoppingBag },
  { id: "delivery", label: "Delivery", icon: Bike },
];

const TABLES = Array.from({ length: 12 }, (_, i) => `Table ${i + 1}`);

const QUICK_CASH = [500, 1000, 1500, 2000, 5000];

export default function AdminPOS({ products = [], session, onOrderCompleted }) {
  // Menu items: Supabase products + deals
  const allItems = useMemo(() => {
    return [...products, ...deals];
  }, [products]);

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(products.map((p) => p.category)), "Deal"];
    return cats;
  }, [products]);

  // POS State
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");
  const [ticketItems, setTicketItems] = useState([]);
  const [orderType, setOrderType] = useState("takeaway");
  const [tableNo, setTableNo] = useState("Table 1");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [discountType, setDiscountType] = useState("none"); // "none" | "5%" | "10%" | "custom"
  const [customDiscount, setCustomDiscount] = useState("");
  const [applyTax, setApplyTax] = useState(false); // 5% GST
  const [paymentMethod, setPaymentMethod] = useState("cash"); // "cash" | "card" | "online"
  const [cashGiven, setCashGiven] = useState("");
  const [heldOrders, setHeldOrders] = useState([]);
  const [recentBills, setRecentBills] = useState([]);
  const [showRecentBills, setShowRecentBills] = useState(false);
  const [placing, setPlacing] = useState(false);

  // Receipt Modal State
  const [receiptData, setReceiptData] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Filtered menu
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchCat =
        selectedCat === "All" ||
        item.category === selectedCat ||
        (selectedCat === "Deal" && item.category === "Deal");
      const matchSearch =
        !search.trim() ||
        item.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        String(item.id).includes(search.trim());
      return matchCat && matchSearch;
    });
  }, [allItems, selectedCat, search]);

  // Cart operations
  const addToTicket = (product) => {
    setTicketItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          category: product.category,
          image: product.image,
          qty: 1,
          notes: "",
        },
      ];
    });
  };

  const updateTicketQty = (id, delta) => {
    setTicketItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeTicketItem = (id) => {
    setTicketItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItemNotes = (id, notes) => {
    setTicketItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, notes } : i))
    );
  };

  const clearTicket = () => {
    setTicketItems([]);
    setDiscountType("none");
    setCustomDiscount("");
    setCashGiven("");
    setCustomer({ name: "", phone: "", address: "" });
  };

  // Calculations
  const subtotal = useMemo(() => {
    return ticketItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [ticketItems]);

  const discountAmount = useMemo(() => {
    if (discountType === "5%") return Math.round(subtotal * 0.05);
    if (discountType === "10%") return Math.round(subtotal * 0.1);
    if (discountType === "15%") return Math.round(subtotal * 0.15);
    if (discountType === "custom") {
      const val = Number(customDiscount) || 0;
      return Math.min(val, subtotal);
    }
    return 0;
  }, [subtotal, discountType, customDiscount]);

  const taxAmount = useMemo(() => {
    if (!applyTax) return 0;
    return Math.round((subtotal - discountAmount) * 0.05);
  }, [subtotal, discountAmount, applyTax]);

  const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount);

  const changeDue = useMemo(() => {
    if (paymentMethod !== "cash" || !cashGiven) return 0;
    const given = Number(cashGiven) || 0;
    return Math.max(0, given - grandTotal);
  }, [cashGiven, grandTotal, paymentMethod]);

  // Hold / Recall Order
  const holdCurrentOrder = () => {
    if (ticketItems.length === 0) return;
    const orderToHold = {
      id: `HOLD-${Date.now().toString().slice(-4)}`,
      items: ticketItems,
      orderType,
      tableNo,
      customer,
      subtotal,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setHeldOrders((prev) => [orderToHold, ...prev]);
    clearTicket();
  };

  const recallHeldOrder = (heldOrder) => {
    setTicketItems(heldOrder.items);
    setOrderType(heldOrder.orderType);
    setTableNo(heldOrder.tableNo || "Table 1");
    setCustomer(heldOrder.customer || { name: "", phone: "", address: "" });
    setHeldOrders((prev) => prev.filter((o) => o.id !== heldOrder.id));
  };

  // Charge & Generate Receipt
  const handleChargeOrder = async () => {
    if (ticketItems.length === 0) return;
    setPlacing(true);

    const tokenNo = Math.floor(10 + Math.random() * 90);
    const orderId = `POS-${Date.now().toString().slice(-6)}`;
    const orderRecord = {
      id: orderId,
      customer: customer.name.trim() || (orderType === "dine_in" ? `${tableNo}` : `Walk-in Guest #${tokenNo}`),
      phone: customer.phone.trim() || "",
      address: orderType === "delivery" ? customer.address.trim() : `${orderType.toUpperCase()} - Token #${tokenNo}`,
      items: ticketItems.map((item) => ({
        id: item.id,
        title: item.title + (item.notes ? ` (${item.notes})` : ""),
        price: item.price,
        qty: item.qty,
      })),
      total: grandTotal,
      status: "Preparing",
    };

    // Save to Supabase
    const { error } = await supabaseClient.from("orders").insert(orderRecord);
    setPlacing(false);

    if (error) {
      console.warn("Could not save to Supabase, continuing locally:", error.message);
    }

    const billData = {
      orderId,
      tokenNo,
      orderType,
      tableNo: orderType === "dine_in" ? tableNo : null,
      customer: customer.name.trim() || (orderType === "dine_in" ? tableNo : "Walk-in Guest"),
      phone: customer.phone.trim(),
      address: customer.address.trim(),
      items: [...ticketItems],
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal,
      paymentMethod,
      cashGiven: Number(cashGiven) || grandTotal,
      changeDue,
      cashier: session?.user?.email?.split("@")[0] || "Admin Staff",
      date: new Date().toLocaleString(),
    };

    // Add to recent bills
    setRecentBills((prev) => [billData, ...prev.slice(0, 19)]);
    setReceiptData(billData);
    setShowReceipt(true);
    clearTicket();

    if (onOrderCompleted) onOrderCompleted();
  };

  const reprintBill = (bill) => {
    setReceiptData(bill);
    setShowReceipt(true);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top POS Action Banner */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-chili/10 text-chili flex items-center justify-center font-bold">
            ⚡
          </div>
          <div>
            <h2 className="font-display font-extrabold text-lg text-ink">
              CrispyBites POS &amp; Billing Terminal
            </h2>
            <p className="text-ink/50 text-xs">
              Fast counter ordering, kitchen ticket routing &amp; thermal bill printing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {heldOrders.length > 0 && (
            <div className="flex items-center gap-1.5 bg-turmeric/15 border border-turmeric/30 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-turmeric animate-pulse" />
              <span className="text-xs font-bold text-ink">
                {heldOrders.length} Held Order{heldOrders.length > 1 ? "s" : ""}
              </span>
              <button
                onClick={() => recallHeldOrder(heldOrders[0])}
                className="text-xs font-extrabold text-chili hover:underline ml-1"
              >
                Recall ({heldOrders[0].id})
              </button>
            </div>
          )}

          <button
            onClick={() => setShowRecentBills(!showRecentBills)}
            className="flex items-center gap-1.5 bg-cream hover:bg-ink/10 text-ink text-xs font-semibold px-3 py-2 rounded-full transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span>Recent Bills ({recentBills.length})</span>
          </button>
        </div>
      </div>

      {/* Recent Bills Drawer Modal */}
      {showRecentBills && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-ink/10 animate-pop-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-ink flex items-center gap-2">
              <Receipt className="w-4 h-4 text-chili" />
              Today's POS Invoices ({recentBills.length})
            </h3>
            <button
              onClick={() => setShowRecentBills(false)}
              className="w-7 h-7 rounded-full bg-cream text-ink flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>

          {recentBills.length === 0 ? (
            <p className="text-center py-6 text-ink/40 text-xs">
              No bills printed in this session yet. Complete an order to view and reprint bills.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto scroll-thin">
              {recentBills.map((bill) => (
                <div
                  key={bill.orderId}
                  className="bg-cream/40 border border-ink/5 rounded-xl p-3 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono font-bold text-xs text-ink">{bill.orderId}</p>
                      <p className="text-[11px] text-ink/50 capitalize">
                        {bill.orderType} · {bill.customer}
                      </p>
                      <p className="text-[10px] text-ink/40">{bill.date}</p>
                    </div>
                    <span className="font-display font-extrabold text-sm text-chili">
                      Rs. {bill.grandTotal}
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-ink/5 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-semibold text-basil">
                      ✓ Paid via {bill.paymentMethod}
                    </span>
                    <button
                      onClick={() => reprintBill(bill)}
                      className="flex items-center gap-1 bg-white border border-ink/10 text-xs font-semibold px-2.5 py-1 rounded-full text-ink hover:text-chili hover:border-chili transition-colors"
                    >
                      <Printer className="w-3 h-3" />
                      Reprint
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MAIN POS WORKSPACE: 2 COLUMNS (Grid Left, Ticket Right) */}
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.3fr_0.7fr] gap-6 items-start">
        {/* LEFT COLUMN: Menu Browser */}
        <div className="flex flex-col gap-4">
          {/* Search + Category Tabs */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-ink/5 flex flex-col gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food item, deal, code..."
                className="w-full bg-cream rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCat === cat
                      ? "bg-chili text-white shadow-sm"
                      : "bg-cream text-ink/70 hover:bg-ink/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-3">
            {filteredItems.map((product) => {
              const ticketItem = ticketItems.find((i) => i.id === product.id);
              const qtyInTicket = ticketItem ? ticketItem.qty : 0;

              return (
                <button
                  key={product.id}
                  onClick={() => addToTicket(product)}
                  className={`relative group bg-white rounded-2xl p-3 border text-left flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    qtyInTicket > 0
                      ? "border-chili ring-1 ring-chili shadow-sm"
                      : "border-ink/5 hover:border-ink/20"
                  }`}
                >
                  {qtyInTicket > 0 && (
                    <span className="absolute -top-2 -right-2 bg-chili text-white font-extrabold text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-md z-10 animate-pop-in">
                      {qtyInTicket}
                    </span>
                  )}

                  <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2.5 bg-cream">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-charcoal/80 text-cream text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {product.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-ink leading-snug line-clamp-1">
                      {product.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="font-display font-extrabold text-sm text-chili">
                        Rs. {product.price}
                      </span>
                      <span className="text-[11px] font-bold text-ink/40 bg-cream px-2 py-0.5 rounded-full group-hover:bg-chili group-hover:text-white transition-colors">
                        + Add
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-ink/5">
              <p className="text-3xl mb-2">🍽️</p>
              <p className="text-sm font-semibold text-ink">No menu items found</p>
              <p className="text-xs text-ink/50 mt-1">Try another category or search term</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Active Ticket & Billing Register */}
        <div className="bg-white rounded-2xl shadow-lg border border-ink/10 p-5 sticky top-20 flex flex-col gap-4">
          {/* Ticket Header & Order Type */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-ink/10">
              <div>
                <h3 className="font-display font-extrabold text-base text-ink">
                  Current Order
                </h3>
                <p className="text-[11px] text-ink/40">
                  {ticketItems.length} item{ticketItems.length === 1 ? "" : "s"} selected
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={holdCurrentOrder}
                  disabled={ticketItems.length === 0}
                  className="bg-cream hover:bg-turmeric/20 text-ink/70 disabled:opacity-30 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                  title="Park this order"
                >
                  Hold
                </button>
                <button
                  onClick={clearTicket}
                  disabled={ticketItems.length === 0}
                  className="bg-cream hover:bg-red-50 text-red-600 disabled:opacity-30 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                  title="Clear all items"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Order Type Tabs */}
            <div className="grid grid-cols-3 gap-1.5 mt-3 bg-cream p-1 rounded-xl">
              {ORDER_TYPES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setOrderType(id)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    orderType === id
                      ? "bg-white text-chili shadow-sm"
                      : "text-ink/60 hover:text-ink"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Sub-inputs based on Order Type */}
            {orderType === "dine_in" && (
              <div className="mt-3">
                <label className="text-[10px] font-bold uppercase text-ink/50 block mb-1">
                  Select Table
                </label>
                <select
                  value={tableNo}
                  onChange={(e) => setTableNo(e.target.value)}
                  className="w-full bg-cream rounded-xl px-3 py-1.5 text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-chili"
                >
                  {TABLES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {orderType === "delivery" && (
              <div className="mt-3 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="bg-cream rounded-xl px-3 py-1.5 text-xs text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili"
                  />
                  <input
                    type="tel"
                    placeholder="Phone No"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="bg-cream rounded-xl px-3 py-1.5 text-xs text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Delivery Address"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="bg-cream rounded-xl px-3 py-1.5 text-xs text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili"
                />
              </div>
            )}
          </div>

          {/* Ticket Items List */}
          <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto scroll-thin pr-1 border-b border-ink/10 pb-3">
            {ticketItems.length === 0 ? (
              <div className="text-center py-8 text-ink/30 text-xs font-medium">
                Tap items on the left to add to bill
              </div>
            ) : (
              ticketItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-cream/50 rounded-xl p-2.5 flex flex-col gap-1.5 border border-ink/5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-ink truncate">{item.title}</p>
                      <p className="text-[11px] text-chili font-extrabold">
                        Rs. {item.price * item.qty}{" "}
                        <span className="text-ink/40 font-normal">
                          (Rs. {item.price} each)
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <QuantityStepper
                        quantity={item.qty}
                        onIncrement={() => updateTicketQty(item.id, 1)}
                        onDecrement={() => updateTicketQty(item.id, -1)}
                        label={item.title}
                        size="sm"
                      />
                      <button
                        onClick={() => removeTicketItem(item.id)}
                        className="w-6 h-6 rounded-full hover:bg-red-100 text-ink/40 hover:text-red-600 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Kitchen Special Note */}
                  <input
                    type="text"
                    value={item.notes || ""}
                    onChange={(e) => updateItemNotes(item.id, e.target.value)}
                    placeholder="Kitchen note (e.g. Extra spicy, no mayo)..."
                    className="w-full bg-white rounded-lg px-2 py-1 text-[11px] text-ink placeholder:text-ink/30 focus:outline-none focus:ring-1 focus:ring-chili"
                  />
                </div>
              ))
            )}
          </div>

          {/* Discount & Tax Row */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-ink/60 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Discount:
              </span>
              <div className="flex items-center gap-1">
                {["none", "5%", "10%", "15%"].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDiscountType(d);
                      if (d !== "custom") setCustomDiscount("");
                    }}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${
                      discountType === d
                        ? "bg-chili text-white"
                        : "bg-cream text-ink/60 hover:bg-ink/10"
                    }`}
                  >
                    {d === "none" ? "0%" : d}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink/60 flex items-center gap-1">
                <Percent className="w-3 h-3" /> Add 5% GST Tax:
              </span>
              <button
                onClick={() => setApplyTax(!applyTax)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${
                  applyTax
                    ? "bg-basil text-white"
                    : "bg-cream text-ink/60 hover:bg-ink/10"
                }`}
              >
                {applyTax ? "TAX ON (5%)" : "TAX OFF (0%)"}
              </button>
            </div>
          </div>

          {/* Bill Totals Summary */}
          <div className="bg-cream/60 rounded-xl p-3 flex flex-col gap-1.5 border border-ink/5">
            <div className="flex justify-between text-xs text-ink/60">
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-chili font-semibold">
                <span>Discount ({discountType})</span>
                <span>−Rs. {discountAmount}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between text-xs text-basil font-semibold">
                <span>GST Tax (5%)</span>
                <span>+Rs. {taxAmount}</span>
              </div>
            )}
            <div className="border-t border-ink/10 pt-2 flex justify-between items-baseline">
              <span className="font-display font-bold text-sm text-ink">Net Payable</span>
              <span className="font-display font-extrabold text-2xl text-chili">
                Rs. {grandTotal}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-[10px] font-bold uppercase text-ink/50 block mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "cash", label: "Cash", icon: Banknote },
                { id: "card", label: "Card / POS", icon: CreditCard },
                { id: "online", label: "Jazz / Easy", icon: Smartphone },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setPaymentMethod(id)}
                  className={`flex flex-col items-center py-2 rounded-xl text-xs font-bold transition-all border ${
                    paymentMethod === id
                      ? "bg-charcoal text-white border-charcoal shadow-sm"
                      : "bg-cream text-ink/70 border-transparent hover:bg-ink/10"
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Quick Cash Tendered & Change Return Calculator */}
            {paymentMethod === "cash" && (
              <div className="mt-3 bg-cream/40 border border-ink/5 rounded-xl p-2.5 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-ink/60">Cash Received:</span>
                  <input
                    type="number"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(e.target.value)}
                    placeholder={`Rs. ${grandTotal}`}
                    className="w-28 bg-white rounded-lg px-2.5 py-1 text-right text-xs font-bold text-ink focus:outline-none focus:ring-1 focus:ring-chili"
                  />
                </div>

                <div className="flex gap-1 overflow-x-auto">
                  {QUICK_CASH.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setCashGiven(String(amt))}
                      className="shrink-0 bg-white border border-ink/10 text-[10px] font-bold px-2 py-1 rounded-md hover:border-chili text-ink"
                    >
                      Rs. {amt}
                    </button>
                  ))}
                  <button
                    onClick={() => setCashGiven(String(grandTotal))}
                    className="shrink-0 bg-white border border-chili text-[10px] font-bold px-2 py-1 rounded-md text-chili"
                  >
                    Exact
                  </button>
                </div>

                {Number(cashGiven) > 0 && (
                  <div className="flex justify-between items-center bg-white px-2.5 py-1.5 rounded-lg border border-ink/5 mt-1">
                    <span className="text-xs font-semibold text-ink/60">Change to Return:</span>
                    <span className="font-display font-extrabold text-sm text-basil">
                      Rs. {changeDue}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Checkout & Bill Action */}
          <button
            onClick={handleChargeOrder}
            disabled={ticketItems.length === 0 || placing}
            className="w-full bg-chili hover:bg-chili-dark disabled:opacity-40 text-white font-display font-extrabold text-base py-3.5 rounded-2xl shadow-lg shadow-chili/25 transition-all flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            <span>
              {placing ? "Processing..." : `Charge & Print Bill (Rs. ${grandTotal})`}
            </span>
          </button>
        </div>
      </div>

      {/* MODAL: Thermal & Standard Receipt Printer Preview */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setShowReceipt(false)} />

          <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl z-10 animate-pop-in flex flex-col max-h-[90vh]">
            {/* Header controls (Screen only) */}
            <div className="no-print bg-charcoal text-cream px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-turmeric" />
                <span className="font-display font-bold text-sm">Invoice #{receiptData.orderId}</span>
              </div>
              <button
                onClick={() => setShowReceipt(false)}
                className="w-7 h-7 rounded-full bg-charcoal-light flex items-center justify-center text-cream/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Printable Thermal Receipt Body */}
            <div className="p-6 overflow-y-auto scroll-thin font-mono text-ink text-xs leading-relaxed bg-white receipt-print-area">
              {/* Restaurant Header */}
              <div className="text-center pb-3 border-b border-dashed border-ink/20">
                <h2 className="font-display font-extrabold text-2xl text-ink tracking-tight uppercase">
                  CrispyBites
                </h2>
                <p className="text-[10px] text-ink/70">Grill-First Kitchen &amp; Fast Food</p>
                <p className="text-[10px] text-ink/70">Main Boulevard, Karachi, Pakistan</p>
                <p className="text-[10px] text-ink/70">Tel: 0300-1234567 | NTN: 9876543-2</p>
              </div>

              {/* Order Meta */}
              <div className="py-2.5 border-b border-dashed border-ink/20 flex flex-col gap-0.5 text-[11px]">
                <div className="flex justify-between font-bold">
                  <span>Order: {receiptData.orderId}</span>
                  <span className="bg-ink text-white px-1.5 rounded text-[10px] font-sans">
                    TOKEN #{receiptData.tokenNo}
                  </span>
                </div>
                <div className="flex justify-between text-ink/70">
                  <span>Date: {receiptData.date}</span>
                  <span className="capitalize">{receiptData.orderType}</span>
                </div>
                {receiptData.tableNo && (
                  <div className="text-ink font-bold">Table: {receiptData.tableNo}</div>
                )}
                <div className="flex justify-between text-ink/70">
                  <span>Customer: {receiptData.customer}</span>
                  <span>Biller: {receiptData.cashier}</span>
                </div>
                {receiptData.phone && (
                  <div className="text-ink/70">Phone: {receiptData.phone}</div>
                )}
                {receiptData.address && (
                  <div className="text-ink/70 text-[10px] truncate">
                    Address: {receiptData.address}
                  </div>
                )}
              </div>

              {/* Itemized Table */}
              <div className="py-3 border-b border-dashed border-ink/20">
                <div className="grid grid-cols-[1fr_30px_50px_60px] font-bold pb-1 text-[11px] border-b border-ink/10">
                  <span>ITEM</span>
                  <span className="text-center">QTY</span>
                  <span className="text-right">RATE</span>
                  <span className="text-right">AMT</span>
                </div>

                <div className="flex flex-col gap-1.5 pt-2">
                  {receiptData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[1fr_30px_50px_60px] text-[11px] items-start"
                    >
                      <div className="min-w-0 pr-1">
                        <p className="font-semibold truncate">{item.title}</p>
                        {item.notes && (
                          <p className="text-[9px] text-ink/50 italic">*{item.notes}</p>
                        )}
                      </div>
                      <span className="text-center">{item.qty}</span>
                      <span className="text-right">{item.price}</span>
                      <span className="text-right font-bold">{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Calculations */}
              <div className="py-2.5 border-b border-dashed border-ink/20 flex flex-col gap-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Gross Subtotal:</span>
                  <span>Rs. {receiptData.subtotal}</span>
                </div>
                {receiptData.discountAmount > 0 && (
                  <div className="flex justify-between text-chili">
                    <span>Discount:</span>
                    <span>−Rs. {receiptData.discountAmount}</span>
                  </div>
                )}
                {receiptData.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>GST (5%):</span>
                    <span>+Rs. {receiptData.taxAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold pt-1 border-t border-ink/10 text-ink">
                  <span>NET TOTAL:</span>
                  <span>Rs. {receiptData.grandTotal}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="py-2 border-b border-dashed border-ink/20 flex flex-col gap-0.5 text-[10px] text-ink/70">
                <div className="flex justify-between uppercase">
                  <span>Payment Mode:</span>
                  <span className="font-bold text-ink">{receiptData.paymentMethod}</span>
                </div>
                {receiptData.paymentMethod === "cash" && (
                  <>
                    <div className="flex justify-between">
                      <span>Cash Tendered:</span>
                      <span>Rs. {receiptData.cashGiven}</span>
                    </div>
                    <div className="flex justify-between font-bold text-ink">
                      <span>Change Returned:</span>
                      <span>Rs. {receiptData.changeDue}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Note & Barcode Simulation */}
              <div className="pt-4 text-center flex flex-col items-center gap-1 text-[10px] text-ink/60">
                <p className="font-bold text-ink">THANK YOU FOR DINING WITH US!</p>
                <p>Hot, Fresh &amp; Plated Properly.</p>
                <p className="text-[9px]">Follow us on Instagram @crispybites.pk</p>

                {/* Barcode Visual */}
                <div className="mt-2 tracking-widest font-mono text-base font-bold select-none text-ink/80">
                  ||||| | |||| || |||||| | |||||
                </div>
                <span className="text-[8px] text-ink/40">*{receiptData.orderId}*</span>
              </div>
            </div>

            {/* Modal Actions (Screen only) */}
            <div className="no-print p-4 bg-cream/70 border-t border-ink/10 flex gap-2.5">
              <button
                onClick={printReceipt}
                className="flex-1 bg-chili hover:bg-chili-dark text-white font-semibold py-3 rounded-full text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Thermal Receipt</span>
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="bg-white border border-ink/15 text-ink font-semibold px-5 py-3 rounded-full text-sm hover:bg-cream transition-colors"
              >
                Next Order →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

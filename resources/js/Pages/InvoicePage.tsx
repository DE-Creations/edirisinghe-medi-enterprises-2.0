import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import { initialProducts, initialCustomers, nextInvoiceNumber, type InvoiceItem, type Product, type Customer } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { FloatingInput } from '@/components/ui/floating-input';
import SearchBar from '@/components/shared/SearchBar';
import { ShoppingCart, Plus, Minus, Trash2, Printer, Barcode, Save } from 'lucide-react';

function InvoicePage() {
  const [invoiceNum] = useState(nextInvoiceNumber());
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cart, setCart] = useState<InvoiceItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'cheque'>('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const products = initialProducts;
  const customers = initialCustomers;

  const customerOptions = [
    { value: '', label: 'Walk-in Customer' },
    ...customers.map((c) => ({ value: c.id, label: c.name })),
  ];

  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const discountedTotal = Math.max(0, total - Number(discount || 0));
  const balance = Number(paidAmount || 0) - discountedTotal;

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === p.id);
      if (existing) return prev.map((c) => c.productId === p.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { productId: p.id, name: p.name, brand: p.brand, category: p.category, qty: 1, price: p.price, mfgDate: p.mfgDate, expDate: p.expDate }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) => prev.map((c) => c.productId === productId ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  };

  const handleBarcode = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && barcodeInput) {
      const p = products.find((pr) => pr.barcode === barcodeInput);
      if (p) addToCart(p);
      setBarcodeInput('');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.barcode.includes(productSearch)
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)] animate-fade-in">
      {/* Left: Product Selection */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Barcode Scanner */}
        <div className="bg-card rounded-xl border border-border p-4 mb-4">
          <div className="flex gap-3">
            <div className="relative w-3/5">
              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcode}
                placeholder="Scan barcode or enter code..."
                className="pl-9 h-10"
                autoFocus
              />
            </div>
            <div className="w-2/5">
              <SearchBar value={productSearch} onChange={setProductSearch} placeholder="Search products..." />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="bg-card border border-border rounded-lg p-3 text-left hover:border-primary hover:shadow-md transition-all group"
              >
                <p className="text-xs font-semibold truncate group-hover:text-primary">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">{p.brand}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold text-primary">Rs. {p.price}</span>
                  <span className="text-[10px] text-muted-foreground">Stk: {p.stock}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Cart & Payment */}
      <div className="w-full lg:w-[380px] flex flex-col bg-card rounded-xl border border-border">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 shrink-0">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Invoice #{invoiceNum}</span>
            </div>
            <DatePicker value={invoiceDate} onChange={setInvoiceDate} className="h-8 text-xs px-2" />
          </div>
          <Combobox
            options={customerOptions}
            value={selectedCustomer}
            onValueChange={setSelectedCustomer}
            placeholder="Walk-in Customer"
            searchPlaceholder="Search customers..."
            className="mt-3 h-9 text-sm"
          />
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">Cart is empty</p>
              <p className="text-xs">Scan or click products to add</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">Rs. {item.price} each</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.productId, -1)} className="h-6 w-6 rounded bg-background border border-border flex items-center justify-center hover:bg-accent">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-semibold">{item.qty}</span>
                  <button onClick={() => updateQty(item.productId, 1)} className="h-6 w-6 rounded bg-background border border-border flex items-center justify-center hover:bg-accent">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="text-xs font-bold w-16 text-right">Rs. {item.qty * item.price}</span>
                <button onClick={() => removeFromCart(item.productId)} className="text-destructive hover:bg-destructive/10 rounded p-1">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Payment */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({cart.length} items)</span>
            <span className="font-semibold">Rs. {total.toLocaleString()}</span>
          </div>
          {Number(discount) > 0 && (
            <div className="flex justify-between text-sm text-destructive">
              <span>Discount</span>
              <span>- Rs. {Number(discount).toLocaleString()}</span>
            </div>
          )}

          <div className="flex gap-2">
            {(['cash', 'card', 'cheque'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setPaymentMethod(m)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${paymentMethod === m ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
              >
                {m === 'cash' ? '💵 Cash' : m === 'card' ? '💳 Card' : '🏦 Cheque'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <FloatingInput
              label="Discount (Rs.)"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <FloatingInput
              label="Paid Amount"
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <FloatingInput
              label="Balance"
              value={`Rs. ${Math.abs(balance).toLocaleString()}`}
              readOnly
              className={`cursor-default ${balance >= 0 ? 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'text-destructive bg-destructive/5 border-destructive/30'}`}
            />
          </div>

          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-[10px] text-muted-foreground">TOTAL</p>
            <p className="text-2xl font-bold text-primary">Rs. {discountedTotal.toLocaleString()}</p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white" disabled={cart.length === 0}>
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button className="flex-1 gap-2" disabled={cart.length === 0}>
              <Printer className="h-4 w-4" /> Save & Print
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function WrappedInvoicePage() {
  return (
    <>
      <Head title="Invoice" />
      <InvoicePage />
    </>
  );
}

(WrappedInvoicePage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

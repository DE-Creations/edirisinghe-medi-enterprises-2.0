// import { Head } from '@inertiajs/react';
// import AppShell from '@/AppShell';
// import React, { useEffect, useRef, useState } from 'react';
// import { initialProducts, initialCustomers, nextInvoiceNumber, type InvoiceItem, type Product} from '@/data/mockData';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Combobox } from '@/components/ui/combobox';
// import { DatePicker } from '@/components/ui/date-picker';
// import { format } from 'date-fns';
// import { FloatingInput } from '@/components/ui/floating-input';
// import SearchBar from '@/components/shared/SearchBar';
// import { ShoppingCart, Plus, Minus, Trash2, Printer, Barcode, Save } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'sonner';

// interface Customer { id: string; name: string; }

// function InvoicePage() {
//   const [invoiceNum,setInvoiceNum]= useState('INV-0001');
//   const [invoiceDate, setInvoiceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [barcodeInput, setBarcodeInput] = useState('');
//   const [cart, setCart] = useState<InvoiceItem[]>([]);
//   const [selectedCustomer, setSelectedCustomer] = useState<string>('');
//   const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'cheque'>('cash');
//   const [paidAmount, setPaidAmount] = useState('');
//   const [discount, setDiscount] = useState('');
//   const [productSearch, setProductSearch] = useState('');
//   const [customers,setCustomers] = useState<Customer[]>([]);
//   const [saving,setSaving] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const products = initialProducts;

//   useEffect(() => {
//       fetchFormData();
//       fetchNextNumber();
//       inputRef.current?.focus();
//   }, []);

//   const fetchNextNumber = async () => {
//       try {
//           const res = await axios.get('/invoice/next-number');
//           setInvoiceNum(res.data.invoice_number);
//       } catch (e) { console.log(e); }
//   };

//   const fetchFormData = async () => {
//       try {
//           const res = await axios.get('/invoice/form-data');
//           setCustomers(res.data.customers);
//         //   setProducts(res.data.products);
//       } catch (error: any) { console.log('Form data error:', error.response?.data); }
//   };

//   const customerOptions = [
//     { value: '', label: 'Walk-in Customer' },
//     ...customers.map((c) => ({ value: c.id, label: c.name })),
//   ];

//   const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
//   const discountedTotal = Math.max(0, total - Number(discount || 0));
//   const balance = Number(paidAmount || 0) - discountedTotal;

//   const addToCart = (p: Product) => {
//     setCart((prev) => {
//       const existing = prev.find((c) => c.productId === p.id);
//       if (existing) return prev.map((c) => c.productId === p.id ? { ...c, qty: c.qty + 1 } : c);
//       return [...prev, { productId: p.id, name: p.name, brand: p.brand, category: p.category, qty: 1, price: p.price, mfgDate: p.mfgDate, expDate: p.expDate }];
//     });
//   };

//   const updateQty = (productId: string, delta: number) => {
//     setCart((prev) => prev.map((c) => c.productId === productId ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
//   };

//   const removeFromCart = (productId: string) => {
//     setCart((prev) => prev.filter((c) => c.productId !== productId));
//   };

//   const handleBarcode = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && barcodeInput) {
//       const p = products.find((pr) => pr.barcode === barcodeInput);
//       if (p) addToCart(p);
//       setBarcodeInput('');
//     }
//   };

//   const filteredProducts = products.filter((p) =>
//     p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
//     p.barcode.includes(productSearch)
//   );

//   const handleSave = async () => {
//     if (!selectedCustomer) { toast.error('Please select a customer.'); return; }
//     if (cart.length === 0) { toast.error('Please add at least one product.'); return; }

//     setSaving(true);
//     const toastId = toast.loading('Saving Invoice...');

//     try {
//         await axios.post('/invoice/store', {
//             supplier_id:         Number(selectedCustomer),
//             // supplier_invoice_no: invoiceNo || null,
//             received_date:       invoiceDate,
//             // sub_total:           subTotal,
//             discount:            Number(discount || 0),
//             total_amount:        discountedTotal,
//             paid_amount:         Number(paidAmount || 0),
//             payment_method:      paymentMethod,
//             // items: items.map((i) => ({
//             //     product_id:    i.productId,
//             //     quantity:      i.qty,
//             //     unit_price:    i.unitPrice,
//             //     selling_price: i.sellingPrice,
//             //     batch_number:  i.batchNumber || null,
//             //     expiry_date:   i.expiryDate  || null,
//             //     mfd_date:      i.mfdDate     || null,
//             // })),
//         });

//         toast.success('Invoice saved successfully!', { id: toastId });

//         // Reset form
//         // setItems([]);
//         setSelectedCustomer('');
//         // setInvoiceNo('');
//         setDiscount('');
//         setPaidAmount('');
//         setPaymentMethod('cash');
//         await fetchNextNumber(); // get new Invoice number

//     } catch (error: any) {
//         const msg = error.response?.data?.message || 'Failed to save Invoice.';
//         toast.error(msg, { id: toastId });
//         console.log(error.response?.data);
//     } finally {
//         setSaving(false);
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)] animate-fade-in">
//       {/* Left: Product Selection */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Barcode Scanner */}
//         <div className="bg-card rounded-xl border border-border p-4 mb-4">
//           <div className="flex gap-3">
//             <div className="relative w-3/5">
//               <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 ref={inputRef}
//                 value={barcodeInput}
//                 onChange={(e) => setBarcodeInput(e.target.value)}
//                 onKeyDown={handleBarcode}
//                 placeholder="Scan barcode or enter code..."
//                 className="pl-9 h-10"
//                 autoFocus
//               />
//             </div>
//             <div className="w-2/5">
//               <SearchBar value={productSearch} onChange={setProductSearch} placeholder="Search products..." />
//             </div>
//           </div>
//         </div>

//         {/* Product Grid */}
//         <div className="flex-1 overflow-y-auto scrollbar-thin">
//           <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
//             {filteredProducts.map((p) => (
//               <button
//                 key={p.id}
//                 onClick={() => addToCart(p)}
//                 className="bg-card border border-border rounded-lg p-3 text-left hover:border-primary hover:shadow-md transition-all group"
//               >
//                 <p className="text-xs font-semibold truncate group-hover:text-primary">{p.name}</p>
//                 <p className="text-[10px] text-muted-foreground">{p.brand}</p>
//                 <div className="flex justify-between items-center mt-2">
//                   <span className="text-sm font-bold text-primary">Rs. {p.price}</span>
//                   <span className="text-[10px] text-muted-foreground">Stk: {p.stock}</span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right: Cart & Payment */}
//       <div className="w-full lg:w-[380px] flex flex-col bg-card rounded-xl border border-border">
//         {/* Header */}
//         <div className="p-4 border-b border-border">
//           <div className="flex items-center justify-between gap-2">
//             <div className="flex items-center gap-2 shrink-0">
//               <ShoppingCart className="h-4 w-4 text-primary" />
//               <span className="text-sm font-semibold">{invoiceNum}</span>
//             </div>
//             <DatePicker value={invoiceDate} onChange={setInvoiceDate} className="h-8 text-xs px-2" />
//           </div>
//           <Combobox
//             options={customerOptions}
//             value={selectedCustomer}
//             onValueChange={setSelectedCustomer}
//             placeholder="Walk-in Customer"
//             searchPlaceholder="Search customers..."
//             className="mt-3 h-9 text-sm"
//           />
//         </div>

//         {/* Cart Items */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
//           {cart.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
//               <ShoppingCart className="h-10 w-10 mb-2 opacity-30" />
//               <p className="text-sm">Cart is empty</p>
//               <p className="text-xs">Scan or click products to add</p>
//             </div>
//           ) : (
//             cart.map((item) => (
//               <div key={item.productId} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs font-medium truncate">{item.name}</p>
//                   <p className="text-[10px] text-muted-foreground">Rs. {item.price} each</p>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <button onClick={() => updateQty(item.productId, -1)} className="h-6 w-6 rounded bg-background border border-border flex items-center justify-center hover:bg-accent">
//                     <Minus className="h-3 w-3" />
//                   </button>
//                   <span className="w-8 text-center text-xs font-semibold">{item.qty}</span>
//                   <button onClick={() => updateQty(item.productId, 1)} className="h-6 w-6 rounded bg-background border border-border flex items-center justify-center hover:bg-accent">
//                     <Plus className="h-3 w-3" />
//                   </button>
//                 </div>
//                 <span className="text-xs font-bold w-16 text-right">Rs. {item.qty * item.price}</span>
//                 <button onClick={() => removeFromCart(item.productId)} className="text-destructive hover:bg-destructive/10 rounded p-1">
//                   <Trash2 className="h-3.5 w-3.5" />
//                 </button>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Payment */}
//         <div className="border-t border-border p-4 space-y-3">
//           <div className="flex justify-between text-sm">
//             <span className="text-muted-foreground">Subtotal ({cart.length} items)</span>
//             <span className="font-semibold">Rs. {total.toLocaleString()}</span>
//           </div>
//           {Number(discount) > 0 && (
//             <div className="flex justify-between text-sm text-destructive">
//               <span>Discount</span>
//               <span>- Rs. {Number(discount).toLocaleString()}</span>
//             </div>
//           )}

//           <div className="flex gap-2">
//             {(['cash', 'card', 'cheque'] as const).map((m) => (
//               <button
//                 key={m}
//                 onClick={() => setPaymentMethod(m)}
//                 className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${paymentMethod === m ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
//               >
//                 {m === 'cash' ? '💵 Cash' : m === 'card' ? '💳 Card' : '🏦 Cheque'}
//               </button>
//             ))}
//           </div>

//           <div className="grid grid-cols-3 gap-2">
//             <FloatingInput
//               label="Discount (Rs.)"
//               type="number"
//               value={discount}
//               onChange={(e) => setDiscount(e.target.value)}
//               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//             />
//             <FloatingInput
//               label="Paid Amount"
//               type="number"
//               value={paidAmount}
//               onChange={(e) => setPaidAmount(e.target.value)}
//               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//             />
//             <FloatingInput
//               label="Balance"
//               value={`Rs. ${Math.abs(balance).toLocaleString()}`}
//               readOnly
//               className={`cursor-default ${balance >= 0 ? 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'text-destructive bg-destructive/5 border-destructive/30'}`}
//             />
//           </div>

//           <div className="bg-primary/10 rounded-lg p-3 text-center">
//             <p className="text-[10px] text-muted-foreground">TOTAL</p>
//             <p className="text-2xl font-bold text-primary">Rs. {discountedTotal.toLocaleString()}</p>
//           </div>

//           <div className="flex gap-2">
//             <Button onClick={handleSave} className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white" disabled={cart.length === 0}>
//               <Save className="h-4 w-4" /> Save
//             </Button>
//             <Button className="flex-1 gap-2" disabled={cart.length === 0}>
//               <Printer className="h-4 w-4" /> Save & Print
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// export default function WrappedInvoicePage() {
//   return (
//     <>
//       <Head title="Invoice" />
//       <InvoicePage />
//     </>
//   );
// }

// (WrappedInvoicePage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';
import SearchBar from '@/components/shared/SearchBar';
import { ShoppingCart, Plus, Minus, Trash2, Printer, Barcode, Save } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import axios from 'axios';

// --- Types ---
interface StockItem {
    stock_batch_id:   number;
    product_id:       number;
    generic_name:     string;
    barcode_value:    string;
    brand:            string | null;
    category:         string | null;
    purchase_price:   number;
    current_quantity: number;
    expiry_date:      string | null;
    batch_number:     string | null;
}

interface CartItem {
    stock_batch_id: number;
    product_id:     number;
    name:           string;
    brand:          string | null;
    qty:            number;
    price:          number;
    stock:          number; // max available
}

interface Customer {
    id:     number;
    name:   string;
    is_vat: number;
}

const WALK_IN_ID = 1; // default walk-in customer id

function InvoicePage() {
    const { user } = useAuth();

    const [invoiceNum,     setInvoiceNum]     = useState('INV-0001');
    const [poNumber,       setPoNumber]       = useState('');
    const [invoiceDate,    setInvoiceDate]    = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedCustomer, setSelectedCustomer] = useState<string>('');
    const [paymentMethod,  setPaymentMethod]  = useState<number>(0);
    const [paymentMethods, setPaymentMethods] = useState<{ id: number; name: string }[]>([]);
    const [paidAmount,     setPaidAmount]     = useState('');
    const [discount,       setDiscount]       = useState('');
    const [barcodeInput,   setBarcodeInput]   = useState('');
    const [productSearch,  setProductSearch]  = useState('');
    const [cart,           setCart]           = useState<CartItem[]>([]);
    const [customers,      setCustomers]      = useState<Customer[]>([]);
    const [stockItems,     setStockItems]     = useState<StockItem[]>([]);
    const [saving,         setSaving]         = useState(false);
    const [vatRate,        setVatRate]        = useState(0);

    // Unit price modal state
    const [priceModalOpen,  setPriceModalOpen]  = useState(false);
    const [pendingItem,     setPendingItem]     = useState<StockItem | null>(null);
    const [unitPriceInput,  setUnitPriceInput]  = useState('');
    const [qtyInput,        setQtyInput]        = useState('1');
    const priceInputRef = useRef<HTMLInputElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    // Calculated totals
    const subTotal        = cart.reduce((s, i) => s + i.qty * i.price, 0);
    const discountedTotal = Math.max(0, subTotal - Number(discount || 0));
    const vatAmount       = Math.round(discountedTotal * vatRate / 100);
    const grandTotal      = discountedTotal + vatAmount;
    const balance         = Number(paidAmount || 0) - grandTotal;

    useEffect(() => {
        fetchFormData();
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (!invoiceDate) return;
        axios.get('/vat/by-date', { params: { date: invoiceDate } })
            .then((res) => setVatRate(res.data ? Number(res.data.vat_percentage) : 0))
            .catch(() => setVatRate(0));
    }, [invoiceDate]);

    const fetchNextNumber = async () => {
        try {
            const res = await axios.get('/invoice/next-number');
            setInvoiceNum(res.data.invoice_number);
        } catch (e) { console.log(e); }
    };

    const fetchFormData = async () => {
        try {
            const res = await axios.get('/invoice/form-data');
            setCustomers(res.data.customers);
            setStockItems(res.data.stock);
            if (res.data.next_number) setInvoiceNum(res.data.next_number);
            if (Array.isArray(res.data.payment_methods)) {
                setPaymentMethods(res.data.payment_methods);
            }
        } catch (e: any) {
            console.log('Form data error:', e.response?.data);
        }
    };

    const customerOptions = customers.map((c) => ({
        value: String(c.id),
        label: c.id === WALK_IN_ID ? 'Walk-in Customer' : c.name,
    }));

    // Filter products by search
    const filteredStock = stockItems.filter((s) =>
        s.generic_name?.toLowerCase().includes(productSearch.toLowerCase()) ||
        s.barcode_value?.includes(productSearch) ||
        s.brand?.toLowerCase().includes(productSearch.toLowerCase())
    );

    // Open price-setting modal before adding to cart
    const openPriceModal = (s: StockItem) => {
        if (s.current_quantity === 0) return;
        setPendingItem(s);
        setUnitPriceInput('');
        setQtyInput('1');
        setPriceModalOpen(true);
        setTimeout(() => priceInputRef.current?.focus(), 50);
    };

    // Add to cart with an explicitly supplied unit price
    const addToCart = (s: StockItem, unitPrice: number, qty: number) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.stock_batch_id === s.stock_batch_id);
            if (existing) {
                const newQty = existing.qty + qty;
                if (newQty > s.current_quantity) {
                    toast.error(`Only ${s.current_quantity} in stock!`);
                    return prev;
                }
                return prev.map((c) => c.stock_batch_id === s.stock_batch_id
                    ? { ...c, qty: newQty } : c);
            }
            return [...prev, {
                stock_batch_id: s.stock_batch_id,
                product_id:     s.product_id,
                name:           s.generic_name,
                brand:          s.brand,
                qty,
                price:          unitPrice,
                stock:          s.current_quantity,
            }];
        });
    };

    const confirmPriceAndAdd = () => {
        const price = Number(unitPriceInput);
        const qty   = parseInt(qtyInput, 10);
        if (!pendingItem) return;
        if (!unitPriceInput || isNaN(price) || price <= 0) {
            toast.error('Please enter a valid unit selling price.');
            return;
        }
        if (!qtyInput || isNaN(qty) || qty <= 0) {
            toast.error('Please enter a valid quantity.');
            return;
        }
        if (qty > pendingItem.current_quantity) {
            toast.error(`Only ${pendingItem.current_quantity} in stock!`);
            return;
        }
        addToCart(pendingItem, price, qty);
        setPriceModalOpen(false);
        setPendingItem(null);
        setUnitPriceInput('');
        setQtyInput('1');
    };

    const updateQty = (stock_batch_id: number, delta: number) => {
        setCart((prev) => prev.map((c) => {
            if (c.stock_batch_id !== stock_batch_id) return c;
            const newQty = c.qty + delta;
            if (newQty > c.stock) { toast.error(`Only ${c.stock} in stock!`); return c; }
            return { ...c, qty: Math.max(1, newQty) };
        }));
    };

    const setItemQty = (stock_batch_id: number, value: number) => {
        if (isNaN(value)) return;
        setCart((prev) => prev.map((c) => {
            if (c.stock_batch_id !== stock_batch_id) return c;
            if (value > c.stock) { toast.error(`Only ${c.stock} in stock!`); return { ...c, qty: c.stock }; }
            return { ...c, qty: Math.max(1, value) };
        }));
    };

    const removeFromCart = (stock_batch_id: number) => {
        setCart((prev) => prev.filter((c) => c.stock_batch_id !== stock_batch_id));
    };

    // Handle barcode scan — open price modal instead of direct add
    const handleBarcode = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && barcodeInput.trim()) {
            const found = stockItems.find((s) => s.barcode_value === barcodeInput.trim());
            if (found) {
                openPriceModal(found);
            } else {
                toast.error('Product not found for this barcode.');
            }
            setBarcodeInput('');
        }
    };

    // ✅ Save invoice (printAfterSave=true opens PDF after save)
    const handleSave = async (printAfterSave = false) => {
        if (!selectedCustomer) { toast.error('Please select a customer.'); return; }
        if (cart.length === 0) { toast.error('Please add at least one product.'); return; }
        if (!paymentMethod) { toast.error('Please select a payment method.'); return; }

        setSaving(true);
        const toastId = toast.loading(printAfterSave ? 'Saving & preparing print...' : 'Saving invoice...');

        try {
            const res = await axios.post('/invoice/store', {
                customer_id:    Number(selectedCustomer),
                user_id:        user?.id,
                po_number:      poNumber || null,
                invoice_date:   invoiceDate,
                sub_total:      subTotal,
                discount:       Number(discount || 0),
                vat_percentage: vatRate,
                grand_total:    grandTotal,
                paid_amount:    Number(paidAmount || 0),
                payment_method: paymentMethod,
                items: cart.map((i) => ({
                    stock_batch_id: i.stock_batch_id,
                    quantity:       i.qty,
                    unit_price:     i.price,
                })),
            });

            toast.success('Invoice saved successfully!', { id: toastId });

            if (printAfterSave && res.data.id) {
                window.open(`/invoice/print/${res.data.id}`, '_blank');
            }

            // Reset
            setCart([]);
            setSelectedCustomer('');
            setPoNumber('');
            setDiscount('');
            setPaidAmount('');
            setPaymentMethod(0);
            await fetchNextNumber();
            await fetchFormData();

        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to save invoice.';
            toast.error(msg, { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)] animate-fade-in">

            {/* Left: Product Selection */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="bg-card rounded-xl border border-border p-4 mb-4">
                    <div className="flex gap-3">
                        <div className="relative w-3/5">
                            <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input ref={inputRef} value={barcodeInput}
                                onChange={(e) => setBarcodeInput(e.target.value)}
                                onKeyDown={handleBarcode}
                                placeholder="Scan barcode or enter code..."
                                className="pl-9 h-10" />
                        </div>
                        <div className="w-2/5">
                            <SearchBar value={productSearch} onChange={setProductSearch}
                                placeholder="Search products..." />
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                        {filteredStock.map((s) => (
                            <button key={s.stock_batch_id} onClick={() => openPriceModal(s)}
                                disabled={s.current_quantity === 0}
                                className="bg-card border border-border rounded-lg p-3 text-left hover:border-primary hover:shadow-md transition-all group disabled:opacity-40 disabled:cursor-not-allowed">
                                <p className="text-xs font-semibold truncate group-hover:text-primary">
                                    {s.generic_name}
                                </p>
                                <p className="text-[10px] text-muted-foreground">{s.brand}</p>
                                {s.batch_number && (
                                    <p className="text-[10px] text-muted-foreground font-mono">{s.batch_number}</p>
                                )}
                                <div className="flex justify-end items-center mt-2">
                                    <span className={`text-[10px] font-medium ${s.current_quantity <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                        Stk: {s.current_quantity}
                                    </span>
                                </div>
                            </button>
                        ))}
                        {filteredStock.length === 0 && (
                            <div className="col-span-4 text-center py-12 text-muted-foreground text-sm">
                                No products in stock.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Cart & Payment */}
            <div className="w-full lg:w-[600px] flex flex-col bg-card rounded-xl border border-border">
                {/* Header */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 shrink-0">
                            <ShoppingCart className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold font-mono">{invoiceNum}</span>
                        </div>
                        <Input
                            value={poNumber}
                            onChange={(e) => setPoNumber(e.target.value)}
                            placeholder="PO No:"
                            className="h-8 w-32 text-xs px-2"
                        />
                        <DatePicker value={invoiceDate} onChange={setInvoiceDate}
                            className="h-8 text-xs px-2" />
                    </div>
                    <Combobox options={customerOptions} value={selectedCustomer}
                        onValueChange={setSelectedCustomer}
                        placeholder="Select customer..."
                        searchPlaceholder="Search customers..."
                        className="mt-3 h-9 text-sm" />
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <ShoppingCart className="h-10 w-10 mb-2 opacity-30" />
                            <p className="text-sm">Cart is empty</p>
                            <p className="text-xs">Scan or click products to add</p>
                        </div>
                    ) : cart.map((item) => (
                        <div key={item.stock_batch_id}
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                            <div className="flex-1 min-w-0 pr-2">
                                <p className="text-xs font-medium truncate">{item.name}</p>
                                <p className="text-[10px] text-muted-foreground">
                                    Rs. {Number(item.price).toLocaleString()} each
                                </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <button onClick={() => updateQty(item.stock_batch_id, -1)}
                                    className="h-6 w-6 rounded bg-background border border-border flex items-center justify-center hover:bg-accent">
                                    <Minus className="h-3 w-3" />
                                </button>
                                <input
                                    type="number"
                                    value={item.qty}
                                    min={1}
                                    max={item.stock}
                                    onChange={(e) => setItemQty(item.stock_batch_id, parseInt(e.target.value, 10))}
                                    className="w-16 h-6 text-center text-xs font-semibold bg-background border border-input rounded px-1
                                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button onClick={() => updateQty(item.stock_batch_id, 1)}
                                    className="h-6 w-6 rounded bg-background border border-border flex items-center justify-center hover:bg-accent">
                                    <Plus className="h-3 w-3" />
                                </button>
                            </div>
                            <span className="text-xs font-bold w-28 text-right">
                                Rs. {(item.qty * item.price).toLocaleString()}
                            </span>
                            <button onClick={() => removeFromCart(item.stock_batch_id)}
                                className="text-destructive hover:bg-destructive/10 rounded p-1">
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Payment */}
                <div className="border-t border-border px-4 pt-3 pb-4 space-y-2">

                    {/* Summary rows */}
                    <div className="space-y-1">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between py-1">
                            <span className="text-xs text-muted-foreground">
                                Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})
                            </span>
                            <span className="text-sm font-semibold">Rs. {subTotal.toLocaleString()}</span>
                        </div>

                        {/* Discount — borderless inline input */}
                        <div className="flex items-center justify-between py-1">
                            <span className="text-xs text-muted-foreground">Discount</span>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">Rs.</span>
                                <input type="number" placeholder="0" value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    className="w-20 text-right bg-transparent border-0 border-b border-dashed
                                               border-muted-foreground/40 focus:outline-none focus:border-primary
                                               text-sm font-semibold text-destructive pb-px
                                               [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                                               [&::-webkit-inner-spin-button]:appearance-none" />
                            </div>
                        </div>

                        {/* VAT */}
                        {vatRate > 0 && (
                            <div className="flex items-center justify-between py-1">
                                <span className="text-xs text-muted-foreground">VAT ({vatRate.toFixed(2)}%)</span>
                                <span className="text-sm text-muted-foreground">+ Rs. {vatAmount.toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    {/* TOTAL — prominent */}
                    <div className="bg-primary/10 rounded-lg px-4 py-2.5 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">Total</span>
                        <span className="text-2xl font-bold text-primary">Rs. {grandTotal.toLocaleString()}</span>
                    </div>

                    {/* Paid Amount + Balance */}
                    <div className="space-y-1">
                        {/* Paid Amount — borderless inline input */}
                        <div className="flex items-center justify-between py-1">
                            <span className="text-xs text-muted-foreground">Paid Amount</span>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">Rs.</span>
                                <input type="number" placeholder="0" value={paidAmount}
                                    onChange={(e) => setPaidAmount(e.target.value)}
                                    className="w-24 text-right bg-transparent border-0 border-b border-dashed
                                               border-muted-foreground/40 focus:outline-none focus:border-primary
                                               text-sm font-semibold pb-px
                                               [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                                               [&::-webkit-inner-spin-button]:appearance-none" />
                            </div>
                        </div>

                        {/* Balance */}
                        <div className={`flex items-center justify-between px-3 py-2 rounded-lg
                            ${balance >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-destructive/5'}`}>
                            <span className={`text-xs font-medium
                                ${balance >= 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
                                {balance >= 0 ? 'Change' : 'Balance Due'}
                            </span>
                            <span className={`text-sm font-bold
                                ${balance >= 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
                                Rs. {Math.abs(balance).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Payment Method dropdown + Action Buttons */}
                    <div className="flex gap-2 pt-1">
                        {/* Payment method select */}
                        <Select
                            value={paymentMethod ? String(paymentMethod) : ''}
                            onValueChange={(val) => setPaymentMethod(Number(val))}>
                            <SelectTrigger className={`flex-1 h-9 text-xs font-medium ${!paymentMethod ? 'border-destructive ring-1 ring-destructive' : ''}`}>
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentMethods.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>
                                        {m.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button onClick={() => handleSave(false)} disabled={cart.length === 0 || saving || !paymentMethod}
                            className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                            <Save className="h-4 w-4" />
                            {saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button onClick={() => handleSave(true)} disabled={cart.length === 0 || saving || !paymentMethod}
                            className="flex-1 gap-2">
                            <Printer className="h-4 w-4" /> Save & Print
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        {/* Unit Selling Price Modal */}
        <Dialog open={priceModalOpen} onOpenChange={(open) => { if (!open) { setPriceModalOpen(false); setPendingItem(null); setUnitPriceInput(''); } }}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Set Unit Selling Price</DialogTitle>
                </DialogHeader>
                {pendingItem && (
                    <div className="space-y-4 py-2">
                        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                            <p className="text-sm font-semibold">{pendingItem.generic_name}</p>
                            {pendingItem.brand && <p className="text-xs text-muted-foreground">{pendingItem.brand}</p>}
                            {pendingItem.batch_number && (
                                <p className="text-xs text-muted-foreground font-mono">{pendingItem.batch_number}</p>
                            )}
                            <p className="text-xs text-muted-foreground pt-1">In stock: {pendingItem.current_quantity}</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Quantity</label>
                            <Input
                                type="number"
                                placeholder="1"
                                value={qtyInput}
                                onChange={(e) => setQtyInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && priceInputRef.current?.focus()}
                                className="text-right text-base font-semibold"
                                min={1}
                                max={pendingItem.current_quantity}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Unit Selling Price (Rs.)</label>
                            <Input
                                ref={priceInputRef}
                                type="number"
                                placeholder="Enter selling price..."
                                value={unitPriceInput}
                                onChange={(e) => setUnitPriceInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && confirmPriceAndAdd()}
                                className="text-right text-base font-semibold"
                                min={0}
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => { setPriceModalOpen(false); setPendingItem(null); setUnitPriceInput(''); }}>
                        Cancel
                    </Button>
                    <Button onClick={confirmPriceAndAdd} className="gap-2">
                        <ShoppingCart className="h-4 w-4" /> Add to Invoice
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
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

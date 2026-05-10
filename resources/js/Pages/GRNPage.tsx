// import { Head } from '@inertiajs/react';
// import AppShell from '@/AppShell';
// import React, { useEffect, useRef, useState } from 'react';
// import { initialProducts, initialSuppliers, nextGRNNumber, type Product } from '@/data/mockData';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { FloatingInput } from '@/components/ui/floating-input';
// import { Combobox } from '@/components/ui/combobox';
// import { DatePicker } from '@/components/ui/date-picker';
// import { format } from 'date-fns';
// import { Trash2, Printer, Barcode, Save } from 'lucide-react';
// import BarcodeScanner from '@/components/BarcodeScanner';

// function GRNPage() {
//   const [grnNum] = useState(nextGRNNumber());
//   const [grnDate, setGrnDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [supplierId, setSupplierId] = useState('');
//   const [barcodeInput, setBarcodeInput] = useState('');
//   const [items, setItems] = useState<{ productId: string; name: string; qty: number; costPrice: number }[]>([]);
//   const [paidAmount, setPaidAmount] = useState('');
//   const [discount, setDiscount] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'cheque'>('cash');
//   const [showScanner, setShowScanner] = useState(false);
//   const inputRef = useRef(null);

//   const supplierOptions = initialSuppliers.map((s) => ({ value: s.id, label: `${s.name} — ${s.company}` }));

//   const total = items.reduce((s, i) => s + i.qty * i.costPrice, 0);
//   const discountedTotal = Math.max(0, total - Number(discount || 0));
//   const balance = discountedTotal - Number(paidAmount || 0);

//   const handleBarcode = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && barcodeInput) {
//       const p = initialProducts.find((pr) => pr.barcode === barcodeInput);
//       if (p) {
//         setItems((prev) => {
//           const existing = prev.find((i) => i.productId === p.id);
//           if (existing) return prev.map((i) => i.productId === p.id ? { ...i, qty: i.qty + 1 } : i);
//           return [...prev, { productId: p.id, name: p.name, qty: 1, costPrice: p.costPrice }];
//         });
//       }
//       setBarcodeInput('');
//     }
//   };

//   useEffect(() => {
//   inputRef.current?.focus();
// }, []);

//   return (
//     <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
//       <div className="bg-card rounded-xl border border-border p-5">
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//           <div>
//             <label className="text-xs font-medium text-muted-foreground mb-1 block">GRN Number</label>
//             <Input value={grnNum} readOnly className="bg-muted" />
//           </div>
//           <div>
//             <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
//             <DatePicker value={grnDate} onChange={setGrnDate} className="w-full" />
//           </div>
//           <div>
//             <label className="text-xs font-medium text-muted-foreground mb-1 block">Supplier</label>
//             <Combobox
//               options={supplierOptions}
//               value={supplierId}
//               onValueChange={setSupplierId}
//               placeholder="Select supplier"
//               searchPlaceholder="Search suppliers..."
//             />
//           </div>
//         </div>

//         {/* <div className="relative mb-4">
//           <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input value={barcodeInput} onChange={(e) => setBarcodeInput(e.target.value)} onKeyDown={handleBarcode} placeholder="Scan barcode to add products..." className="pl-9" />
//         </div> */}

//         <div className="relative mb-4 flex gap-2">
//         <Input
//         ref={inputRef}
//             value={barcodeInput}
//             onChange={(e) => setBarcodeInput(e.target.value)}
//             onKeyDown={handleBarcode}
//             placeholder="Scan barcode or type..."
//             className="pl-9"
//         />

//         <Button onClick={() => setShowScanner(!showScanner)}>
//             📷 Scan
//         </Button>
//         </div>

//         {/* Items Table */}
//         <div className="border rounded-lg overflow-hidden">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-muted/50 border-b">
//                 <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Product</th>
//                 <th className="text-center text-xs font-medium text-muted-foreground px-4 py-2">Qty</th>
//                 <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Cost Price</th>
//                 <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Total</th>
//                 <th className="px-4 py-2 w-10"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.length === 0 ? (
//                 <tr><td colSpan={5} className="text-center py-8 text-sm text-muted-foreground">No items added yet</td></tr>
//               ) : items.map((item) => (
//                 <tr key={item.productId} className="border-b last:border-0">
//                   <td className="px-4 py-2 text-sm">{item.name}</td>
//                   <td className="px-4 py-2 text-center">
//                     <Input type="number" value={item.qty} onChange={(e) => setItems((prev) => prev.map((i) => i.productId === item.productId ? { ...i, qty: Number(e.target.value) } : i))} className="w-16 h-8 text-center mx-auto" />
//                   </td>
//                   <td className="px-4 py-2 text-right text-sm">Rs. {item.costPrice}</td>
//                   <td className="px-4 py-2 text-right text-sm font-medium">Rs. {(item.qty * item.costPrice).toLocaleString()}</td>
//                   <td className="px-4 py-2"><button onClick={() => setItems((prev) => prev.filter((i) => i.productId !== item.productId))} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Payment Method */}
//         <div className="flex gap-2 mt-4 pt-4 border-t">
//           {(['cash', 'card', 'cheque'] as const).map((m) => (
//             <button
//               key={m}
//               onClick={() => setPaymentMethod(m)}
//               className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${paymentMethod === m ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
//             >
//               {m === 'cash' ? '💵 Cash' : m === 'card' ? '💳 Card' : '🏦 Cheque'}
//             </button>
//           ))}
//         </div>

//         {/* Payment Fields */}
//         <div className="grid grid-cols-4 gap-3 mt-3">
//           <FloatingInput
//             label="Total (Rs.)"
//             value={`Rs. ${discountedTotal.toLocaleString()}`}
//             readOnly
//             className="h-[52px] bg-muted/30 cursor-default"
//           />
//           <FloatingInput
//             label="Discount (Rs.)"
//             type="number"
//             value={discount}
//             onChange={(e) => setDiscount(e.target.value)}
//             className="h-[52px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//           />
//           <FloatingInput
//             label="Paid Amount (Rs.)"
//             type="number"
//             value={paidAmount}
//             onChange={(e) => setPaidAmount(e.target.value)}
//             className="h-[52px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//           />
//           <FloatingInput
//             label="Balance (Rs.)"
//             value={`Rs. ${Math.abs(balance).toLocaleString()}`}
//             readOnly
//             className={`h-[52px] cursor-default ${balance > 0 ? 'text-destructive bg-destructive/5 border-destructive/30' : 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'}`}
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3 mt-4">
//           <Button className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white">
//             <Save className="h-4 w-4" /> Save GRN
//           </Button>
//           <Button className="flex-1 gap-2">
//             <Printer className="h-4 w-4" /> Save & Print GRN
//           </Button>
//         </div>
//       </div>

//       {showScanner && (
//         <div className="mb-4 border rounded-lg p-3">
//             <BarcodeScanner
//             onScan={(code) => {
//                 new Audio('/beep.mp3').play();
//                 setBarcodeInput(code);
//                 console.log('Scanned barcode:', code);

//                 // simulate Enter key logic
//                 const p = initialProducts.find((pr) => pr.barcode === code);
//                 if (p) {
//                 setItems((prev) => {
//                     const existing = prev.find((i) => i.productId === p.id);
//                     if (existing) {
//                     return prev.map((i) =>
//                         i.productId === p.id ? { ...i, qty: i.qty + 1 } : i
//                     );
//                     }
//                     return [
//                     ...prev,
//                     {
//                         productId: p.id,
//                         name: p.name,
//                         qty: 1,
//                         costPrice: p.costPrice,
//                     },
//                     ];
//                 });
//                 }

//                 setShowScanner(false);
//             }}
//             />
//         </div>
//         )}

//     </div>
//   );
// }


// export default function WrappedGRNPage() {
//   return (
//     <>
//       <Head title="GRN" />
//       <GRNPage />
//     </>
//   );
// }

// (WrappedGRNPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FloatingInput } from '@/components/ui/floating-input';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { Trash2, Printer, Save } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import axios from 'axios';

// --- Types ---
interface Supplier { id: number; name: string; }
interface Product  {
    id: number;
    generic_name: string;
    barcode_value: string;
    brand?: { name: string };
}

interface GrnItem {
    productId:    number;
    name:         string;
    qty:          number;
    unitPrice:    number;
    sellingPrice: number;
    batchNumber:  string;
    expiryDate:   string;
    mfdDate:      string;
}

const spinnerOff = '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

function GRNPage() {
    const { user } = useAuth(); // ✅ get current logged in user

    const [grnNum,         setGrnNum]         = useState('GRN-0001');
    const [grnDate,        setGrnDate]         = useState(format(new Date(), 'yyyy-MM-dd'));
    const [supplierId,     setSupplierId]      = useState('');
    const [invoiceNo,      setInvoiceNo]       = useState('');
    const [barcodeInput,   setBarcodeInput]    = useState('');
    const [items,          setItems]           = useState<GrnItem[]>([]);
    const [paidAmount,     setPaidAmount]      = useState('');
    const [discount,       setDiscount]        = useState('');
    const [paymentMethod,  setPaymentMethod]   = useState<'cash' | 'card' | 'cheque'>('cash');
    const [suppliers,      setSuppliers]       = useState<Supplier[]>([]);
    const [products,       setProducts]        = useState<Product[]>([]);
    const [saving,         setSaving]          = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Calculated totals
    const subTotal        = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    const discountedTotal = Math.max(0, subTotal - Number(discount || 0));
    const balance         = discountedTotal - Number(paidAmount || 0);

    useEffect(() => {
        fetchFormData();
        fetchNextNumber();
        inputRef.current?.focus();
    }, []);

    const fetchNextNumber = async () => {
        try {
            const res = await axios.get('/grn/next-number');
            setGrnNum(res.data.grn_number);
        } catch (e) { console.log(e); }
    };

    const fetchFormData = async () => {
        try {
            const res = await axios.get('/grn/form-data');
            setSuppliers(res.data.suppliers);
            setProducts(res.data.products);
        } catch (error: any) { console.log('Form data error:', error.response?.data); }
    };

    const supplierOptions = suppliers.map((s) => ({
        value: String(s.id),
        label: s.name,
    }));

    // ✅ Add product by barcode
    const handleBarcode = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && barcodeInput.trim()) {
            const p = products.find((pr) => pr.barcode_value === barcodeInput.trim());
            if (p) {
                addProduct(p);
            } else {
                toast.error('Product not found for this barcode.');
            }
            setBarcodeInput('');
        }
    };

    const addProduct = (p: Product) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.productId === p.id);
            if (existing) {
                return prev.map((i) => i.productId === p.id
                    ? { ...i, qty: i.qty + 1 }
                    : i
                );
            }
            return [...prev, {
                productId:    p.id,
                name:         p.generic_name,
                qty:          1,
                unitPrice:    0,
                sellingPrice: 0,
                batchNumber:  '',
                expiryDate:   '',
                mfdDate:      '',
            }];
        });
    };

    const updateItem = (productId: number, field: keyof GrnItem, value: any) => {
        setItems((prev) => prev.map((i) =>
            i.productId === productId ? { ...i, [field]: value } : i
        ));
    };

    // ✅ Save GRN
    const handleSave = async () => {
        if (!supplierId) { toast.error('Please select a supplier.'); return; }
        if (items.length === 0) { toast.error('Please add at least one product.'); return; }

        setSaving(true);
        const toastId = toast.loading('Saving GRN...');

        try {
            await axios.post('/grn/store', {
                supplier_id:         Number(supplierId),
                supplier_invoice_no: invoiceNo || null,
                received_date:       grnDate,
                sub_total:           subTotal,
                discount:            Number(discount || 0),
                total_amount:        discountedTotal,
                paid_amount:         Number(paidAmount || 0),
                payment_method:      paymentMethod,
                items: items.map((i) => ({
                    product_id:    i.productId,
                    quantity:      i.qty,
                    unit_price:    i.unitPrice,
                    selling_price: i.sellingPrice,
                    batch_number:  i.batchNumber || null,
                    expiry_date:   i.expiryDate  || null,
                    mfd_date:      i.mfdDate     || null,
                })),
            });

            toast.success('GRN saved successfully!', { id: toastId });

            // Reset form
            setItems([]);
            setSupplierId('');
            setInvoiceNo('');
            setDiscount('');
            setPaidAmount('');
            setPaymentMethod('cash');
            await fetchNextNumber(); // get new GRN number

        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to save GRN.';
            toast.error(msg, { id: toastId });
            console.log(error.response?.data);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-4 animate-fade-in">
            <div className="bg-card rounded-xl border border-border p-5">

                {/* Header Row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">GRN Number</label>
                        <Input value={grnNum} readOnly className="bg-muted font-mono" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
                        <DatePicker value={grnDate} onChange={setGrnDate} className="w-full" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Supplier</label>
                        <Combobox options={supplierOptions} value={supplierId}
                            onValueChange={setSupplierId}
                            placeholder="Select supplier"
                            searchPlaceholder="Search suppliers..." />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                            Invoice No. (optional)
                        </label>
                        <Input value={invoiceNo}
                            onChange={(e) => setInvoiceNo(e.target.value)}
                            placeholder="Supplier invoice #" />
                    </div>
                </div>

                {/* ✅ Show logged in user */}
                <div className="mb-3 text-xs text-muted-foreground">
                    Received by: <span className="font-medium text-foreground">{user?.name}</span>
                </div>

                {/* Barcode Input */}
                <div className="relative mb-4 flex gap-2">
                    <Input ref={inputRef} value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        onKeyDown={handleBarcode}
                        placeholder="Scan barcode or type barcode and press Enter..."
                        className="flex-1" />
                </div>

                {/* Items Table */}
                <div className="border rounded-lg overflow-hidden mb-4">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50 border-b">
                                    <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">Product</th>
                                    <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-20">Qty</th>
                                    <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-28">Cost Price</th>
                                    <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-28">Selling Price</th>
                                    <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-28">Batch No.</th>
                                    <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-32">Expiry Date</th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-3 py-2 w-24">Total</th>
                                    <th className="px-3 py-2 w-8"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-8 text-sm text-muted-foreground">
                                            No items added yet — scan a barcode above
                                        </td>
                                    </tr>
                                ) : items.map((item) => (
                                    <tr key={item.productId} className="border-b last:border-0">
                                        <td className="px-3 py-2 text-sm font-medium">{item.name}</td>
                                        <td className="px-3 py-2">
                                            <Input type="number" value={item.qty}
                                                onChange={(e) => updateItem(item.productId, 'qty', Number(e.target.value))}
                                                className={`w-16 h-8 text-center mx-auto ${spinnerOff}`} />
                                        </td>
                                        <td className="px-3 py-2">
                                            <Input type="number" value={item.unitPrice}
                                                onChange={(e) => updateItem(item.productId, 'unitPrice', Number(e.target.value))}
                                                className={`w-24 h-8 text-right mx-auto ${spinnerOff}`} />
                                        </td>
                                        <td className="px-3 py-2">
                                            <Input type="number" value={item.sellingPrice}
                                                onChange={(e) => updateItem(item.productId, 'sellingPrice', Number(e.target.value))}
                                                className={`w-24 h-8 text-right mx-auto ${spinnerOff}`} />
                                        </td>
                                        <td className="px-3 py-2">
                                            <Input value={item.batchNumber}
                                                onChange={(e) => updateItem(item.productId, 'batchNumber', e.target.value)}
                                                className="w-24 h-8 mx-auto"
                                                placeholder="optional" />
                                        </td>
                                        <td className="px-3 py-2">
                                            <Input type="date" value={item.expiryDate}
                                                onChange={(e) => updateItem(item.productId, 'expiryDate', e.target.value)}
                                                className="w-32 h-8 mx-auto" />
                                        </td>
                                        <td className="px-3 py-2 text-right text-sm font-medium">
                                            Rs. {(item.qty * item.unitPrice).toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2">
                                            <button onClick={() => setItems((prev) => prev.filter((i) => i.productId !== item.productId))}
                                                className="text-destructive hover:text-destructive/80">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="flex gap-2 pt-4 border-t">
                    {(['cash', 'card', 'cheque'] as const).map((m) => (
                        <button key={m} onClick={() => setPaymentMethod(m)}
                            className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors
                                ${paymentMethod === m
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'border-border hover:bg-muted'}`}>
                            {m === 'cash' ? '💵 Cash' : m === 'card' ? '💳 Card' : '🏦 Cheque'}
                        </button>
                    ))}
                </div>

                {/* Payment Fields */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                    <FloatingInput label="Sub Total (Rs.)"
                        value={`Rs. ${subTotal.toLocaleString()}`}
                        readOnly className="h-[52px] bg-muted/30 cursor-default" />
                    <FloatingInput label="Discount (Rs.)" type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className={`h-[52px] ${spinnerOff}`} />
                    <FloatingInput label="Paid Amount (Rs.)" type="number"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                        className={`h-[52px] ${spinnerOff}`} />
                    <FloatingInput label="Balance (Rs.)"
                        value={`Rs. ${Math.abs(balance).toLocaleString()}`}
                        readOnly
                        className={`h-[52px] cursor-default font-semibold
                            ${balance > 0
                                ? 'text-destructive bg-destructive/5 border-destructive/30'
                                : 'text-green-600 bg-green-50 dark:bg-green-900/20'}`} />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                    <Button onClick={handleSave} disabled={saving}
                        className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save GRN'}
                    </Button>
                    <Button onClick={handleSave} disabled={saving}
                        className="flex-1 gap-2">
                        <Printer className="h-4 w-4" /> Save & Print GRN
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function WrappedGRNPage() {
    return (
        <>
            <Head title="GRN" />
            <GRNPage />
        </>
    );
}

(WrappedGRNPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;
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

// import { Head } from '@inertiajs/react';
// import AppShell from '@/AppShell';
// import React, { useEffect, useRef, useState } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { FloatingInput } from '@/components/ui/floating-input';
// import { Combobox } from '@/components/ui/combobox';
// import { DatePicker } from '@/components/ui/date-picker';
// import { format } from 'date-fns';
// import { Trash2, Printer, Save } from 'lucide-react';
// import { toast } from '@/components/ui/sonner';
// import axios from 'axios';

// // --- Types ---
// interface Supplier { id: number; name: string; }
// interface Product  {
//     id: number;
//     generic_name: string;
//     barcode_value: string;
//     brand?: { name: string };
// }

// interface GrnItem {
//     productId:    number;
//     name:         string;
//     qty:          number;
//     unitPrice:    number;
//     sellingPrice: number;
//     batchNumber:  string;
//     expiryDate:   string;
//     mfdDate:      string;
// }

// const spinnerOff = '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

// function GRNPage() {
//     const { user } = useAuth(); // ✅ get current logged in user

//     const [grnNum,         setGrnNum]         = useState('GRN-0001');
//     const [grnDate,        setGrnDate]         = useState(format(new Date(), 'yyyy-MM-dd'));
//     const [supplierId,     setSupplierId]      = useState('');
//     const [invoiceNo,      setInvoiceNo]       = useState('');
//     const [barcodeInput,   setBarcodeInput]    = useState('');
//     const [items,          setItems]           = useState<GrnItem[]>([]);
//     const [paidAmount,     setPaidAmount]      = useState('');
//     const [discount,       setDiscount]        = useState('');
//     const [paymentMethod,  setPaymentMethod]   = useState<'cash' | 'card' | 'cheque'>('cash');
//     const [suppliers,      setSuppliers]       = useState<Supplier[]>([]);
//     const [products,       setProducts]        = useState<Product[]>([]);
//     const [saving,         setSaving]          = useState(false);
//     const inputRef = useRef<HTMLInputElement>(null);

//     // Calculated totals
//     const subTotal        = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
//     const discountedTotal = Math.max(0, subTotal - Number(discount || 0));
//     const balance         = discountedTotal - Number(paidAmount || 0);

//     useEffect(() => {
//         fetchFormData();
//         fetchNextNumber();
//         inputRef.current?.focus();
//     }, []);

//     const fetchNextNumber = async () => {
//         try {
//             const res = await axios.get('/grn/next-number');
//             setGrnNum(res.data.grn_number);
//         } catch (e) { console.log(e); }
//     };

//     const fetchFormData = async () => {
//         try {
//             const res = await axios.get('/grn/form-data');
//             setSuppliers(res.data.suppliers);
//             setProducts(res.data.products);
//         } catch (error: any) { console.log('Form data error:', error.response?.data); }
//     };

//     const supplierOptions = suppliers.map((s) => ({
//         value: String(s.id),
//         label: s.name,
//     }));

//     // ✅ Add product by barcode
//     const handleBarcode = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && barcodeInput.trim()) {
//             const p = products.find((pr) => pr.barcode_value === barcodeInput.trim());
//             if (p) {
//                 addProduct(p);
//             } else {
//                 toast.error('Product not found for this barcode.');
//             }
//             setBarcodeInput('');
//         }
//     };

//     const addProduct = (p: Product) => {
//         setItems((prev) => {
//             const existing = prev.find((i) => i.productId === p.id);
//             if (existing) {
//                 return prev.map((i) => i.productId === p.id
//                     ? { ...i, qty: i.qty + 1 }
//                     : i
//                 );
//             }
//             return [...prev, {
//                 productId:    p.id,
//                 name:         p.generic_name,
//                 qty:          1,
//                 unitPrice:    0,
//                 sellingPrice: 0,
//                 batchNumber:  '',
//                 expiryDate:   '',
//                 mfdDate:      '',
//             }];
//         });
//     };

//     const updateItem = (productId: number, field: keyof GrnItem, value: any) => {
//         setItems((prev) => prev.map((i) =>
//             i.productId === productId ? { ...i, [field]: value } : i
//         ));
//     };

//     // ✅ Save GRN
//     const handleSave = async () => {
//         if (!supplierId) { toast.error('Please select a supplier.'); return; }
//         if (items.length === 0) { toast.error('Please add at least one product.'); return; }

//         setSaving(true);
//         const toastId = toast.loading('Saving GRN...');

//         try {
//             await axios.post('/grn/store', {
//                 supplier_id:         Number(supplierId),
//                 supplier_invoice_no: invoiceNo || null,
//                 received_date:       grnDate,
//                 sub_total:           subTotal,
//                 discount:            Number(discount || 0),
//                 total_amount:        discountedTotal,
//                 paid_amount:         Number(paidAmount || 0),
//                 payment_method:      paymentMethod,
//                 items: items.map((i) => ({
//                     product_id:    i.productId,
//                     quantity:      i.qty,
//                     unit_price:    i.unitPrice,
//                     selling_price: i.sellingPrice,
//                     batch_number:  i.batchNumber || null,
//                     expiry_date:   i.expiryDate  || null,
//                     mfd_date:      i.mfdDate     || null,
//                 })),
//             });

//             toast.success('GRN saved successfully!', { id: toastId });

//             // Reset form
//             setItems([]);
//             setSupplierId('');
//             setInvoiceNo('');
//             setDiscount('');
//             setPaidAmount('');
//             setPaymentMethod('cash');
//             await fetchNextNumber(); // get new GRN number

//         } catch (error: any) {
//             const msg = error.response?.data?.message || 'Failed to save GRN.';
//             toast.error(msg, { id: toastId });
//             console.log(error.response?.data);
//         } finally {
//             setSaving(false);
//         }
//     };

//     return (
//         <div className="max-w-5xl mx-auto space-y-4 animate-fade-in">
//             <div className="bg-card rounded-xl border border-border p-5">

//                 {/* Header Row */}
//                 <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
//                     <div>
//                         <label className="text-xs font-medium text-muted-foreground mb-1 block">GRN Number</label>
//                         <Input value={grnNum} readOnly className="bg-muted font-mono" />
//                     </div>
//                     <div>
//                         <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
//                         <DatePicker value={grnDate} onChange={setGrnDate} className="w-full" />
//                     </div>
//                     <div>
//                         <label className="text-xs font-medium text-muted-foreground mb-1 block">Supplier</label>
//                         <Combobox options={supplierOptions} value={supplierId}
//                             onValueChange={setSupplierId}
//                             placeholder="Select supplier"
//                             searchPlaceholder="Search suppliers..." />
//                     </div>
//                     <div>
//                         <label className="text-xs font-medium text-muted-foreground mb-1 block">
//                             Invoice No. (optional)
//                         </label>
//                         <Input value={invoiceNo}
//                             onChange={(e) => setInvoiceNo(e.target.value)}
//                             placeholder="Supplier invoice #" />
//                     </div>
//                 </div>

//                 {/* ✅ Show logged in user */}
//                 <div className="mb-3 text-xs text-muted-foreground">
//                     Received by: <span className="font-medium text-foreground">{user?.name}</span>
//                 </div>

//                 {/* Barcode Input */}
//                 <div className="relative mb-4 flex gap-2">
//                     <Input ref={inputRef} value={barcodeInput}
//                         onChange={(e) => setBarcodeInput(e.target.value)}
//                         onKeyDown={handleBarcode}
//                         placeholder="Scan barcode or type barcode and press Enter..."
//                         className="flex-1" />
//                 </div>

//                 {/* Items Table */}
//                 <div className="border rounded-lg overflow-hidden mb-4">
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead>
//                                 <tr className="bg-muted/50 border-b">
//                                     <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">Product</th>
//                                     <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-20">Qty</th>
//                                     <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-28">Cost Price</th>
//                                     <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-28">Selling Price</th>
//                                     <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-28">Batch No.</th>
//                                     <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-32">Expiry Date</th>
//                                     <th className="text-right text-xs font-medium text-muted-foreground px-3 py-2 w-24">Total</th>
//                                     <th className="px-3 py-2 w-8"></th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {items.length === 0 ? (
//                                     <tr>
//                                         <td colSpan={8} className="text-center py-8 text-sm text-muted-foreground">
//                                             No items added yet — scan a barcode above
//                                         </td>
//                                     </tr>
//                                 ) : items.map((item) => (
//                                     <tr key={item.productId} className="border-b last:border-0">
//                                         <td className="px-3 py-2 text-sm font-medium">{item.name}</td>
//                                         <td className="px-3 py-2">
//                                             <Input type="number" value={item.qty}
//                                                 onChange={(e) => updateItem(item.productId, 'qty', Number(e.target.value))}
//                                                 className={`w-16 h-8 text-center mx-auto ${spinnerOff}`} />
//                                         </td>
//                                         <td className="px-3 py-2">
//                                             <Input type="number" value={item.unitPrice}
//                                                 onChange={(e) => updateItem(item.productId, 'unitPrice', Number(e.target.value))}
//                                                 className={`w-24 h-8 text-right mx-auto ${spinnerOff}`} />
//                                         </td>
//                                         <td className="px-3 py-2">
//                                             <Input type="number" value={item.sellingPrice}
//                                                 onChange={(e) => updateItem(item.productId, 'sellingPrice', Number(e.target.value))}
//                                                 className={`w-24 h-8 text-right mx-auto ${spinnerOff}`} />
//                                         </td>
//                                         <td className="px-3 py-2">
//                                             <Input value={item.batchNumber}
//                                                 onChange={(e) => updateItem(item.productId, 'batchNumber', e.target.value)}
//                                                 className="w-24 h-8 mx-auto"
//                                                 placeholder="optional" />
//                                         </td>
//                                         <td className="px-3 py-2">
//                                             <Input type="date" value={item.expiryDate}
//                                                 onChange={(e) => updateItem(item.productId, 'expiryDate', e.target.value)}
//                                                 className="w-32 h-8 mx-auto" />
//                                         </td>
//                                         <td className="px-3 py-2 text-right text-sm font-medium">
//                                             Rs. {(item.qty * item.unitPrice).toLocaleString()}
//                                         </td>
//                                         <td className="px-3 py-2">
//                                             <button onClick={() => setItems((prev) => prev.filter((i) => i.productId !== item.productId))}
//                                                 className="text-destructive hover:text-destructive/80">
//                                                 <Trash2 className="h-3.5 w-3.5" />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Payment Method */}
//                 <div className="flex gap-2 pt-4 border-t">
//                     {(['cash', 'card', 'cheque'] as const).map((m) => (
//                         <button key={m} onClick={() => setPaymentMethod(m)}
//                             className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors
//                                 ${paymentMethod === m
//                                     ? 'bg-primary text-primary-foreground border-primary'
//                                     : 'border-border hover:bg-muted'}`}>
//                             {m === 'cash' ? '💵 Cash' : m === 'card' ? '💳 Card' : '🏦 Cheque'}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Payment Fields */}
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
//                     <FloatingInput label="Sub Total (Rs.)"
//                         value={`Rs. ${subTotal.toLocaleString()}`}
//                         readOnly className="h-[52px] bg-muted/30 cursor-default" />
//                     <FloatingInput label="Discount (Rs.)" type="number"
//                         value={discount}
//                         onChange={(e) => setDiscount(e.target.value)}
//                         className={`h-[52px] ${spinnerOff}`} />
//                     <FloatingInput label="Paid Amount (Rs.)" type="number"
//                         value={paidAmount}
//                         onChange={(e) => setPaidAmount(e.target.value)}
//                         className={`h-[52px] ${spinnerOff}`} />
//                     <FloatingInput label="Balance (Rs.)"
//                         value={`Rs. ${Math.abs(balance).toLocaleString()}`}
//                         readOnly
//                         className={`h-[52px] cursor-default font-semibold
//                             ${balance > 0
//                                 ? 'text-destructive bg-destructive/5 border-destructive/30'
//                                 : 'text-green-600 bg-green-50 dark:bg-green-900/20'}`} />
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-3 mt-4">
//                     <Button onClick={handleSave} disabled={saving}
//                         className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white">
//                         <Save className="h-4 w-4" />
//                         {saving ? 'Saving...' : 'Save GRN'}
//                     </Button>
//                     <Button onClick={handleSave} disabled={saving}
//                         className="flex-1 gap-2">
//                         <Printer className="h-4 w-4" /> Save & Print GRN
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default function WrappedGRNPage() {
//     return (
//         <>
//             <Head title="GRN" />
//             <GRNPage />
//         </>
//     );
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
import { DatePicker, ExpiryDatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Trash2, Printer, Save, Plus, Search, Package, Barcode } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import axios from 'axios';

// --- Types ---
interface Supplier { id: number; name: string; is_vat: number; }
interface NewSupplierForm {
    name?: string;
    contact_no?: string;
    email?: string;
    address?: string;
    is_vat?: number;
    vat_company_name?: string;
    vat_nick_name?: string;
    vat_company_address?: string;
    vat_company_contact?: string;
    vat_number?: string;
}
interface Product {
    id: number;
    generic_name: string;
    barcode_value: string;
    brand?: { name: string };
    category?: { name: string };
}

interface GrnItem {
    productId: number;
    name: string;
    qty: number;
    unitPrice: number;
    batchNumber: string;
    expiryDate: string;
    mfdDate: string;
}

// New product form
interface NewProductForm {
    generic_name: string;
    barcode_value: string;
    sku: string;
    reorder_level: string;
    category_id: string;
    unit_type_id: string;
    brand_id: string;
}

const spinnerOff = '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

function GRNPage() {
    const { user } = useAuth();

    const [grnNum, setGrnNum] = useState('GRN-0001');
    const [grnDate, setGrnDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [supplierId, setSupplierId] = useState('');
    const [invoiceNo, setInvoiceNo] = useState('');
    const [barcodeInput, setBarcodeInput] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [items, setItems] = useState<GrnItem[]>([]);
    const [paidAmount, setPaidAmount] = useState('');
    const [discount, setDiscount] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState<string>('');
    const [paymentMethods, setPaymentMethods] = useState<{ id: number; name: string }[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [saving, setSaving] = useState(false);
    const [showProductSearch, setShowProductSearch] = useState(false);

    // New product registration dialog
    const [showNewProduct, setShowNewProduct] = useState(false);
    const [newProductForm, setNewProductForm] = useState<NewProductForm>({
        generic_name: '', barcode_value: '', sku: '',
        reorder_level: '10', category_id: '', unit_type_id: '', brand_id: '',
    });
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
    const [unitTypes, setUnitTypes] = useState<{ id: number; name: string }[]>([]);

    // Inline-add dialogs for Register New Product
    const [showNewBrandGrn,    setShowNewBrandGrn]    = useState(false);
    const [showNewCatGrn,      setShowNewCatGrn]      = useState(false);
    const [showNewUnitTypeGrn, setShowNewUnitTypeGrn] = useState(false);
    const [newBrandNameGrn,    setNewBrandNameGrn]    = useState('');
    const [newCatNameGrn,      setNewCatNameGrn]      = useState('');
    const [newUnitTypeNameGrn, setNewUnitTypeNameGrn] = useState('');

    // Add Supplier from GRN
    const [showAddSupplierGrn, setShowAddSupplierGrn] = useState(false);
    const [supplierFormGrn,    setSupplierFormGrn]    = useState<NewSupplierForm>({});

    const handleAddBrandGrn = async () => {
        if (!newBrandNameGrn.trim()) return;
        try {
            const res = await axios.post('/brands/store', { name: newBrandNameGrn.trim() });
            setBrands((prev) => [...prev, res.data]);
            setNewProductForm((f) => ({ ...f, brand_id: String(res.data.id) }));
            setNewBrandNameGrn('');
            setShowNewBrandGrn(false);
        } catch (e: any) { console.log(e.response?.data); }
    };

    const handleAddCatGrn = async () => {
        if (!newCatNameGrn.trim()) return;
        try {
            const res = await axios.post('/categories/store', { name: newCatNameGrn.trim() });
            setCategories((prev) => [...prev, res.data]);
            setNewProductForm((f) => ({ ...f, category_id: String(res.data.id) }));
            setNewCatNameGrn('');
            setShowNewCatGrn(false);
        } catch (e: any) { console.log(e.response?.data); }
    };

    const handleAddUnitTypeGrn = async () => {
        if (!newUnitTypeNameGrn.trim()) return;
        try {
            const res = await axios.post('/unit-types/store', { name: newUnitTypeNameGrn.trim() });
            setUnitTypes((prev) => [...prev, res.data]);
            setNewProductForm((f) => ({ ...f, unit_type_id: String(res.data.id) }));
            setNewUnitTypeNameGrn('');
            setShowNewUnitTypeGrn(false);
        } catch (e: any) { console.log(e.response?.data); }
    };

    const handleAddSupplierGrn = async () => {
        if (!supplierFormGrn.name?.trim()) return;
        try {
            const res = await axios.post('/suppliers/store', {
                name:                supplierFormGrn.name,
                contact_no:          supplierFormGrn.contact_no,
                email:               supplierFormGrn.email,
                address:             supplierFormGrn.address,
                is_vat:              supplierFormGrn.is_vat ?? 0,
                vat_company_name:    supplierFormGrn.vat_company_name,
                vat_nick_name:       supplierFormGrn.vat_nick_name,
                vat_company_address: supplierFormGrn.vat_company_address,
                vat_company_contact: supplierFormGrn.vat_company_contact,
                vat_number:          supplierFormGrn.vat_number,
            });
            setSuppliers((prev) => [...prev, { id: res.data.id, name: res.data.name, is_vat: res.data.is_vat }]);
            setSupplierId(String(res.data.id));
            setShowAddSupplierGrn(false);
            setSupplierFormGrn({});
            toast.success(`Supplier "${res.data.name}" added!`);
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Failed to add supplier.');
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    // Totals
    const subTotal          = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    const discountNum       = Number(discount || 0);
    const discountedTotal   = Math.max(0, subTotal - discountNum);
    const [vatRate, setVatRate] = useState(0);
    const selectedSupplierIsVat = suppliers.find((s) => String(s.id) === supplierId)?.is_vat === 1;
    const vatAmount  = selectedSupplierIsVat && vatRate > 0
        ? Math.round((discountedTotal / 100) * vatRate)
        : 0;
    const grandTotal = discountedTotal + vatAmount;
    const balance    = grandTotal - Number(paidAmount || 0);

    useEffect(() => {
        fetchFormData();
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (!grnDate) return;
        axios.get('/vat/by-date', { params: { date: grnDate } })
            .then((res) => setVatRate(res.data ? Number(res.data.vat_percentage) : 0))
            .catch(() => setVatRate(0));
    }, [grnDate]);

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
            setCategories(res.data.categories || []);
            setBrands(res.data.brands || []);
            setUnitTypes(res.data.unit_types || []);
            setPaymentMethods(res.data.payment_methods || []);
            if (res.data.next_number) setGrnNum(res.data.next_number);
        } catch (e: any) { console.log(e.response?.data); }
    };

    // Auto generate batch number
    const generateBatchNumber = () => {
        const date = format(new Date(), 'yyyyMMdd');
        const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `BCH-${date}-${rand}`;
    };

    const supplierOptions = suppliers.map((s) => ({
        value: String(s.id), label: s.name,
    }));

    // Filter products for search panel
    const filteredProducts = products.filter((p) =>
        p.generic_name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.barcode_value?.includes(productSearch)
    );

    // Add product to items
    const addProduct = (p: Product) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.productId === p.id);
            if (existing) {
                return prev.map((i) => i.productId === p.id
                    ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, {
                productId: p.id,
                name: p.generic_name,
                qty: 1,
                unitPrice: 0,
                batchNumber: generateBatchNumber(),
                expiryDate: '',
                mfdDate: '',
            }];
        });
        setShowProductSearch(false);
        setProductSearch('');
    };

    // Handle barcode scan
    const handleBarcode = (e: React.KeyboardEvent) => {
        if (e.key !== 'Enter' || !barcodeInput.trim()) return;
        const barcode = barcodeInput.trim();
        const found = products.find((p) => p.barcode_value === barcode);

        if (found) {
            addProduct(found);
        } else {
            // ✅ Product not found - open register dialog with barcode prefilled
            setNewProductForm((f) => ({ ...f, barcode_value: barcode }));
            setShowNewProduct(true);
            toast.info(`Product not found. Please register barcode: ${barcode}`);
        }
        setBarcodeInput('');
    };

    const updateItem = (productId: number, field: keyof GrnItem, value: any) => {
        setItems((prev) => prev.map((i) =>
            i.productId === productId ? { ...i, [field]: value } : i
        ));
    };

    // ✅ Register new product from GRN
    const handleRegisterProduct = async () => {
        if (!newProductForm.generic_name || !newProductForm.barcode_value) {
            toast.error('Product name and barcode are required.');
            return;
        }
        try {
            const res = await axios.post('/products/store', {
                generic_name: newProductForm.generic_name,
                barcode_value: newProductForm.barcode_value,
                sku: newProductForm.sku || `SKU-${Date.now()}`,
                reorder_level: Number(newProductForm.reorder_level || 10),
                category_id: Number(newProductForm.category_id),
                unit_type_id: Number(newProductForm.unit_type_id),
                brand_id: Number(newProductForm.brand_id),
                status: 1,
            });

            // Add to products list and immediately add to GRN items
            const newProduct = res.data;
            setProducts((prev) => [...prev, newProduct]);
            addProduct(newProduct);

            setShowNewProduct(false);
            setNewProductForm({
                generic_name: '', barcode_value: '', sku: '',
                reorder_level: '10', category_id: '', unit_type_id: '', brand_id: '',
            });
            toast.success(`Product "${newProduct.generic_name}" registered and added!`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to register product.');
            console.log(error.response?.data);
        }
    };

    // ✅ Save GRN
    const handleSave = async (print = false) => {
        if (!supplierId) { toast.error('Please select a supplier.'); return; }
        if (items.length === 0) { toast.error('Please add at least one product.'); return; }

        // Validate items have prices
        const invalidItem = items.find((i) => i.unitPrice <= 0);
        if (invalidItem) {
            toast.error(`Please enter cost price for: ${invalidItem.name}`);
            return;
        }

        setSaving(true);
        const toastId = toast.loading('Saving GRN...');

        try {
            const res = await axios.post('/grn/store', {
                supplier_id: Number(supplierId),
                supplier_invoice_no: invoiceNo || null,
                received_date: grnDate,
                sub_total: subTotal,
                discount: discountNum,
                total_amount: grandTotal,
                paid_amount: Number(paidAmount || 0),
                payment_method_id: paymentMethodId ? Number(paymentMethodId) : null,
                is_vat: selectedSupplierIsVat ? 1 : 0,
                vat_amount: vatAmount,
                vat_percentage: selectedSupplierIsVat ? vatRate : 0,
                items: items.map((i) => ({
                    product_id: i.productId,
                    quantity: i.qty,
                    unit_price: i.unitPrice,
                    batch_number: i.batchNumber || null,
                    expiry_date: i.expiryDate || null,
                    mfd_date: i.mfdDate || null,
                })),
            });

            toast.success('GRN saved successfully!', { id: toastId });

            if (print) {
                window.open('/grn/print/' + res.data.id, '_blank');
            }

            // Reset
            setItems([]);
            setSupplierId('');
            setInvoiceNo('');
            setDiscount('');
            setPaidAmount('');
            setPaymentMethodId('');
            await fetchNextNumber();

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save GRN.', { id: toastId });
            console.log(error.response?.data);
        } finally {
            setSaving(false);
        }
    };

    // ✅ Print GRN Report
    const printGRN = (data: any) => {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) return;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>GRN Report - ${data.grn_number}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 13px; color: #111; padding: 30px; }
        .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #111; padding-bottom: 16px; }
        .header h1 { font-size: 22px; font-weight: bold; }
        .header p { font-size: 12px; color: #555; margin-top: 4px; }
        .grn-title { font-size: 16px; font-weight: bold; text-align: center; margin: 12px 0; letter-spacing: 1px; }
        .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; padding: 12px; border: 1px solid #ddd; border-radius: 4px; }
        .meta-item { display: flex; flex-direction: column; gap: 2px; }
        .meta-label { font-size: 10px; color: #777; text-transform: uppercase; }
        .meta-value { font-size: 13px; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        thead { background: #f3f4f6; }
        th { padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #555; border-bottom: 2px solid #ddd; }
        td { padding: 8px 10px; border-bottom: 1px solid #eee; font-size: 12px; }
        tr:last-child td { border-bottom: none; }
        .text-right { text-align: right; }
        .totals { margin-left: auto; width: 280px; }
        .totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
        .totals-row.total { font-weight: bold; font-size: 15px; border-top: 2px solid #111; padding-top: 8px; margin-top: 4px; }
        .totals-row.discount { color: #dc2626; }
        .footer { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .signature { border-top: 1px solid #111; padding-top: 8px; text-align: center; font-size: 11px; color: #555; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .badge-paid { background: #dcfce7; color: #166534; }
        .badge-partial { background: #fef9c3; color: #854d0e; }
        .badge-unpaid { background: #fee2e2; color: #991b1b; }
        @media print {
            body { padding: 15px; }
            button { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Edirisinghe Medi Enterprises</h1>
        <p>Goods Received Note</p>
    </div>

    <div class="grn-title">GRN — ${data.grn_number}</div>

    <div class="meta">
        <div class="meta-item">
            <span class="meta-label">GRN Number</span>
            <span class="meta-value">${data.grn_number}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Date</span>
            <span class="meta-value">${data.received_date}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Supplier</span>
            <span class="meta-value">${data.supplier}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Supplier Invoice No.</span>
            <span class="meta-value">${data.invoice_no || '—'}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Received By</span>
            <span class="meta-value">${data.received_by}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Payment Method</span>
            <span class="meta-value" style="text-transform:capitalize">${data.payment_method}</span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Product</th>
                <th>Batch No.</th>
                <th>Expiry</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Cost Price</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            ${data.items.map((item: GrnItem, i: number) => `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${item.name}</strong></td>
                <td style="font-family:monospace">${item.batchNumber || '—'}</td>
                <td>${item.expiryDate || '—'}</td>
                <td class="text-right">${item.qty}</td>
                <td class="text-right">Rs. ${Number(item.unitPrice).toLocaleString()}</td>
                <td class="text-right"><strong>Rs. ${(item.qty * item.unitPrice).toLocaleString()}</strong></td>
            </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="totals">
        <div class="totals-row">
            <span>Sub Total</span>
            <span>Rs. ${Number(data.sub_total).toLocaleString()}</span>
        </div>
        ${data.discount > 0 ? `
        <div class="totals-row discount">
            <span>Discount</span>
            <span>- Rs. ${Number(data.discount).toLocaleString()}</span>
        </div>` : ''}
        <div class="totals-row total">
            <span>TOTAL</span>
            <span>Rs. ${Number(data.total_amount).toLocaleString()}</span>
        </div>
        <div class="totals-row" style="color:#16a34a">
            <span>Paid Amount</span>
            <span>Rs. ${Number(data.paid_amount).toLocaleString()}</span>
        </div>
        <div class="totals-row">
            <span>Balance</span>
            <span style="color:${data.total_amount - data.paid_amount > 0 ? '#dc2626' : '#16a34a'}">
                Rs. ${Math.abs(data.total_amount - data.paid_amount).toLocaleString()}
            </span>
        </div>
    </div>

    <div class="footer">
        <div class="signature">Received By: ${data.received_by}</div>
        <div class="signature">Authorized Signature</div>
    </div>

    <script>
        window.onload = () => { window.print(); window.onafterprint = () => window.close(); }
    </script>
</body>
</html>`;

        printWindow.document.write(html);
        printWindow.document.close();
    };

    const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));
    const brandOptions = brands.map((b) => ({ value: String(b.id), label: b.name }));
    const unitTypeOptions = unitTypes.map((u) => ({ value: String(u.id), label: u.name }));

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-5 space-y-5 animate-fade-in">

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Purchase</p>
                    <h1 className="text-xl font-bold tracking-tight">New Goods Received Note</h1>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono bg-muted px-3 py-1.5 rounded-lg border font-semibold tracking-wide">
                        {grnNum}
                    </span>
                    <Button onClick={() => handleSave(false)} disabled={saving}
                        variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save GRN'}
                    </Button>
                    <Button onClick={() => handleSave(true)} disabled={saving} className="gap-2">
                        <Printer className="h-4 w-4" /> Save & Print
                    </Button>
                </div>
            </div>

            {/* ── GRN Info Card ── */}
            <div className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-1 rounded-full bg-primary" />
                    <h2 className="text-sm font-semibold">GRN Information</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">GRN Date</label>
                        <DatePicker value={grnDate} onChange={setGrnDate} className="w-full" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Supplier</label>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Combobox options={supplierOptions} value={supplierId}
                                    onValueChange={setSupplierId}
                                    placeholder="Select supplier"
                                    searchPlaceholder="Search suppliers..." />
                            </div>
                            <Button variant="outline" size="icon"
                                onClick={() => { setSupplierFormGrn({}); setShowAddSupplierGrn(true); }}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                            Invoice No. <span className="text-muted-foreground/60">(optional)</span>
                        </label>
                        <Input value={invoiceNo}
                            onChange={(e) => setInvoiceNo(e.target.value)}
                            placeholder="Supplier invoice #" />
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Received by: <span className="font-medium text-foreground ml-0.5">{user?.name}</span>
                </div>
            </div>

            {/* ── Products Card ── */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">

                {/* Products header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-1 rounded-full bg-primary" />
                        <h2 className="text-sm font-semibold">Products</h2>
                        {items.length > 0 && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                {items.length} item{items.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowProductSearch(true)} className="gap-1.5 h-8 text-xs">
                            <Search className="h-3.5 w-3.5" /> Search
                        </Button>
                        <Button variant="outline" size="sm"
                            onClick={() => { setNewProductForm({ generic_name: '', barcode_value: '', sku: '', reorder_level: '10', category_id: '', unit_type_id: '', brand_id: '' }); setShowNewProduct(true); }}
                            className="gap-1.5 h-8 text-xs">
                            <Plus className="h-3.5 w-3.5" /> New Product
                        </Button>
                    </div>
                </div>

                {/* Barcode scanner row */}
                <div className="px-5 py-3 bg-muted/30 border-b border-border/50">
                    <div className="relative max-w-sm">
                        <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input ref={inputRef} value={barcodeInput}
                            onChange={(e) => setBarcodeInput(e.target.value)}
                            onKeyDown={handleBarcode}
                            placeholder="Scan barcode and press Enter..."
                            className="pl-9 h-9 bg-background text-sm" />
                    </div>
                </div>

                {/* Items table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/40 text-xs border-b border-border">
                                <th className="text-left font-medium text-muted-foreground px-4 py-3 w-8">#</th>
                                <th className="text-left font-medium text-muted-foreground px-4 py-3">Product</th>
                                <th className="text-center font-medium text-muted-foreground px-3 py-3 w-20">Qty</th>
                                <th className="text-center font-medium text-muted-foreground px-3 py-3 w-36">Cost Price</th>
                                <th className="text-center font-medium text-muted-foreground px-3 py-3 w-32">Batch No.</th>
                                <th className="text-center font-medium text-muted-foreground px-3 py-3 w-36">Expiry Date</th>
                                <th className="text-right font-medium text-muted-foreground px-4 py-3 w-32">Total</th>
                                <th className="px-3 py-3 w-8" />
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-16 text-muted-foreground">
                                        <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                        <p className="text-sm font-medium">No products added yet</p>
                                        <p className="text-xs mt-1 opacity-70">Scan a barcode, search, or register a new product</p>
                                    </td>
                                </tr>
                            ) : items.map((item, idx) => (
                                <tr key={item.productId} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                                    <td className="px-4 py-2.5 text-xs text-muted-foreground font-mono">{idx + 1}</td>
                                    <td className="px-4 py-2.5 text-sm font-medium">{item.name}</td>
                                    <td className="px-3 py-2.5">
                                        <Input type="number" value={item.qty}
                                            onChange={(e) => updateItem(item.productId, 'qty', Number(e.target.value))}
                                            className={`w-24 h-8 text-center mx-auto ${spinnerOff}`} />
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <Input type="number" value={item.unitPrice || ''}
                                            onChange={(e) => updateItem(item.productId, 'unitPrice', Number(e.target.value))}
                                            className={`w-24 h-8 text-right mx-auto ${spinnerOff}`}
                                            placeholder="0.00" />
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <Input value={item.batchNumber}
                                            onChange={(e) => updateItem(item.productId, 'batchNumber', e.target.value)}
                                            className="w-28 h-8 mx-auto font-mono text-xs"
                                            placeholder="BCH-..." />
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <ExpiryDatePicker
                                            value={item.expiryDate}
                                            onChange={(v) => updateItem(item.productId, 'expiryDate', v)} />
                                    </td>
                                    <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums">
                                        Rs. {(item.qty * item.unitPrice).toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <button onClick={() => setItems((prev) => prev.filter((i) => i.productId !== item.productId))}
                                            className="text-muted-foreground hover:text-destructive transition-colors">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Financial Summary Panel */}
                <div className="border-t border-border bg-muted/20 px-5 py-5">
                    <div className="flex justify-end">
                        <div className="w-full max-w-md">
                            <div className="flex items-center justify-between py-2.5 border-b border-border/40">
                                <span className="text-xs font-medium text-muted-foreground">Payment Method</span>
                                <div className="w-44">
                                    <Select value={paymentMethodId} onValueChange={setPaymentMethodId}>
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="Select method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paymentMethods.map((pm) => (
                                                <SelectItem key={pm.id} value={String(pm.id)}>{pm.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2.5 border-b border-border/40">
                                <span className="text-xs text-muted-foreground">Sub Total</span>
                                <span className="text-sm font-medium tabular-nums">Rs. {subTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between py-2.5 border-b border-border/40">
                                <span className="text-xs text-muted-foreground">Discount (Rs.)</span>
                                <div className="w-32">
                                    <Input type="number" value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        className={`h-8 text-right text-xs ${spinnerOff}`}
                                        placeholder="0" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2.5 border-b border-border/40">
                                <span className={`text-xs ${selectedSupplierIsVat ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
                                    {selectedSupplierIsVat && vatRate > 0 ? `VAT (${vatRate.toFixed(2)}%)` : 'VAT'}
                                </span>
                                <span className={`text-sm tabular-nums ${selectedSupplierIsVat ? 'font-medium' : 'text-muted-foreground/40'}`}>
                                    Rs. {vatAmount.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-border">
                                <span className="text-sm font-semibold">Grand Total</span>
                                <span className="text-base font-bold tabular-nums">Rs. {grandTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between py-2.5 border-b border-border/40">
                                <span className="text-xs text-muted-foreground">Paid Amount (Rs.)</span>
                                <div className="w-32">
                                    <Input type="number" value={paidAmount}
                                        onChange={(e) => setPaidAmount(e.target.value)}
                                        className={`h-8 text-right text-xs ${spinnerOff}`}
                                        placeholder="0" />
                                </div>
                            </div>
                            <div className={`flex items-center justify-between py-3 rounded-lg px-3 mt-2 ${
                                balance > 0
                                    ? 'bg-destructive/10 border border-destructive/20'
                                    : 'bg-green-500/10 border border-green-500/20'
                            }`}>
                                <span className={`text-xs font-semibold ${balance > 0 ? 'text-destructive' : 'text-green-600'}`}>
                                    {balance > 0 ? 'Balance Due' : 'Balance'}
                                </span>
                                <span className={`text-base font-bold tabular-nums ${balance > 0 ? 'text-destructive' : 'text-green-600'}`}>
                                    Rs. {Math.abs(balance).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="flex justify-end gap-3 pb-6">
                <Button onClick={() => handleSave(false)} disabled={saving}
                    size="lg" variant="outline"
                    className="gap-2 border-primary/30 text-primary hover:bg-primary/5 px-8">
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save GRN'}
                </Button>
                <Button onClick={() => handleSave(true)} disabled={saving} size="lg" className="gap-2 px-8">
                    <Printer className="h-4 w-4" /> Save & Print GRN
                </Button>
            </div>

            {/* ✅ Product Search Dialog */}
            <Dialog open={showProductSearch} onOpenChange={setShowProductSearch}>
                <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Search & Add Product</DialogTitle>
                    </DialogHeader>
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            placeholder="Search by name or barcode..."
                            className="pl-9" autoFocus />
                    </div>
                    <div className="overflow-y-auto flex-1 space-y-1 pr-1">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No products found.
                                <button onClick={() => { setShowProductSearch(false); setShowNewProduct(true); }}
                                    className="block mx-auto mt-2 text-primary text-xs underline">
                                    Register new product
                                </button>
                            </div>
                        ) : filteredProducts.map((p) => (
                            <button key={p.id} onClick={() => addProduct(p)}
                                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border text-left transition-colors">
                                <div>
                                    <p className="text-sm font-medium">{p.generic_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {p.brand?.name} · {p.category?.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-mono text-muted-foreground">{p.barcode_value}</p>
                                    <span className="text-xs text-primary font-medium">+ Add</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* ✅ Add Supplier from GRN */}
            <Dialog open={showAddSupplierGrn} onOpenChange={setShowAddSupplierGrn}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Supplier</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
                            <Input autoFocus value={supplierFormGrn.name || ''}
                                onChange={(e) => setSupplierFormGrn({ ...supplierFormGrn, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Mobile</label>
                            <Input value={supplierFormGrn.contact_no || ''}
                                onChange={(e) => setSupplierFormGrn({ ...supplierFormGrn, contact_no: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
                            <Input value={supplierFormGrn.email || ''}
                                onChange={(e) => setSupplierFormGrn({ ...supplierFormGrn, email: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label>
                            <Input value={supplierFormGrn.address || ''}
                                onChange={(e) => setSupplierFormGrn({ ...supplierFormGrn, address: e.target.value })} />
                        </div>
                        {/* VAT Registered */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={!!supplierFormGrn.is_vat}
                                onChange={(e) => setSupplierFormGrn({ ...supplierFormGrn, is_vat: e.target.checked ? 1 : 0 })} />
                            <span className="text-sm">VAT Registered Supplier</span>
                        </label>

                        {!!supplierFormGrn.is_vat && (
                            <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                                <p className="col-span-2 text-xs font-semibold text-muted-foreground">VAT Supplier Details</p>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Company Name</label>
                                    <Input value={supplierFormGrn.vat_company_name || ''}
                                        onChange={(e) => setSupplierFormGrn({ ...supplierFormGrn, vat_company_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Nick Name</label>
                                    <Input value={supplierFormGrn.vat_nick_name || ''}
                                        onChange={(e) => setSupplierFormGrn({ ...supplierFormGrn, vat_nick_name: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Company Address</label>
                                    <Input value={supplierFormGrn.vat_company_address || ''}
                                        onChange={(e) => setSupplierFormGrn({ ...supplierFormGrn, vat_company_address: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Contact Number</label>
                                    <Input value={supplierFormGrn.vat_company_contact || ''}
                                        onChange={(e) => setSupplierFormGrn({ ...supplierFormGrn, vat_company_contact: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 block">VAT Number</label>
                                    <Input value={supplierFormGrn.vat_number || ''}
                                        onChange={(e) => setSupplierFormGrn({ ...supplierFormGrn, vat_number: e.target.value })} />
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowAddSupplierGrn(false); setSupplierFormGrn({}); }}>Cancel</Button>
                        <Button onClick={handleAddSupplierGrn}>Add Supplier</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ✅ Register New Product Dialog */}
            <Dialog open={showNewProduct} onOpenChange={setShowNewProduct}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="h-4 w-4" /> Register New Product
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">

                        {/* Generic Name - full width */}
                        <div className="sm:col-span-2">
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Generic Name</label>
                            <Input autoFocus
                                value={newProductForm.generic_name}
                                onChange={(e) => setNewProductForm({ ...newProductForm, generic_name: e.target.value })} />
                        </div>

                        {/* Barcode */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Barcode</label>
                            <div className="flex gap-2">
                                <Input className="flex-1"
                                    value={newProductForm.barcode_value}
                                    onChange={(e) => setNewProductForm({ ...newProductForm, barcode_value: e.target.value })} />
                                <Button variant="outline" size="icon"
                                    onClick={() => setNewProductForm({ ...newProductForm, barcode_value: String(Math.floor(Math.random() * 9000000000) + 1000000000) })}>
                                    <Barcode className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* SKU */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">SKU (auto if empty)</label>
                            <Input value={newProductForm.sku}
                                onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })} />
                        </div>

                        {/* Reorder Level */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Reorder Level</label>
                            <Input type="number" className={spinnerOff}
                                value={newProductForm.reorder_level}
                                onChange={(e) => setNewProductForm({ ...newProductForm, reorder_level: e.target.value })} />
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Brand</label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Combobox options={brands.map((b) => ({ value: String(b.id), label: b.name }))}
                                        value={newProductForm.brand_id}
                                        onValueChange={(v) => setNewProductForm({ ...newProductForm, brand_id: v })}
                                        placeholder="Select brand..." searchPlaceholder="Search..." />
                                </div>
                                <Button variant="outline" size="icon" onClick={() => setShowNewBrandGrn(true)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Combobox options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                                        value={newProductForm.category_id}
                                        onValueChange={(v) => setNewProductForm({ ...newProductForm, category_id: v })}
                                        placeholder="Select category..." searchPlaceholder="Search..." />
                                </div>
                                <Button variant="outline" size="icon" onClick={() => setShowNewCatGrn(true)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Unit Type */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Unit Type</label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Combobox options={unitTypes.map((u) => ({ value: String(u.id), label: u.name }))}
                                        value={newProductForm.unit_type_id}
                                        onValueChange={(v) => setNewProductForm({ ...newProductForm, unit_type_id: v })}
                                        placeholder="Select unit..." searchPlaceholder="Search..." />
                                </div>
                                <Button variant="outline" size="icon" onClick={() => setShowNewUnitTypeGrn(true)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Barcode preview */}
                        {newProductForm.barcode_value && (
                            <div className="sm:col-span-2 p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                                <Barcode className="h-5 w-5 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Barcode Preview</p>
                                    <p className="text-base font-mono tracking-widest">{newProductForm.barcode_value}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewProduct(false)}>Cancel</Button>
                        <Button onClick={handleRegisterProduct} className="gap-2">
                            <Plus className="h-4 w-4" /> Register & Add to GRN
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Inline Add Brand */}
            <Dialog open={showNewBrandGrn} onOpenChange={(open) => !open && setShowNewBrandGrn(false)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle>Add New Brand</DialogTitle></DialogHeader>
                    <div className="py-2">
                        <FloatingInput label="Brand Name" value={newBrandNameGrn}
                            onChange={(e) => setNewBrandNameGrn(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddBrandGrn()} autoFocus />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowNewBrandGrn(false); setNewBrandNameGrn(''); }}>Cancel</Button>
                        <Button onClick={handleAddBrandGrn}>Add Brand</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Inline Add Category */}
            <Dialog open={showNewCatGrn} onOpenChange={(open) => !open && setShowNewCatGrn(false)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle>Add New Category</DialogTitle></DialogHeader>
                    <div className="py-2">
                        <FloatingInput label="Category Name" value={newCatNameGrn}
                            onChange={(e) => setNewCatNameGrn(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCatGrn()} autoFocus />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowNewCatGrn(false); setNewCatNameGrn(''); }}>Cancel</Button>
                        <Button onClick={handleAddCatGrn}>Add Category</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Inline Add Unit Type */}
            <Dialog open={showNewUnitTypeGrn} onOpenChange={(open) => !open && setShowNewUnitTypeGrn(false)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle>Add New Unit Type</DialogTitle></DialogHeader>
                    <div className="py-2">
                        <FloatingInput label="Unit Type Name" value={newUnitTypeNameGrn}
                            onChange={(e) => setNewUnitTypeNameGrn(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddUnitTypeGrn()} autoFocus />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowNewUnitTypeGrn(false); setNewUnitTypeNameGrn(''); }}>Cancel</Button>
                        <Button onClick={handleAddUnitTypeGrn}>Add Unit Type</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
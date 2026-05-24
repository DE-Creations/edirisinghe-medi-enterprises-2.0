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
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Trash2, Printer, Save, Plus, Search, Package } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import axios from 'axios';

// --- Types ---
interface Supplier { id: number; name: string; }
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
    sellingPrice: number;
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
    const [supplierId, setSupplierId] = useState('');
    const [invoiceNo, setInvoiceNo] = useState('');
    const [barcodeInput, setBarcodeInput] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [items, setItems] = useState<GrnItem[]>([]);
    const [paidAmount, setPaidAmount] = useState('');
    const [discount, setDiscount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'cheque'>('cash');
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

    const inputRef = useRef<HTMLInputElement>(null);

    // Totals
    const subTotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    const discountedTotal = Math.max(0, subTotal - Number(discount || 0));
    const balance = discountedTotal - Number(paidAmount || 0);

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
            setCategories(res.data.categories || []);
            setBrands(res.data.brands || []);
            setUnitTypes(res.data.unit_types || []);
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
                sellingPrice: 0,
                batchNumber: generateBatchNumber(), // ✅ auto generate
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
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const date = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const receivedDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
            const res = await axios.post('/grn/store', {
                supplier_id: Number(supplierId),
                supplier_invoice_no: invoiceNo || null,
                received_date: receivedDateTime,
                sub_total: subTotal,
                discount: Number(discount || 0),
                total_amount: discountedTotal,
                paid_amount: Number(paidAmount || 0),
                payment_method: paymentMethod,
                items: items.map((i) => ({
                    product_id: i.productId,
                    quantity: i.qty,
                    unit_price: i.unitPrice,
                    selling_price: i.sellingPrice,
                    batch_number: i.batchNumber || null,
                    expiry_date: i.expiryDate || null,
                    mfd_date: i.mfdDate || null,
                })),
            });

            toast.success('GRN saved successfully!', { id: toastId });

            if (print) {
                // ✅ Open print dialog with GRN data
                printGRN({
                    grn_number: grnNum,
                    received_date: receivedDateTime,
                    supplier: suppliers.find((s) => String(s.id) === supplierId)?.name || '',
                    invoice_no: invoiceNo,
                    items,
                    sub_total: subTotal,
                    discount: Number(discount || 0),
                    total_amount: discountedTotal,
                    paid_amount: Number(paidAmount || 0),
                    payment_method: paymentMethod,
                    received_by: user?.name || '',
                });
            }

            // Reset
            setItems([]);
            setSupplierId('');
            setInvoiceNo('');
            setDiscount('');
            setPaidAmount('');
            setPaymentMethod('cash');
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
                <th class="text-right">Selling Price</th>
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
                <td class="text-right">Rs. ${Number(item.sellingPrice).toLocaleString()}</td>
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
        <div className="max-w-6xl mx-auto space-y-4 animate-fade-in">
            <div className="bg-card rounded-xl border border-border p-5">

                {/* Header Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">GRN Number</label>
                        <Input value={grnNum} readOnly className="bg-muted font-mono" />
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

                {/* Received by */}
                <div className="mb-3 text-xs text-muted-foreground">
                    Received by: <span className="font-medium text-foreground">{user?.name}</span>
                </div>

                {/* Barcode + Search + Add Product */}
                <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                        <Input ref={inputRef} value={barcodeInput}
                            onChange={(e) => setBarcodeInput(e.target.value)}
                            onKeyDown={handleBarcode}
                            placeholder="Scan barcode and press Enter..." />
                    </div>

                    {/* ✅ Search Products Button */}
                    <Button variant="outline" onClick={() => setShowProductSearch(true)} className="gap-2 shrink-0">
                        <Search className="h-4 w-4" /> Search Product
                    </Button>

                    {/* ✅ Add New Product Button */}
                    <Button variant="outline"
                        onClick={() => { setNewProductForm({ generic_name: '', barcode_value: '', sku: '', reorder_level: '10', category_id: '', unit_type_id: '', brand_id: '' }); setShowNewProduct(true); }}
                        className="gap-2 shrink-0">
                        <Plus className="h-4 w-4" /> New Product
                    </Button>
                </div>

                {/* Items Table */}
                <div className="border rounded-lg overflow-hidden mb-4">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50 border-b text-xs">
                                    <th className="text-left font-medium text-muted-foreground px-3 py-2">Product</th>
                                    <th className="text-center font-medium text-muted-foreground px-3 py-2 w-20">Qty</th>
                                    <th className="text-center font-medium text-muted-foreground px-3 py-2 w-28">Cost Price</th>
                                    <th className="text-center font-medium text-muted-foreground px-3 py-2 w-28">Sell Price</th>
                                    <th className="text-center font-medium text-muted-foreground px-3 py-2 w-32">Batch No.</th>
                                    <th className="text-center font-medium text-muted-foreground px-3 py-2 w-32">Expiry Date</th>
                                    <th className="text-right font-medium text-muted-foreground px-3 py-2 w-24">Total</th>
                                    <th className="px-3 py-2 w-8"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-10 text-sm text-muted-foreground">
                                            <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                            No items added — scan a barcode, search, or add a new product
                                        </td>
                                    </tr>
                                ) : items.map((item) => (
                                    <tr key={item.productId} className="border-b last:border-0 hover:bg-muted/20">
                                        <td className="px-3 py-2 text-sm font-medium">{item.name}</td>
                                        <td className="px-3 py-2">
                                            <Input type="number" value={item.qty}
                                                onChange={(e) => updateItem(item.productId, 'qty', Number(e.target.value))}
                                                className={`w-16 h-8 text-center mx-auto ${spinnerOff}`} />
                                        </td>
                                        <td className="px-3 py-2">
                                            <Input type="number" value={item.unitPrice || ''}
                                                onChange={(e) => updateItem(item.productId, 'unitPrice', Number(e.target.value))}
                                                className={`w-24 h-8 text-right mx-auto ${spinnerOff}`}
                                                placeholder="0.00" />
                                        </td>
                                        <td className="px-3 py-2">
                                            <Input type="number" value={item.sellingPrice || ''}
                                                onChange={(e) => updateItem(item.productId, 'sellingPrice', Number(e.target.value))}
                                                className={`w-24 h-8 text-right mx-auto ${spinnerOff}`}
                                                placeholder="0.00" />
                                        </td>
                                        <td className="px-3 py-2">
                                            <Input value={item.batchNumber}
                                                onChange={(e) => updateItem(item.productId, 'batchNumber', e.target.value)}
                                                className="w-28 h-8 mx-auto font-mono text-xs"
                                                placeholder="BCH-..." />
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
                    <Button onClick={() => handleSave(false)} disabled={saving}
                        className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save GRN'}
                    </Button>
                    <Button onClick={() => handleSave(true)} disabled={saving}
                        className="flex-1 gap-2">
                        <Printer className="h-4 w-4" /> Save & Print GRN
                    </Button>
                </div>
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

            {/* ✅ Register New Product Dialog */}
            <Dialog open={showNewProduct} onOpenChange={setShowNewProduct}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="h-4 w-4" /> Register New Product
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-2">
                        <div className="col-span-2">
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                Generic Name <span className="text-destructive">*</span>
                            </label>
                            <Input value={newProductForm.generic_name}
                                onChange={(e) => setNewProductForm({ ...newProductForm, generic_name: e.target.value })}
                                placeholder="e.g. Paracetamol 500mg" autoFocus />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                Barcode <span className="text-destructive">*</span>
                            </label>
                            <Input value={newProductForm.barcode_value}
                                onChange={(e) => setNewProductForm({ ...newProductForm, barcode_value: e.target.value })}
                                className="font-mono" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">SKU</label>
                            <Input value={newProductForm.sku}
                                onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                                placeholder="Auto if empty" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Reorder Level</label>
                            <Input type="number" value={newProductForm.reorder_level}
                                onChange={(e) => setNewProductForm({ ...newProductForm, reorder_level: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                            <Combobox options={categoryOptions}
                                value={newProductForm.category_id}
                                onValueChange={(v) => setNewProductForm({ ...newProductForm, category_id: v })}
                                placeholder="Select category..." searchPlaceholder="Search..." />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Brand</label>
                            <Combobox options={brandOptions}
                                value={newProductForm.brand_id}
                                onValueChange={(v) => setNewProductForm({ ...newProductForm, brand_id: v })}
                                placeholder="Select brand..." searchPlaceholder="Search..." />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Unit Type</label>
                            <Combobox options={unitTypeOptions}
                                value={newProductForm.unit_type_id}
                                onValueChange={(v) => setNewProductForm({ ...newProductForm, unit_type_id: v })}
                                placeholder="Select unit..." searchPlaceholder="Search..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewProduct(false)}>Cancel</Button>
                        <Button onClick={handleRegisterProduct} className="gap-2">
                            <Plus className="h-4 w-4" /> Register & Add to GRN
                        </Button>
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
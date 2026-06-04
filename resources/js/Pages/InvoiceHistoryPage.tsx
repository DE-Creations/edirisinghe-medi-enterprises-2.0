// import { Head } from '@inertiajs/react';
// import AppShell from '@/AppShell';
// import React, { useState } from 'react';
// import { initialInvoices, initialReceivablePayments, type Invoice } from '@/data/mockData';
// import SearchBar from '@/components/shared/SearchBar';
// import { DatePicker } from '@/components/ui/date-picker';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Separator } from '@/components/ui/separator';
// import { Printer, Eye, Trash2 } from 'lucide-react';

// function InvoiceHistoryPage() {
//   const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
//   const [payments] = useState(initialReceivablePayments);
//   const [search, setSearch] = useState('');
//   const [dateFilter, setDateFilter] = useState('');
//   const [viewInv, setViewInv] = useState<Invoice | null>(null);

//   const filtered = invoices.filter((inv) =>
//     (inv.number.toLowerCase().includes(search.toLowerCase()) ||
//     inv.customerName?.toLowerCase().includes(search.toLowerCase()) ||
//     inv.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))) &&
//     (!dateFilter || inv.date === dateFilter)
//   );

//   const handleDelete = (id: string) => {
//     setInvoices((prev) => prev.filter((inv) => inv.id !== id));
//   };

//   const handlePrint = (inv: Invoice) => {
//     window.print();
//   };

//   return (
//     <div className="space-y-4 animate-fade-in">
//       <div className="flex flex-col sm:flex-row gap-3">
//         <div className="w-full sm:w-72"><SearchBar value={search} onChange={setSearch} placeholder="Search invoices..." /></div>
//         <DatePicker value={dateFilter} onChange={(v) => setDateFilter(v)} placeholder="Filter by date" className="w-full sm:w-44" />
//       </div>

//       <div className="bg-card rounded-xl border border-border overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-border bg-muted/50">
//                 <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Invoice #</th>
//                 <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
//                 <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Customer</th>
//                 <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Total</th>
//                 <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Payment</th>
//                 <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((inv) => (
//                 <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/30">
//                   <td className="px-4 py-3 text-sm font-medium text-primary">{inv.number}</td>
//                   <td className="px-4 py-3 text-sm">{inv.date}</td>
//                   <td className="px-4 py-3 text-sm">{inv.customerName || 'Walk-in'}</td>
//                   <td className="px-4 py-3 text-sm font-semibold text-right">Rs. {inv.total.toLocaleString()}</td>
//                   <td className="px-4 py-3">
//                     <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground capitalize">{inv.paymentMethod}</span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex items-center justify-end gap-1">
//                       <button
//                         onClick={() => setViewInv(inv)}
//                         className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
//                         title="View"
//                       >
//                         <Eye className="h-3.5 w-3.5" />
//                       </button>
//                       <button
//                         onClick={() => handlePrint(inv)}
//                         className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
//                         title="Print"
//                       >
//                         <Printer className="h-3.5 w-3.5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(inv.id)}
//                         className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
//                         title="Delete"
//                       >
//                         <Trash2 className="h-3.5 w-3.5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {filtered.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No invoices found.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* View Dialog */}
//       <Dialog open={!!viewInv} onOpenChange={(open) => !open && setViewInv(null)}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-base">Invoice</DialogTitle>
//           </DialogHeader>

//           {viewInv && (
//             <div className="space-y-4 mt-2">
//               {/* Invoice Meta */}
//               <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Invoice No.</span>
//                   <span className="font-semibold text-primary">{viewInv.number}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Date</span>
//                   <span className="font-medium">{viewInv.date}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Customer</span>
//                   <span className="font-medium">{viewInv.customerName || 'Walk-in Customer'}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Payment Method</span>
//                   <span className="capitalize font-medium">{viewInv.paymentMethod}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Paid Amount</span>
//                   <span className="font-medium">Rs. {viewInv.paidAmount.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Balance</span>
//                   <span className={`font-medium ${viewInv.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
//                     Rs. {viewInv.balance.toLocaleString()}
//                   </span>
//                 </div>
//               </div>

//               <Separator />

//               {/* Items Table */}
//               <div>
//                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items</p>
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-border">
//                       <th className="text-left py-2 font-medium text-muted-foreground text-xs">#</th>
//                       <th className="text-left py-2 font-medium text-muted-foreground text-xs">Item</th>
//                       <th className="text-right py-2 font-medium text-muted-foreground text-xs">Qty</th>
//                       <th className="text-right py-2 font-medium text-muted-foreground text-xs">Unit Price</th>
//                       <th className="text-right py-2 font-medium text-muted-foreground text-xs">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {viewInv.items.map((item, i) => (
//                       <tr key={i} className="border-b border-border last:border-0">
//                         <td className="py-2 text-muted-foreground">{i + 1}</td>
//                         <td className="py-2">
//                           <p className="font-medium">{item.name}</p>
//                           <p className="text-[10px] text-muted-foreground">{item.brand}</p>
//                         </td>
//                         <td className="py-2 text-right">{item.qty}</td>
//                         <td className="py-2 text-right">Rs. {item.price.toLocaleString()}</td>
//                         <td className="py-2 text-right font-medium">Rs. {(item.qty * item.price).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <Separator />

//               {/* Total */}
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-semibold">Total</span>
//                 <span className="text-xl font-bold text-primary">Rs. {viewInv.total.toLocaleString()}</span>
//               </div>

//               <Separator />

//               {/* Receivable Payments */}
//               <div>
//                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Payment Records</p>
//                 {(() => {
//                   const invPayments = payments.filter((p) => p.invoiceId === viewInv.id);
//                   const collected = invPayments.reduce((s, p) => s + p.amount, 0);
//                   const outstanding = Math.max(0, viewInv.total - collected);
//                   return invPayments.length === 0 ? (
//                     <p className="text-sm text-muted-foreground py-2">No payment records found.</p>
//                   ) : (
//                     <>
//                       <table className="w-full text-sm">
//                         <thead>
//                           <tr className="border-b border-border">
//                             <th className="text-left py-2 font-medium text-muted-foreground text-xs">Date</th>
//                             <th className="text-right py-2 font-medium text-muted-foreground text-xs">Amount</th>
//                             <th className="text-left py-2 font-medium text-muted-foreground text-xs pl-4">Notes</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {invPayments.map((p) => (
//                             <tr key={p.id} className="border-b border-border last:border-0">
//                               <td className="py-2">{p.date}</td>
//                               <td className="py-2 text-right font-medium text-green-600">Rs. {p.amount.toLocaleString()}</td>
//                               <td className="py-2 pl-4 text-muted-foreground">{p.notes ?? '—'}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                       <div className="flex justify-between pt-2 mt-1 border-t text-sm">
//                         <span className="text-muted-foreground">Outstanding</span>
//                         <span className={`font-semibold ${outstanding > 0 ? 'text-destructive' : 'text-green-600'}`}>
//                           Rs. {outstanding.toLocaleString()}
//                         </span>
//                       </div>
//                     </>
//                   );
//                 })()}
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


// export default function WrappedInvoiceHistoryPage() {
//   return (
//     <>
//       <Head title="Invoice History" />
//       <InvoiceHistoryPage />
//     </>
//   );
// }

// (WrappedInvoiceHistoryPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useEffect, useRef, useState } from 'react';
import SearchBar from '@/components/shared/SearchBar';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Printer, Eye, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import axios from 'axios';

interface InvoiceItem {
    id:         number;
    quantity:   number;
    unit_price: number;
    stock_batch: {
        product: { generic_name: string };
        batch_number: string | null;
    };
}

interface Invoice {
    id:             number;
    invoice_number: string;
    invoice_date:   string;
    customer:       { id: number; name: string } | null;
    user:           { name: string } | null;
    sub_total:      number;
    discount:       number;
    grand_total:    number;
    paid_amount:    number;
    payment_method: string;
    status:         string;
    items:          InvoiceItem[];
}

function InvoiceHistoryPage() {
    const [invoices,    setInvoices]    = useState<Invoice[]>([]);
    const [search,      setSearch]      = useState('');
    const [dateFilter,  setDateFilter]  = useState('');
    const [viewInv,     setViewInv]     = useState<Invoice | null>(null);
    const [deleteId,    setDeleteId]    = useState<number | null>(null);
    const [page,        setPage]        = useState(1);
    const [lastPage,    setLastPage]    = useState(1);
    const [total,       setTotal]       = useState(0);
    const [loading,     setLoading]     = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchInvoices = async (pg: number, s: string, d: string) => {
        setLoading(true);
        try {
            const res = await axios.get('/invoice/all', {
                params: { page: pg, search: s || undefined, date: d || undefined },
            });
            setInvoices(res.data.data);
            setLastPage(res.data.last_page);
            setTotal(res.data.total);
        } catch (e) { console.log(e); }
        finally { setLoading(false); }
    };

    // Fetch when page changes
    useEffect(() => { fetchInvoices(page, search, dateFilter); }, [page]);

    // Debounce search/date changes and reset to page 1
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setPage(1);
            fetchInvoices(1, search, dateFilter);
        }, 350);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [search, dateFilter]);

    const handleDelete = async () => {
        try {
            await axios.delete(`/invoice/delete/${deleteId}`);
            setInvoices((prev) => prev.filter((i) => i.id !== deleteId));
            setDeleteId(null);
            setTotal((t) => t - 1);
            toast.success('Invoice deleted.');
        } catch (e) {
            toast.error('Failed to delete invoice.');
        }
    };

    const statusColor = (status: string) => {
        if (status === 'paid')    return 'bg-green-500/10 text-green-600';
        if (status === 'partial') return 'bg-yellow-500/10 text-yellow-600';
        return 'bg-destructive/10 text-destructive';
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-72">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search invoices..." />
                </div>
                <DatePicker value={dateFilter} onChange={setDateFilter}
                    placeholder="Filter by date" className="w-full sm:w-44" />
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Invoice #</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Customer</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Served By</th>
                                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Total</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                    <td className="px-4 py-3 text-sm font-medium text-primary font-mono">
                                        {inv.invoice_number}
                                    </td>
                                    <td className="px-4 py-3 text-sm">{inv.invoice_date}</td>
                                    <td className="px-4 py-3 text-sm">
                                        {inv.customer?.name || 'Walk-in Customer'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                                        {inv.user?.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-right">
                                        Rs. {Number(inv.grand_total).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor(inv.status)}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => setViewInv(inv)}
                                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                                                <Eye className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => window.open('/invoice/print/' + inv.id, '_blank')}
                                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                                                <Printer className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => setDeleteId(inv.id)}
                                                className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {invoices.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                        {loading ? 'Loading...' : 'No invoices found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        Page {page} of {lastPage} &mdash; {total} records
                    </span>
                    <div className="flex gap-2">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                            className="px-3 py-1 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed">
                            Prev
                        </button>
                        <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page === lastPage}
                            className="px-3 py-1 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* View Dialog */}
            <Dialog open={!!viewInv} onOpenChange={(open) => !open && setViewInv(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-mono">{viewInv?.invoice_number}</DialogTitle>
                    </DialogHeader>
                    {viewInv && (
                        <div className="space-y-4 mt-2">
                            {/* Meta */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date</span>
                                    <span className="font-medium">{viewInv.invoice_date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Customer</span>
                                    <span className="font-medium">
                                        {viewInv.customer?.name || 'Walk-in Customer'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Served By</span>
                                    <span className="font-medium">{viewInv.user?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment</span>
                                    <span className="capitalize font-medium">{viewInv.payment_method}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Paid</span>
                                    <span className="font-medium text-green-600">
                                        Rs. {Number(viewInv.paid_amount).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor(viewInv.status)}`}>
                                        {viewInv.status}
                                    </span>
                                </div>
                            </div>

                            <Separator />

                            {/* Items */}
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Items
                                </p>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-2 text-xs text-muted-foreground">#</th>
                                            <th className="text-left py-2 text-xs text-muted-foreground">Product</th>
                                            <th className="text-right py-2 text-xs text-muted-foreground">Qty</th>
                                            <th className="text-right py-2 text-xs text-muted-foreground">Price</th>
                                            <th className="text-right py-2 text-xs text-muted-foreground">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewInv.items.map((item, i) => (
                                            <tr key={i} className="border-b border-border last:border-0">
                                                <td className="py-2 text-muted-foreground">{i + 1}</td>
                                                <td className="py-2 font-medium">
                                                    {item.stock_batch?.product?.generic_name}
                                                    {item.stock_batch?.batch_number && (
                                                        <span className="text-xs text-muted-foreground ml-1">
                                                            [{item.stock_batch.batch_number}]
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-2 text-right">{item.quantity}</td>
                                                <td className="py-2 text-right">
                                                    Rs. {Number(item.unit_price).toLocaleString()}
                                                </td>
                                                <td className="py-2 text-right font-medium">
                                                    Rs. {(item.quantity * item.unit_price).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Separator />

                            {/* Totals */}
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Sub Total</span>
                                    <span>Rs. {Number(viewInv.sub_total).toLocaleString()}</span>
                                </div>
                                {Number(viewInv.discount) > 0 && (
                                    <div className="flex justify-between text-destructive">
                                        <span>Discount</span>
                                        <span>- Rs. {Number(viewInv.discount).toLocaleString()}</span>
                                    </div>
                                )}
                                {(() => {
                                    const vat = Number(viewInv.grand_total) - Number(viewInv.sub_total) + Number(viewInv.discount);
                                    return vat > 0 ? (
                                        <div className="flex justify-between text-blue-600 dark:text-blue-400">
                                            <span>VAT</span>
                                            <span>+ Rs. {vat.toLocaleString()}</span>
                                        </div>
                                    ) : null;
                                })()}
                                <div className="flex justify-between font-semibold text-base pt-1 border-t border-border">
                                    <span>Grand Total</span>
                                    <span className="text-primary">
                                        Rs. {Number(viewInv.grand_total).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Paid</span>
                                    <span className="text-green-600">Rs. {Number(viewInv.paid_amount).toLocaleString()}</span>
                                </div>
                                {(() => {
                                    const balance = Number(viewInv.grand_total) - Number(viewInv.paid_amount);
                                    return balance > 0 ? (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Balance</span>
                                            <span className="text-destructive font-medium">Rs. {balance.toLocaleString()}</span>
                                        </div>
                                    ) : null;
                                })()}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
        </div>
    );
}

export default function WrappedInvoiceHistoryPage() {
    return (
        <>
            <Head title="Invoice History" />
            <InvoiceHistoryPage />
        </>
    );
}

(WrappedInvoiceHistoryPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;
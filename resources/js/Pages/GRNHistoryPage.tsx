// import { Head } from '@inertiajs/react';
// import AppShell from '@/AppShell';
// import React, { useState } from 'react';
// import { initialGRNs, initialPayablePayments, type GRN } from '@/data/mockData';
// import SearchBar from '@/components/shared/SearchBar';
// import { DatePicker } from '@/components/ui/date-picker';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Separator } from '@/components/ui/separator';
// import { Printer, Eye, Trash2 } from 'lucide-react';

// function GRNHistoryPage() {
//   const [grns, setGrns] = useState<GRN[]>(initialGRNs);
//   const [payments] = useState(initialPayablePayments);
//   const [search, setSearch] = useState('');
//   const [dateFilter, setDateFilter] = useState('');
//   const [viewGrn, setViewGrn] = useState<GRN | null>(null);

//   const filtered = grns.filter((g) =>
//     (g.number.toLowerCase().includes(search.toLowerCase()) ||
//       g.supplierName.toLowerCase().includes(search.toLowerCase())) &&
//     (!dateFilter || g.date === dateFilter)
//   );

//   const handleDelete = (id: string) => {
//     setGrns((prev) => prev.filter((g) => g.id !== id));
//   };

//   const handlePrint = (_g: GRN) => {
//     window.print();
//   };

//   return (
//     <div className="space-y-4 animate-fade-in">
//       <div className="flex flex-col sm:flex-row gap-3">
//         <div className="w-full sm:w-72">
//           <SearchBar value={search} onChange={setSearch} placeholder="Search GRNs..." />
//         </div>
//         <DatePicker value={dateFilter} onChange={(v) => setDateFilter(v)} placeholder="Filter by date" className="w-full sm:w-44" />
//       </div>

//       <div className="bg-card rounded-xl border border-border overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-border bg-muted/50">
//                 <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">GRN #</th>
//                 <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
//                 <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Supplier</th>
//                 <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Total</th>
//                 <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((g) => (
//                 <tr key={g.id} className="border-b border-border last:border-0 hover:bg-muted/30">
//                   <td className="px-4 py-3 text-sm font-medium text-primary">{g.number}</td>
//                   <td className="px-4 py-3 text-sm">{g.date}</td>
//                   <td className="px-4 py-3 text-sm">{g.supplierName}</td>
//                   <td className="px-4 py-3 text-sm font-semibold text-right">Rs. {g.total.toLocaleString()}</td>
//                   <td className="px-4 py-3">
//                     <div className="flex items-center justify-end gap-1">
//                       <button
//                         onClick={() => setViewGrn(g)}
//                         className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
//                         title="View"
//                       >
//                         <Eye className="h-3.5 w-3.5" />
//                       </button>
//                       <button
//                         onClick={() => handlePrint(g)}
//                         className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
//                         title="Print"
//                       >
//                         <Printer className="h-3.5 w-3.5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(g.id)}
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
//                   <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No GRNs found.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* View Dialog */}
//       <Dialog open={!!viewGrn} onOpenChange={(open) => !open && setViewGrn(null)}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-base">GRN</DialogTitle>
//           </DialogHeader>

//           {viewGrn && (
//             <div className="space-y-4 mt-2">
//               {/* GRN Meta */}
//               <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">GRN No.</span>
//                   <span className="font-semibold text-primary">{viewGrn.number}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Date</span>
//                   <span className="font-medium">{viewGrn.date}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Supplier</span>
//                   <span className="font-medium">{viewGrn.supplierName}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Paid Amount</span>
//                   <span className="font-medium">Rs. {viewGrn.paidAmount.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Balance</span>
//                   <span className={`font-medium ${viewGrn.balance > 0 ? 'text-destructive' : 'text-green-600'}`}>
//                     Rs. {viewGrn.balance.toLocaleString()}
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
//                       <th className="text-left py-2 font-medium text-muted-foreground text-xs">Product</th>
//                       <th className="text-right py-2 font-medium text-muted-foreground text-xs">Qty</th>
//                       <th className="text-right py-2 font-medium text-muted-foreground text-xs">Cost Price</th>
//                       <th className="text-right py-2 font-medium text-muted-foreground text-xs">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {viewGrn.items.map((item, i) => (
//                       <tr key={i} className="border-b border-border last:border-0">
//                         <td className="py-2 text-muted-foreground">{i + 1}</td>
//                         <td className="py-2 font-medium">{item.name}</td>
//                         <td className="py-2 text-right">{item.qty}</td>
//                         <td className="py-2 text-right">Rs. {item.costPrice.toLocaleString()}</td>
//                         <td className="py-2 text-right font-medium">Rs. {(item.qty * item.costPrice).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <Separator />

//               {/* Total */}
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-semibold">Total</span>
//                 <span className="text-xl font-bold text-primary">Rs. {viewGrn.total.toLocaleString()}</span>
//               </div>

//               <Separator />

//               {/* Payable Payments */}
//               <div>
//                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Payment Records</p>
//                 {(() => {
//                   const grnPayments = payments.filter((p) => p.referenceId === viewGrn.id && p.referenceType === 'grn');
//                   const paid = grnPayments.reduce((s, p) => s + p.amount, 0);
//                   const outstanding = Math.max(0, viewGrn.total - paid);
//                   return grnPayments.length === 0 ? (
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
//                           {grnPayments.map((p) => (
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


// export default function WrappedGRNHistoryPage() {
//   return (
//     <>
//       <Head title="GRN History" />
//       <GRNHistoryPage />
//     </>
//   );
// }

// (WrappedGRNHistoryPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

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

interface GrnItem {
    id:           number;
    product:      { generic_name: string };
    quantity:     number;
    unit_price:   number;
    batch_number: string | null;
    expiry_date:  string | null;
}

interface GrnPayable {
    id:       number;
    amount:   number;
    dateTime: string;
    note:     string;
}

interface Grn {
    id:                  number;
    grn_number:          string;
    received_date:       string;
    supplier:            { name: string };
    user:                { name: string };
    sub_total:           number;
    discount:            number;
    vat_amount:          number;
    total_amount:        number;
    paid_amount:         number;
    payment_method:      string;
    payment_status:      string;
    supplier_invoice_no: string | null;
    items:               GrnItem[];
}

function GRNHistoryPage() {
    const [grns,       setGrns]       = useState<Grn[]>([]);
    const [search,     setSearch]     = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [viewGrn,    setViewGrn]    = useState<Grn | null>(null);
    const [grnPayables, setGrnPayables] = useState<GrnPayable[]>([]);
    const [deleteId,   setDeleteId]   = useState<number | null>(null);
    const [page,       setPage]       = useState(1);
    const [lastPage,   setLastPage]   = useState(1);
    const [total,      setTotal]      = useState(0);
    const [loading,    setLoading]    = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchGrns = async (pg: number, s: string, d: string) => {
        setLoading(true);
        try {
            const res = await axios.get('/grn/all', {
                params: { page: pg, search: s || undefined, date: d || undefined },
            });
            setGrns(res.data.data);
            setLastPage(res.data.last_page);
            setTotal(res.data.total);
        } catch (e) { console.log(e); }
        finally { setLoading(false); }
    };

    // Fetch when page changes
    useEffect(() => { fetchGrns(page, search, dateFilter); }, [page]);

    // Debounce search/date changes and reset to page 1
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setPage(1);
            fetchGrns(1, search, dateFilter);
        }, 350);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [search, dateFilter]);

    const openView = async (g: Grn) => {
        setViewGrn(g);
        setGrnPayables([]);
        try {
            const res = await axios.get(`/grn/show/${g.id}`);
            setGrnPayables(res.data.grn?.payables ?? []);
        } catch (e) { console.log(e); }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/grn/delete/${deleteId}`);
            setGrns((prev) => prev.filter((g) => g.id !== deleteId));
            setDeleteId(null);
            setTotal((t) => t - 1);
            toast.success('GRN deleted.');
        } catch (e) {
            toast.error('Failed to delete GRN.');
        }
    };

    const filtered = grns;

    const statusColor = (status: string) => {
        if (status === 'paid')    return 'bg-green-500/10 text-green-600';
        if (status === 'partial') return 'bg-yellow-500/10 text-yellow-600';
        return 'bg-destructive/10 text-destructive';
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-72">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search GRNs..." />
                </div>
                <DatePicker value={dateFilter} onChange={setDateFilter}
                    placeholder="Filter by date" className="w-full sm:w-44" />
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">GRN #</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Supplier</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Received By</th>
                                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Total</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((g) => (
                                <tr key={g.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                    <td className="px-4 py-3 text-sm font-medium text-primary font-mono">{g.grn_number}</td>
                                    <td className="px-4 py-3 text-sm">{g.received_date?.substring(0, 10)}</td>
                                    <td className="px-4 py-3 text-sm">{g.supplier?.name}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{g.user?.name}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-right">
                                        Rs. {Number(g.total_amount).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor(g.payment_status)}`}>
                                            {g.payment_status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openView(g)}
                                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                                                <Eye className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => window.open('/grn/print/' + g.id, '_blank')}
                                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                                                <Printer className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => setDeleteId(g.id)}
                                                className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                        {loading ? 'Loading...' : 'No GRNs found.'}
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
            <Dialog open={!!viewGrn} onOpenChange={(open) => !open && setViewGrn(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-base font-mono">{viewGrn?.grn_number}</DialogTitle>
                    </DialogHeader>
                    {viewGrn && (
                        <div className="space-y-4 mt-2">
                            {/* Meta */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date</span>
                                    <span className="font-medium">{viewGrn.received_date?.substring(0, 10)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Supplier</span>
                                    <span className="font-medium">{viewGrn.supplier?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Received By</span>
                                    <span className="font-medium">{viewGrn.user?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment</span>
                                    <span className="font-medium capitalize">{viewGrn.payment_method}</span>
                                </div>
                                {viewGrn.supplier_invoice_no && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Invoice No.</span>
                                        <span className="font-medium">{viewGrn.supplier_invoice_no}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor(viewGrn.payment_status)}`}>
                                        {viewGrn.payment_status}
                                    </span>
                                </div>
                            </div>

                            <Separator />

                            {/* Items */}
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items</p>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-2 text-xs text-muted-foreground">#</th>
                                            <th className="text-left py-2 text-xs text-muted-foreground">Item</th>
                                            <th className="text-right py-2 text-xs text-muted-foreground">Qty</th>
                                            <th className="text-right py-2 text-xs text-muted-foreground">Cost</th>
                                            <th className="text-right py-2 text-xs text-muted-foreground">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewGrn.items.map((item, i) => (
                                            <tr key={i} className="border-b border-border last:border-0">
                                                <td className="py-2 text-muted-foreground">{i + 1}</td>
                                                <td className="py-2 font-medium">{item.product?.generic_name}</td>
                                                <td className="py-2 text-right">{item.quantity}</td>
                                                <td className="py-2 text-right">Rs. {Number(item.unit_price).toLocaleString()}</td>
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
                                    <span>Rs. {Number(viewGrn.sub_total).toLocaleString()}</span>
                                </div>
                                {Number(viewGrn.discount) > 0 && (
                                    <div className="flex justify-between text-destructive">
                                        <span>Discount</span>
                                        <span>- Rs. {Number(viewGrn.discount).toLocaleString()}</span>
                                    </div>
                                )}
                                {Number(viewGrn.vat_amount) > 0 && (
                                    <div className="flex justify-between text-blue-600 dark:text-blue-400">
                                        <span>VAT</span>
                                        <span>+ Rs. {Number(viewGrn.vat_amount).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-semibold text-base pt-1 border-t border-border">
                                    <span>Total</span>
                                    <span className="text-primary">Rs. {Number(viewGrn.total_amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Paid</span>
                                    <span className="text-green-600">Rs. {(grnPayables.length > 0 ? grnPayables.reduce((s, p) => s + Number(p.amount), 0) : Number(viewGrn.paid_amount)).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Balance</span>
                                    {(() => {
                                        const paidTotal = grnPayables.length > 0 ? grnPayables.reduce((s, p) => s + Number(p.amount), 0) : Number(viewGrn.paid_amount);
                                        const balance = Number(viewGrn.total_amount) - paidTotal;
                                        return (
                                            <span className={balance > 0 ? 'text-destructive font-medium' : 'text-green-600 font-medium'}>
                                                Rs. {Math.abs(balance).toLocaleString()}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
        </div>
    );
}

export default function WrappedGRNHistoryPage() {
    return (
        <>
            <Head title="GRN History" />
            <GRNHistoryPage />
        </>
    );
}

(WrappedGRNHistoryPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;
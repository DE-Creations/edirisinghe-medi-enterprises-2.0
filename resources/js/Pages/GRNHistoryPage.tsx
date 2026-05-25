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
import React, { useEffect, useState } from 'react';
import SearchBar from '@/components/shared/SearchBar';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Printer, Eye, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import axios from 'axios';

interface GrnItem {
    id: number;
    product: { generic_name: string };
    quantity: number;
    unit_price: number;
    selling_price: number;
    batch_number: string | null;
    expiry_date: string | null;
}

interface Grn {
    id: number;
    grn_number: string;
    received_date: string;
    supplier: { name: string };
    user: { name: string } | null;
    sub_total: number;
    discount: number;
    total_amount: number;
    initial_paid: number;
    total_paid: number;
    outstanding: number;
    payment_method: string;
    payment_status: string;  // now dynamic
    supplier_invoice_no: string | null;
    items: GrnItem[];
    payment_records: PaymentRecord[]; // new
}

interface PaymentRecord {
    id: number;
    date: string;
    amount: number;
    notes: string | null;
    by: string | null;
}

function GRNHistoryPage() {
    const [grns, setGrns] = useState<Grn[]>([]);
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [viewGrn, setViewGrn] = useState<Grn | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => { fetchGrns(); }, []);

    const fetchGrns = async () => {
        try {
            const res = await axios.get('/grn/all');
            setGrns(res.data);
        } catch (e) { console.log(e); }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/grn/delete/${deleteId}`);
            setGrns((prev) => prev.filter((g) => g.id !== deleteId));
            setDeleteId(null);
            toast.success('GRN deleted.');
        } catch (e) {
            toast.error('Failed to delete GRN.');
        }
    };

    const filtered = grns.filter((g) =>
        (g.grn_number.toLowerCase().includes(search.toLowerCase()) ||
            g.supplier?.name.toLowerCase().includes(search.toLowerCase())) &&
        (!dateFilter || g.received_date.startsWith(dateFilter))
    );

    const statusColor = (status: string) => {
        if (status === 'paid') return 'bg-green-500/10 text-green-600';
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
                                    <td className="px-4 py-3 text-sm">{g.received_date?.split('T')[0]}</td>
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
                                            <button onClick={() => setViewGrn(g)}
                                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                                                <Eye className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => window.print()}
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
                                        No GRNs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
                                    <span className="font-medium">{viewGrn.received_date?.split('T')[0]}</span>
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
                                    {/* ✅ Dynamic status */}
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
                    ${viewGrn.payment_status === 'paid'
                                            ? 'bg-green-500/10 text-green-600'
                                            : viewGrn.payment_status === 'partial'
                                                ? 'bg-yellow-500/10 text-yellow-600'
                                                : 'bg-destructive/10 text-destructive'}`}>
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
                                            <th className="text-left py-2 text-xs text-muted-foreground">Product</th>
                                            <th className="text-right py-2 text-xs text-muted-foreground">Qty</th>
                                            <th className="text-right py-2 text-xs text-muted-foreground">Cost</th>
                                            <th className="text-right py-2 text-xs text-muted-foreground">Sell</th>
                                            <th className="text-right py-2 text-xs text-muted-foreground">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewGrn.items.map((item, i) => (
                                            <tr key={i} className="border-b border-border last:border-0">
                                                <td className="py-2 text-muted-foreground">{i + 1}</td>
                                                <td className="py-2 font-medium">
                                                    {item.product?.generic_name}
                                                    {item.batch_number && (
                                                        <span className="text-xs text-muted-foreground ml-1 font-mono">
                                                            [{item.batch_number}]
                                                        </span>
                                                    )}
                                                    {item.expiry_date && (
                                                        <span className="text-xs text-muted-foreground ml-1">
                                                            exp: {item.expiry_date}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-2 text-right">{item.quantity}</td>
                                                <td className="py-2 text-right">Rs. {Number(item.unit_price).toLocaleString()}</td>
                                                <td className="py-2 text-right">Rs. {Number(item.selling_price).toLocaleString()}</td>
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
                                <div className="flex justify-between font-semibold text-base pt-1 border-t">
                                    <span>Total</span>
                                    <span className="text-primary">Rs. {Number(viewGrn.total_amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Total Paid</span>
                                    <span>Rs. {Number(viewGrn.total_paid).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>Balance</span>
                                    <span className={Number(viewGrn.outstanding) > 0 ? 'text-destructive' : 'text-green-600'}>
                                        Rs. {Number(viewGrn.outstanding).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* ✅ Payment Records Section */}
                            {viewGrn.payment_records && viewGrn.payment_records.length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                            Payment Records
                                        </p>
                                        <div className="space-y-1.5">
                                            {/* Initial payment at GRN creation */}
                                            {Number(viewGrn.initial_paid) > 0 && (
                                                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 text-sm">
                                                    <div>
                                                        <span className="font-medium">Initial Payment</span>
                                                        <span className="text-xs text-muted-foreground ml-2">
                                                            (at GRN creation)
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold text-green-600">
                                                        Rs. {Number(viewGrn.initial_paid).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                            {/* Subsequent payments */}
                                            {viewGrn.payment_records.map((p) => (
                                                <div key={p.id}
                                                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 text-sm">
                                                    <div>
                                                        <span className="font-medium">{p.date}</span>
                                                        {p.by && (
                                                            <span className="text-xs text-muted-foreground ml-2">by {p.by}</span>
                                                        )}
                                                        {p.notes && (
                                                            <span className="text-xs text-muted-foreground ml-2">· {p.notes}</span>
                                                        )}
                                                    </div>
                                                    <span className="font-semibold text-green-600">
                                                        Rs. {Number(p.amount).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
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
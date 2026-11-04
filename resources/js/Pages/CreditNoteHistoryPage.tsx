import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import SearchBar from '@/components/shared/SearchBar';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Printer, Eye, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import axios from 'axios';
import TablePagination from '@/components/shared/TablePagination';
import { usePaginatedList } from '@/hooks/usePaginatedList';

interface CreditNoteItem {
    id:           number;
    quantity:     number;
    unit_price:   number;
    reason:       'shortage' | 'damage';
    stock_action: 'restock' | 'reduce';
    stock_batch: {
        product: { generic_name: string };
        batch_number: string | null;
    };
}

interface CreditNote {
    id:                  number;
    credit_note_number:  string;
    credit_note_date:    string;
    sub_total:           number;
    notes:               string | null;
    customer:            { id: number; name: string } | null;
    invoice:             { id: number; invoice_number: string } | null;
    user:                { name: string } | null;
    items:               CreditNoteItem[];
}

function CreditNoteHistoryPage() {
    const [search,      setSearch]      = useState('');
    const [dateFilter,  setDateFilter]  = useState('');
    const [viewCn,      setViewCn]      = useState<CreditNote | null>(null);
    const [deleteId,    setDeleteId]    = useState<number | null>(null);
    const { rows: creditNotes, page, setPage, lastPage, total, loading, refetch } =
        usePaginatedList<CreditNote>('/credit-note/all', { search, date: dateFilter });

    const handleDelete = async () => {
        try {
            await axios.delete(`/credit-note/delete/${deleteId}`);
            setDeleteId(null);
            refetch();
            toast.success('Credit note deleted.');
        } catch (e) {
            toast.error('Failed to delete credit note.');
        }
    };

    const reasonColor = (reason: string) => reason === 'damage' ? 'bg-destructive/10 text-destructive' : 'bg-yellow-500/10 text-yellow-600';

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-72">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search credit notes..." />
                </div>
                <DatePicker value={dateFilter} onChange={setDateFilter}
                    placeholder="Filter by date" className="w-full sm:w-44" />
            </div>

            <p className="text-xs text-muted-foreground">
                {search.trim() || dateFilter
                    ? 'Showing matching records from all dates.'
                    : 'Showing the last 3 months — search or pick a date to see older records.'}
            </p>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">CN #</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Invoice #</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Customer</th>
                                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Amount</th>
                                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creditNotes.map((cn) => (
                                <tr key={cn.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                    <td className="px-4 py-3 text-sm font-medium text-primary font-mono">
                                        {cn.credit_note_number}
                                    </td>
                                    <td className="px-4 py-3 text-sm">{cn.credit_note_date}</td>
                                    <td className="px-4 py-3 text-sm font-mono">{cn.invoice?.invoice_number}</td>
                                    <td className="px-4 py-3 text-sm">{cn.customer?.name || 'Walk-in Customer'}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-right">
                                        Rs. {Number(cn.sub_total).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => setViewCn(cn)}
                                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                                                <Eye className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => window.open('/credit-note/print/' + cn.id, '_blank')}
                                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                                                <Printer className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => setDeleteId(cn.id)}
                                                className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {creditNotes.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                        {loading ? 'Loading...' : 'No credit notes found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TablePagination page={page} lastPage={lastPage} total={total} onPageChange={setPage} />

            {/* View Dialog */}
            <Dialog open={!!viewCn} onOpenChange={(open) => !open && setViewCn(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-mono">{viewCn?.credit_note_number}</DialogTitle>
                    </DialogHeader>
                    {viewCn && (
                        <div className="space-y-4 mt-2">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date</span>
                                    <span className="font-medium">{viewCn.credit_note_date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Reference Invoice</span>
                                    <span className="font-medium font-mono">{viewCn.invoice?.invoice_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Customer</span>
                                    <span className="font-medium">{viewCn.customer?.name || 'Walk-in Customer'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Issued By</span>
                                    <span className="font-medium">{viewCn.user?.name}</span>
                                </div>
                            </div>

                            <Separator />

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
                                            <th className="text-left py-2 text-xs text-muted-foreground pl-3">Reason</th>
                                            <th className="text-left py-2 text-xs text-muted-foreground">Stock Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewCn.items.map((item, i) => (
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
                                                <td className="py-2 text-right">Rs. {Number(item.unit_price).toLocaleString()}</td>
                                                <td className="py-2 text-right font-medium">
                                                    Rs. {(item.quantity * item.unit_price).toLocaleString()}
                                                </td>
                                                <td className="py-2 pl-3">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${reasonColor(item.reason)}`}>
                                                        {item.reason}
                                                    </span>
                                                </td>
                                                <td className="py-2 capitalize text-xs">
                                                    {item.stock_action === 'restock' ? 'Restocked' : 'Written off'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Separator />

                            <div className="flex justify-between font-semibold text-base">
                                <span>Credit Total</span>
                                <span className="text-primary">Rs. {Number(viewCn.sub_total).toLocaleString()}</span>
                            </div>

                            {viewCn.notes && (
                                <p className="text-sm text-muted-foreground border-t border-border pt-2">
                                    <span className="font-medium">Notes: </span>{viewCn.notes}
                                </p>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
        </div>
    );
}

export default function WrappedCreditNoteHistoryPage() {
    return (
        <>
            <Head title="Credit Note History" />
            <CreditNoteHistoryPage />
        </>
    );
}

(WrappedCreditNoteHistoryPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

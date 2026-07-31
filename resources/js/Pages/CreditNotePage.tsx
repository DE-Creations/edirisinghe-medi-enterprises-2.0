import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { RotateCcw, Search, Printer, Save, Undo2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import axios from 'axios';

interface InvoiceSearchResult {
    id: number;
    invoice_number: string;
    invoice_date: string;
    grand_total: number;
    customer: { id: number; name: string } | null;
}

interface CreditableItem {
    id: number;
    stock_batch_id: number;
    batch_number: string | null;
    product_name: string;
    quantity: number;
    unit_price: number;
    credited_qty: number;
    remaining_qty: number;
}

interface InvoiceDetail {
    id: number;
    invoice_number: string;
    invoice_date: string;
    customer: { id: number; name: string; contact_no: string; address: string } | null;
    items: CreditableItem[];
}

type Reason = 'shortage' | 'damage';
type StockAction = 'restock' | 'reduce';

interface LineState {
    included: boolean;
    quantity: string;
    reason: Reason;
    stock_action: StockAction;
}

function CreditNotePage() {
    const [creditNoteNum, setCreditNoteNum] = useState('CN-0001');
    const [creditNoteDate, setCreditNoteDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [notes, setNotes] = useState('');

    const [search, setSearch] = useState('');
    const [results, setResults] = useState<InvoiceSearchResult[]>([]);
    const [searching, setSearching] = useState(false);

    const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
    const [loadingInvoice, setLoadingInvoice] = useState(false);
    const [lines, setLines] = useState<Record<number, LineState>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchNextNumber(); }, []);

    const fetchNextNumber = async () => {
        try {
            const res = await axios.get('/credit-note/next-number');
            setCreditNoteNum(res.data.credit_note_number);
        } catch (e) { console.log(e); }
    };

    useEffect(() => {
        const t = setTimeout(async () => {
            if (!search.trim()) { setResults([]); return; }
            setSearching(true);
            try {
                const res = await axios.get('/credit-note/invoice-search', { params: { search } });
                setResults(res.data);
            } catch (e) { console.log(e); }
            finally { setSearching(false); }
        }, 350);
        return () => clearTimeout(t);
    }, [search]);

    const selectInvoice = async (id: number) => {
        setLoadingInvoice(true);
        setResults([]);
        setSearch('');
        try {
            const res = await axios.get<InvoiceDetail>(`/credit-note/invoice/${id}`);
            setInvoice(res.data);
            const initial: Record<number, LineState> = {};
            res.data.items.forEach((item) => {
                initial[item.id] = { included: false, quantity: '', reason: 'shortage', stock_action: 'restock' };
            });
            setLines(initial);
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Failed to load invoice.');
        } finally {
            setLoadingInvoice(false);
        }
    };

    const updateLine = (itemId: number, patch: Partial<LineState>) => {
        setLines((prev) => ({ ...prev, [itemId]: { ...prev[itemId], ...patch } }));
    };

    const includedItems = invoice?.items.filter((i) => lines[i.id]?.included) ?? [];
    const subTotal = includedItems.reduce((sum, item) => {
        const qty = Number(lines[item.id]?.quantity || 0);
        return sum + qty * item.unit_price;
    }, 0);

    const resetForm = () => {
        setInvoice(null);
        setLines({});
        setNotes('');
        setCreditNoteDate(format(new Date(), 'yyyy-MM-dd'));
    };

    const handleSave = async (printAfterSave = false) => {
        if (!invoice) { toast.error('Please select an invoice to credit.'); return; }
        if (includedItems.length === 0) { toast.error('Please select at least one item to credit.'); return; }

        for (const item of includedItems) {
            const line = lines[item.id];
            const qty = Number(line.quantity);
            if (!qty || qty <= 0) {
                toast.error(`Enter a valid quantity for ${item.product_name}.`);
                return;
            }
            if (qty > item.remaining_qty) {
                toast.error(`Quantity for ${item.product_name} exceeds remaining creditable amount (${item.remaining_qty}).`);
                return;
            }
        }

        setSaving(true);
        const toastId = toast.loading(printAfterSave ? 'Saving & preparing print...' : 'Saving credit note...');

        try {
            const res = await axios.post('/credit-note/store', {
                invoice_id: invoice.id,
                credit_note_date: creditNoteDate,
                notes: notes || null,
                items: includedItems.map((item) => {
                    const line = lines[item.id];
                    return {
                        invoice_item_id: item.id,
                        quantity: Number(line.quantity),
                        reason: line.reason,
                        stock_action: line.reason === 'damage' ? line.stock_action : undefined,
                    };
                }),
            });

            toast.success('Credit note saved successfully!', { id: toastId });

            if (printAfterSave && res.data.id) {
                window.open(`/credit-note/print/${res.data.id}`, '_blank');
            }

            resetForm();
            await fetchNextNumber();
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to save credit note.';
            toast.error(msg, { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <RotateCcw className="h-5 w-5 text-primary" /> Credit Note
                </h1>
                <span className="text-sm font-mono font-semibold px-3 py-1 rounded-lg bg-primary/10 text-primary">
                    {creditNoteNum}
                </span>
            </div>

            {/* Step 1: Find the invoice to credit */}
            <Card>
                <CardHeader><CardTitle className="text-base">Step 1 — Find Invoice</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    {invoice ? (
                        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                            <div>
                                <p className="font-semibold font-mono">{invoice.invoice_number}</p>
                                <p className="text-sm text-muted-foreground">
                                    {invoice.customer?.name || 'Walk-in Customer'} &nbsp;|&nbsp; {invoice.invoice_date}
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={resetForm}>Change Invoice</Button>
                        </div>
                    ) : (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by invoice number or customer name..."
                                className="pl-9"
                            />
                            {searching && <p className="text-xs text-muted-foreground mt-1">Searching...</p>}
                            {results.length > 0 && (
                                <div className="mt-2 border border-border rounded-lg divide-y divide-border max-h-64 overflow-y-auto">
                                    {results.map((inv) => (
                                        <button
                                            key={inv.id}
                                            onClick={() => selectInvoice(inv.id)}
                                            className="w-full text-left px-3 py-2 hover:bg-muted/50 flex items-center justify-between"
                                        >
                                            <span>
                                                <span className="font-mono font-medium">{inv.invoice_number}</span>
                                                <span className="text-muted-foreground ml-2 text-sm">
                                                    {inv.customer?.name || 'Walk-in Customer'} &middot; {inv.invoice_date}
                                                </span>
                                            </span>
                                            <span className="text-sm font-semibold">Rs. {Number(inv.grand_total).toLocaleString()}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {loadingInvoice && <p className="text-center text-sm text-muted-foreground">Loading invoice...</p>}

            {invoice && !loadingInvoice && (
                <>
                    {/* Step 2: Select items and reasons */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Step 2 — Select Items to Credit</CardTitle></CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="p-2 w-10"></th>
                                            <th className="p-2 text-left">Product</th>
                                            <th className="p-2 text-right">Sold Qty</th>
                                            <th className="p-2 text-right">Remaining</th>
                                            <th className="p-2 text-right w-28">Credit Qty</th>
                                            <th className="p-2 text-left w-36">Reason</th>
                                            <th className="p-2 text-left w-40">Stock Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item) => {
                                            const line = lines[item.id];
                                            const disabled = item.remaining_qty <= 0;
                                            return (
                                                <tr key={item.id} className="border-b hover:bg-muted/30">
                                                    <td className="p-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={line?.included ?? false}
                                                            disabled={disabled}
                                                            onChange={(e) => updateLine(item.id, { included: e.target.checked })}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <p className="font-medium">{item.product_name}</p>
                                                        {item.batch_number && (
                                                            <p className="text-xs text-muted-foreground font-mono">{item.batch_number}</p>
                                                        )}
                                                    </td>
                                                    <td className="p-2 text-right">{item.quantity}</td>
                                                    <td className="p-2 text-right">
                                                        {disabled ? (
                                                            <span className="text-xs text-muted-foreground">Fully credited</span>
                                                        ) : item.remaining_qty}
                                                    </td>
                                                    <td className="p-2 text-right">
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            max={item.remaining_qty}
                                                            value={line?.quantity ?? ''}
                                                            disabled={!line?.included}
                                                            onChange={(e) => updateLine(item.id, { quantity: e.target.value })}
                                                            className="w-20 h-8 text-right text-sm border border-input rounded px-2 bg-background disabled:opacity-40
                                                                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <Select
                                                            value={line?.reason ?? 'shortage'}
                                                            onValueChange={(val) => updateLine(item.id, { reason: val as Reason })}
                                                            disabled={!line?.included}
                                                        >
                                                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="shortage">Shortage</SelectItem>
                                                                <SelectItem value="damage">Damage</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="p-2">
                                                        {line?.reason === 'damage' ? (
                                                            <Select
                                                                value={line?.stock_action ?? 'restock'}
                                                                onValueChange={(val) => updateLine(item.id, { stock_action: val as StockAction })}
                                                                disabled={!line?.included}
                                                            >
                                                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="restock">Restock</SelectItem>
                                                                    <SelectItem value="reduce">Reduce (write-off)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">Restock (auto)</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Step 3: Details & totals */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Step 3 — Details &amp; Save</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Credit Note Date</label>
                                    <DatePicker value={creditNoteDate} onChange={setCreditNoteDate} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Notes (optional)</label>
                                    <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Lorry return — items short at unloading" />
                                </div>
                            </div>

                            <div className="bg-primary/10 rounded-lg px-4 py-2.5 flex items-center justify-between">
                                <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Credit Total</span>
                                <span className="text-2xl font-bold text-primary">Rs. {subTotal.toLocaleString()}</span>
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={() => handleSave(false)} disabled={saving} className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                    <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
                                </Button>
                                <Button onClick={() => handleSave(true)} disabled={saving} className="flex-1 gap-2">
                                    <Printer className="h-4 w-4" /> Save &amp; Print
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {!invoice && !loadingInvoice && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Undo2 className="h-10 w-10 mb-2 opacity-30" />
                    <p className="text-sm">Search and select an invoice above to begin a credit note.</p>
                </div>
            )}
        </div>
    );
}

export default function WrappedCreditNotePage() {
    return (
        <>
            <Head title="Credit Note" />
            <CreditNotePage />
        </>
    );
}

(WrappedCreditNotePage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

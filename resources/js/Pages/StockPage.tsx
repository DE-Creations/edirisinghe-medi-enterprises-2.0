import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import {
  initialProducts,
  initialStockEntries,
  initialStockAdjustments,
  nextStockNumber,
  nextAdjNumber,
  type Product,
  type StockEntry,
  type StockAdjustment,
} from '@/data/mockData';
import SearchBar from '@/components/shared/SearchBar';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { FloatingInput } from '@/components/ui/floating-input';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/date-picker';
import { Edit, Trash2, AlertTriangle, ArrowUpDown, Plus } from 'lucide-react';

const spinnerOff =
  '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

const adjTypeOptions = [
  { value: 'sample', label: 'Free Sample' },
  { value: 'gift', label: 'Gift' },
  { value: 'damage', label: 'Damaged' },
  { value: 'expiry', label: 'Expired' },
  { value: 'correction', label: 'Stock Correction' },
  { value: 'other', label: 'Other' },
];

function StockPage() {
  const [products] = useState<Product[]>(initialProducts);
  const [entries, setEntries] = useState<StockEntry[]>(initialStockEntries);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(initialStockAdjustments);
  const [search, setSearch] = useState('');

  // ── Add / Edit stock entry ──────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState<StockEntry | null>(null);
  const [form, setForm] = useState<Partial<StockEntry>>({});

  // ── Adjustment dialog ───────────────────────────────────────────────────────
  const [adjEntry, setAdjEntry] = useState<StockEntry | null>(null);
  const [adjForm, setAdjForm] = useState<{
    date: string;
    type: StockAdjustment['type'] | '';
    qty: string;
    notes: string;
  }>({ date: new Date().toISOString().split('T')[0], type: '', qty: '', notes: '' });

  // ── Delete ──────────────────────────────────────────────────────────────────
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  const productOptions = products.map((p) => ({ value: p.id, label: p.name }));

  const filtered = entries.filter((e) => {
    const p = productMap[e.productId];
    const q = search.toLowerCase();
    return (
      e.stockNumber.toLowerCase().includes(q) ||
      (p?.name.toLowerCase().includes(q) ?? false) ||
      (p?.brand.toLowerCase().includes(q) ?? false) ||
      (p?.category.toLowerCase().includes(q) ?? false)
    );
  });

  // ── Entry handlers ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm({
      stockNumber: nextStockNumber(),
      receivedDate: new Date().toISOString().split('T')[0],
      grnNumber: '',
      costPrice: 0,
      sellingPrice: 0,
      qty: 0,
      mfgDate: '',
      expDate: '',
      notes: '',
    });
    setEditEntry(null);
    setShowForm(true);
  };

  const openEdit = (e: StockEntry) => {
    setForm({ ...e });
    setEditEntry(e);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditEntry(null);
    setForm({});
  };

  const handleSave = () => {
    if (!form.stockNumber || !form.productId) return;
    if (editEntry) {
      setEntries((prev) =>
        prev.map((e) => (e.id === editEntry.id ? ({ ...e, ...form } as StockEntry) : e)),
      );
    } else {
      setEntries((prev) => [
        ...prev,
        { id: String(Date.now()), mfgDate: '', expDate: '', grnNumber: '', notes: '', ...form } as StockEntry,
      ]);
    }
    closeForm();
  };

  // ── Adjustment handlers ─────────────────────────────────────────────────────
  const openAdj = (e: StockEntry) => {
    setAdjEntry(e);
    setAdjForm({ date: new Date().toISOString().split('T')[0], type: '', qty: '', notes: '' });
  };

  const handleSaveAdj = () => {
    if (!adjEntry || !adjForm.type || !adjForm.qty) return;
    const isCorrection = adjForm.type === 'correction';
    const appliedQty = isCorrection ? Number(adjForm.qty) : -Math.abs(Number(adjForm.qty));
    const product = productMap[adjEntry.productId];

    setEntries((prev) =>
      prev.map((e) =>
        e.id === adjEntry.id ? { ...e, qty: Math.max(0, e.qty + appliedQty) } : e,
      ),
    );

    setAdjustments((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        number: nextAdjNumber(),
        date: adjForm.date,
        stockEntryId: adjEntry.id,
        stockNumber: adjEntry.stockNumber,
        productName: product?.name ?? '',
        qty: appliedQty,
        type: adjForm.type as StockAdjustment['type'],
        notes: adjForm.notes,
      },
    ]);
    setAdjEntry(null);
  };

  const adjHistory = adjEntry
    ? adjustments.filter((a) => a.stockEntryId === adjEntry.id)
    : [];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search stock..." />
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Stock
        </Button>
      </div>

      {/* ── Stock table ── */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Stock #</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Product</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Stock</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Cost Price (Rs.)</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Selling Price (Rs.)</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const p = productMap[e.productId];
                const low = p ? e.qty <= p.reorderLevel : false;
                return (
                  <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-mono font-medium">{e.stockNumber}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{p?.name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">{p?.brand}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-sm font-bold">{e.qty}</span>
                        {low && (
                          <span className="inline-flex items-center gap-0.5 text-xs text-destructive">
                            <AlertTriangle className="h-3 w-3" /> Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">{e.costPrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-right">{e.sellingPrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(e)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => openAdj(e)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Stock adjustment"
                        >
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(e.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No stock entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Stock Entry Dialog ── */}
      <Dialog open={showForm} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editEntry ? 'Edit Stock Entry' : 'Add Stock Entry'}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground invisible">_</p>
              <FloatingInput
                label="Stock Number"
                value={form.stockNumber || ''}
                onChange={(e) => setForm({ ...form, stockNumber: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground">Product</p>
              <Combobox
                options={productOptions}
                value={form.productId || ''}
                onValueChange={(v) => setForm({ ...form, productId: v })}
                placeholder="Select product..."
                searchPlaceholder="Search products..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground invisible">_</p>
              <FloatingInput
                label="GRN Reference (optional)"
                value={form.grnNumber || ''}
                onChange={(e) => setForm({ ...form, grnNumber: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground">Received Date</p>
              <DatePicker
                value={form.receivedDate || ''}
                onChange={(v) => setForm({ ...form, receivedDate: v })}
                placeholder="Received date"
                className="w-full h-10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground invisible">_</p>
              <FloatingInput
                label="Quantity"
                type="number"
                value={String(form.qty ?? '')}
                onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
                className={`${spinnerOff}${editEntry ? ' bg-muted/30 cursor-not-allowed' : ''}`}
                readOnly={!!editEntry}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground invisible">_</p>
              <FloatingInput
                label="Cost Price (Rs.)"
                type="number"
                value={String(form.costPrice ?? '')}
                onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })}
                className={spinnerOff}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground invisible">_</p>
              <FloatingInput
                label="Selling Price (Rs.)"
                type="number"
                value={String(form.sellingPrice ?? '')}
                onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })}
                className={spinnerOff}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground">Mfg Date (optional)</p>
              <DatePicker
                value={form.mfgDate || ''}
                onChange={(v) => setForm({ ...form, mfgDate: v })}
                placeholder="Mfg date"
                className="w-full h-10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground">Exp Date (optional)</p>
              <DatePicker
                value={form.expDate || ''}
                onChange={(v) => setForm({ ...form, expDate: v })}
                placeholder="Exp date"
                className="w-full h-10"
              />
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Notes (optional)</p>
              <Textarea
                value={form.notes || ''}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. received with GRN-0002, special pricing..."
                rows={2}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
            <Button onClick={handleSave}>{editEntry ? 'Update' : 'Add'} Stock Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Stock Adjustment Dialog ── */}
      <Dialog open={!!adjEntry} onOpenChange={(open) => !open && setAdjEntry(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Stock Adjustment</DialogTitle>
            {adjEntry && (
              <div className="mt-1">
                <p className="text-sm font-medium">{productMap[adjEntry.productId]?.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{adjEntry.stockNumber}</p>
              </div>
            )}
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium text-muted-foreground">Date</p>
                <DatePicker
                  value={adjForm.date}
                  onChange={(v) => setAdjForm({ ...adjForm, date: v })}
                  placeholder="Select date"
                  className="w-full h-10"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium text-muted-foreground">Adjustment Type</p>
                <Combobox
                  options={adjTypeOptions}
                  value={adjForm.type}
                  onValueChange={(v) => setAdjForm({ ...adjForm, type: v as StockAdjustment['type'] })}
                  placeholder="Select type..."
                />
              </div>
            </div>

            <FloatingInput
              label={adjForm.type === 'correction' ? 'Qty (positive = add, negative = remove)' : 'Quantity to deduct'}
              type="number"
              value={adjForm.qty}
              onChange={(e) => setAdjForm({ ...adjForm, qty: e.target.value })}
              className={spinnerOff}
            />

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Notes</p>
              <Textarea
                value={adjForm.notes}
                onChange={(e) => setAdjForm({ ...adjForm, notes: e.target.value })}
                placeholder="Reason (e.g. free sample given to Dr. Silva)..."
                rows={2}
                className="resize-none"
              />
            </div>

            {adjHistory.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Adjustment History
                  </p>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {adjHistory.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-muted-foreground shrink-0">{a.number}</span>
                          <span className="text-muted-foreground shrink-0">{a.date}</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground capitalize shrink-0">
                            {a.type}
                          </span>
                          {a.notes && (
                            <span className="text-muted-foreground truncate">{a.notes}</span>
                          )}
                        </div>
                        <span
                          className={`ml-2 shrink-0 font-semibold ${a.qty < 0 ? 'text-destructive' : 'text-success'}`}
                        >
                          {a.qty > 0 ? '+' : ''}{a.qty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjEntry(null)}>Cancel</Button>
            <Button onClick={handleSaveAdj}>Save Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          setEntries((prev) => prev.filter((e) => e.id !== deleteId));
          setDeleteId(null);
        }}
      />
    </div>
  );
}

export default function WrappedStockPage() {
  return (
    <>
      <Head title="Stock" />
      <StockPage />
    </>
  );
}

(WrappedStockPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

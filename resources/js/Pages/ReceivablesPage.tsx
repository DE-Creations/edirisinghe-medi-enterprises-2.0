import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import {
  initialInvoices,
  initialReceivablePayments,
  type Invoice,
  type ReceivablePayment,
} from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import SearchBar from '@/components/shared/SearchBar';
import Modal from '@/components/shared/Modal';
import { format } from 'date-fns';
import { Plus, CreditCard, CheckCircle2, Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

// Compute outstanding balance per invoice after applying all payment records
function computeOutstanding(invoice: Invoice, payments: ReceivablePayment[]): number {
  const paid = payments
    .filter((p) => p.invoiceId === invoice.id)
    .reduce((s, p) => s + p.amount, 0);
  return Math.max(0, invoice.total - paid);
}

function ReceivablesPage() {
  const [invoices] = useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = useState<ReceivablePayment[]>(initialReceivablePayments);

  // ── Receivable list filters ───────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'outstanding' | 'paid'>('all');

  // ── Add payment modal ─────────────────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const [payDate, setPayDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [payAmount, setPayAmount] = useState('');
  const [payNotes, setPayNotes] = useState('');

  // ── Payment history modal ─────────────────────────────────────────────────
  const [historyInvoice, setHistoryInvoice] = useState<Invoice | null>(null);

  // Filtered receivable list (all invoices are receivable once sold on credit or partial)
  const filteredInvoices = invoices.filter((inv) => {
    const outstanding = computeOutstanding(inv, payments);
    const matchSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      (inv.customerName ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'outstanding' && outstanding > 0) ||
      (statusFilter === 'paid' && outstanding === 0);
    return matchSearch && matchStatus;
  });

  // Summary stats
  const totalReceivable = invoices.reduce((s, inv) => s + inv.total, 0);
  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  const totalOutstanding = invoices.reduce((s, inv) => s + computeOutstanding(inv, payments), 0);

  const openAddPayment = (inv: Invoice) => {
    setPayInvoice(inv);
    setPayAmount(String(computeOutstanding(inv, payments)));
    setPayDate(format(new Date(), 'yyyy-MM-dd'));
    setPayNotes('');
    setAddOpen(true);
  };

  const handleAddPayment = () => {
    if (!payInvoice || !payDate || !payAmount) return;
    const amount = Number(payAmount);
    if (amount <= 0) return;
    const newPayment: ReceivablePayment = {
      id: String(Date.now()),
      invoiceId: payInvoice.id,
      invoiceNumber: payInvoice.number,
      customerName: payInvoice.customerName ?? 'Walk-in',
      date: payDate,
      amount,
      notes: payNotes || undefined,
    };
    setPayments((prev) => [...prev, newPayment]);
    setAddOpen(false);
  };

  const invoicePayments = (inv: Invoice) => payments.filter((p) => p.invoiceId === inv.id);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Invoiced</p>
          <p className="text-2xl font-bold text-primary">Rs. {totalReceivable.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Collected</p>
          <p className="text-2xl font-bold text-green-600">Rs. {totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Outstanding</p>
          <p className="text-2xl font-bold text-destructive">Rs. {totalOutstanding.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by invoice # or customer..." />
        </div>
        <div className="flex gap-2">
          {(['all', 'outstanding', 'paid'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors',
                statusFilter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Receivables Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Invoice #</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Customer</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Invoice Total</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Collected</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Outstanding</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-sm text-muted-foreground">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const collected = invoicePayments(inv).reduce((s, p) => s + p.amount, 0);
                  const outstanding = Math.max(0, inv.total - collected);
                  const isPaid = outstanding === 0;
                  return (
                    <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium text-primary">{inv.number}</td>
                      <td className="px-4 py-3 text-sm">{inv.date}</td>
                      <td className="px-4 py-3 text-sm">{inv.customerName ?? 'Walk-in'}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-right">
                        Rs. {inv.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-green-600">
                        Rs. {collected.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-destructive">
                        {outstanding > 0 ? `Rs. ${outstanding.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle2 className="h-3 w-3" /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            <Clock className="h-3 w-3" /> Outstanding
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setHistoryInvoice(inv)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Payment history"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          {!isPaid && (
                            <button
                              onClick={() => openAddPayment(inv)}
                              className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                              title="Add payment"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Record Payment Received">
        {payInvoice && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Invoice:</span>{' '}
                <span className="font-medium">{payInvoice.number}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Customer:</span>{' '}
                {payInvoice.customerName ?? 'Walk-in'}
              </p>
              <p>
                <span className="text-muted-foreground">Outstanding:</span>{' '}
                <span className="font-semibold text-destructive">
                  Rs. {computeOutstanding(payInvoice, payments).toLocaleString()}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Payment Date
                </label>
                <DatePicker value={payDate} onChange={setPayDate} className="w-full" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Amount (Rs.)
                </label>
                <Input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Notes (optional)
              </label>
              <Input
                value={payNotes}
                onChange={(e) => setPayNotes(e.target.value)}
                placeholder="e.g. Bank transfer, cheque no..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPayment} className="gap-2">
                <CreditCard className="h-4 w-4" /> Record Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Payment History Modal */}
      <Modal
        open={!!historyInvoice}
        onClose={() => setHistoryInvoice(null)}
        title={`Payment History — ${historyInvoice?.number}`}
        size="lg"
      >
        {historyInvoice && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>
                <span className="text-muted-foreground">Customer:</span>{' '}
                {historyInvoice.customerName ?? 'Walk-in'}
              </p>
              <p>
                <span className="text-muted-foreground">Invoice Total:</span>{' '}
                <span className="font-semibold">Rs. {historyInvoice.total.toLocaleString()}</span>
              </p>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Date</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {invoicePayments(historyInvoice).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-muted-foreground">
                        No payments recorded yet.
                      </td>
                    </tr>
                  ) : (
                    invoicePayments(historyInvoice).map((p) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="px-4 py-2">{p.date}</td>
                        <td className="px-4 py-2 text-right font-medium text-green-600">
                          Rs. {p.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{p.notes ?? '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between pt-2 border-t text-sm">
              <span className="text-muted-foreground">Outstanding</span>
              <span className="font-bold text-destructive">
                Rs. {computeOutstanding(historyInvoice, payments).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function WrappedReceivablesPage() {
  return (
    <>
      <Head title="Receivables" />
      <ReceivablesPage />
    </>
  );
}

(WrappedReceivablesPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

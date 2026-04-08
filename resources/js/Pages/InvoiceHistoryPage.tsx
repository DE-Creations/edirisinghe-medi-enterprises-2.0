import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import { initialInvoices, type Invoice } from '@/data/mockData';
import SearchBar from '@/components/shared/SearchBar';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Printer, Eye, Trash2 } from 'lucide-react';

function InvoiceHistoryPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [viewInv, setViewInv] = useState<Invoice | null>(null);

  const filtered = invoices.filter((inv) =>
    (inv.number.toLowerCase().includes(search.toLowerCase()) ||
    inv.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    inv.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))) &&
    (!dateFilter || inv.date === dateFilter)
  );

  const handleDelete = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const handlePrint = (inv: Invoice) => {
    window.print();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-72"><SearchBar value={search} onChange={setSearch} placeholder="Search invoices..." /></div>
        <DatePicker value={dateFilter} onChange={(v) => setDateFilter(v)} placeholder="Filter by date" className="w-full sm:w-44" />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Invoice #</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Customer</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Total</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Payment</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium text-primary">{inv.number}</td>
                  <td className="px-4 py-3 text-sm">{inv.date}</td>
                  <td className="px-4 py-3 text-sm">{inv.customerName || 'Walk-in'}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-right">Rs. {inv.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground capitalize">{inv.paymentMethod}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setViewInv(inv)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="View"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handlePrint(inv)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Print"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewInv} onOpenChange={(open) => !open && setViewInv(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">Invoice</DialogTitle>
          </DialogHeader>

          {viewInv && (
            <div className="space-y-4 mt-2">
              {/* Invoice Meta */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice No.</span>
                  <span className="font-semibold text-primary">{viewInv.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{viewInv.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{viewInv.customerName || 'Walk-in Customer'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="capitalize font-medium">{viewInv.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid Amount</span>
                  <span className="font-medium">Rs. {viewInv.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Balance</span>
                  <span className={`font-medium ${viewInv.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                    Rs. {viewInv.balance.toLocaleString()}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Items Table */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-muted-foreground text-xs">#</th>
                      <th className="text-left py-2 font-medium text-muted-foreground text-xs">Item</th>
                      <th className="text-right py-2 font-medium text-muted-foreground text-xs">Qty</th>
                      <th className="text-right py-2 font-medium text-muted-foreground text-xs">Unit Price</th>
                      <th className="text-right py-2 font-medium text-muted-foreground text-xs">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewInv.items.map((item, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="py-2 text-muted-foreground">{i + 1}</td>
                        <td className="py-2">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">{item.brand}</p>
                        </td>
                        <td className="py-2 text-right">{item.qty}</td>
                        <td className="py-2 text-right">Rs. {item.price.toLocaleString()}</td>
                        <td className="py-2 text-right font-medium">Rs. {(item.qty * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">Rs. {viewInv.total.toLocaleString()}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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

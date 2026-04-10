import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import { initialGRNs, initialPayablePayments, type GRN } from '@/data/mockData';
import SearchBar from '@/components/shared/SearchBar';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Printer, Eye, Trash2 } from 'lucide-react';

function GRNHistoryPage() {
  const [grns, setGrns] = useState<GRN[]>(initialGRNs);
  const [payments] = useState(initialPayablePayments);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [viewGrn, setViewGrn] = useState<GRN | null>(null);

  const filtered = grns.filter((g) =>
    (g.number.toLowerCase().includes(search.toLowerCase()) ||
      g.supplierName.toLowerCase().includes(search.toLowerCase())) &&
    (!dateFilter || g.date === dateFilter)
  );

  const handleDelete = (id: string) => {
    setGrns((prev) => prev.filter((g) => g.id !== id));
  };

  const handlePrint = (_g: GRN) => {
    window.print();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search GRNs..." />
        </div>
        <DatePicker value={dateFilter} onChange={(v) => setDateFilter(v)} placeholder="Filter by date" className="w-full sm:w-44" />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">GRN #</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Supplier</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Total</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium text-primary">{g.number}</td>
                  <td className="px-4 py-3 text-sm">{g.date}</td>
                  <td className="px-4 py-3 text-sm">{g.supplierName}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-right">Rs. {g.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setViewGrn(g)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="View"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handlePrint(g)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Print"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(g.id)}
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
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No GRNs found.</td>
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
            <DialogTitle className="text-base">GRN</DialogTitle>
          </DialogHeader>

          {viewGrn && (
            <div className="space-y-4 mt-2">
              {/* GRN Meta */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GRN No.</span>
                  <span className="font-semibold text-primary">{viewGrn.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{viewGrn.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supplier</span>
                  <span className="font-medium">{viewGrn.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid Amount</span>
                  <span className="font-medium">Rs. {viewGrn.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Balance</span>
                  <span className={`font-medium ${viewGrn.balance > 0 ? 'text-destructive' : 'text-green-600'}`}>
                    Rs. {viewGrn.balance.toLocaleString()}
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
                      <th className="text-left py-2 font-medium text-muted-foreground text-xs">Product</th>
                      <th className="text-right py-2 font-medium text-muted-foreground text-xs">Qty</th>
                      <th className="text-right py-2 font-medium text-muted-foreground text-xs">Cost Price</th>
                      <th className="text-right py-2 font-medium text-muted-foreground text-xs">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewGrn.items.map((item, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="py-2 text-muted-foreground">{i + 1}</td>
                        <td className="py-2 font-medium">{item.name}</td>
                        <td className="py-2 text-right">{item.qty}</td>
                        <td className="py-2 text-right">Rs. {item.costPrice.toLocaleString()}</td>
                        <td className="py-2 text-right font-medium">Rs. {(item.qty * item.costPrice).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">Rs. {viewGrn.total.toLocaleString()}</span>
              </div>

              <Separator />

              {/* Payable Payments */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Payment Records</p>
                {(() => {
                  const grnPayments = payments.filter((p) => p.referenceId === viewGrn.id && p.referenceType === 'grn');
                  const paid = grnPayments.reduce((s, p) => s + p.amount, 0);
                  const outstanding = Math.max(0, viewGrn.total - paid);
                  return grnPayments.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">No payment records found.</p>
                  ) : (
                    <>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 font-medium text-muted-foreground text-xs">Date</th>
                            <th className="text-right py-2 font-medium text-muted-foreground text-xs">Amount</th>
                            <th className="text-left py-2 font-medium text-muted-foreground text-xs pl-4">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grnPayments.map((p) => (
                            <tr key={p.id} className="border-b border-border last:border-0">
                              <td className="py-2">{p.date}</td>
                              <td className="py-2 text-right font-medium text-green-600">Rs. {p.amount.toLocaleString()}</td>
                              <td className="py-2 pl-4 text-muted-foreground">{p.notes ?? '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="flex justify-between pt-2 mt-1 border-t text-sm">
                        <span className="text-muted-foreground">Outstanding</span>
                        <span className={`font-semibold ${outstanding > 0 ? 'text-destructive' : 'text-green-600'}`}>
                          Rs. {outstanding.toLocaleString()}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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

import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import { initialGRNs, type GRN } from '@/data/mockData';
import SearchBar from '@/components/shared/SearchBar';
import Modal from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Printer, Eye } from 'lucide-react';

function GRNHistoryPage() {
  const [grns] = useState<GRN[]>(initialGRNs);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [viewGrn, setViewGrn] = useState<GRN | null>(null);

  const filtered = grns.filter((g) =>
    (g.number.toLowerCase().includes(search.toLowerCase()) || g.supplierName.toLowerCase().includes(search.toLowerCase())) &&
    (!dateFilter || g.date === dateFilter)
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-72"><SearchBar value={search} onChange={setSearch} placeholder="Search GRNs..." /></div>
        <DatePicker value={dateFilter} onChange={(v) => setDateFilter(v)} placeholder="Filter by date" className="w-full sm:w-44" />
        <Button variant="outline" className="gap-2 ml-auto"><Printer className="h-4 w-4" /> Print Report</Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">GRN #</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Supplier</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Total</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-sm font-medium text-primary">{g.number}</td>
                <td className="px-4 py-3 text-sm">{g.date}</td>
                <td className="px-4 py-3 text-sm">{g.supplierName}</td>
                <td className="px-4 py-3 text-sm font-semibold text-right">Rs. {g.total.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setViewGrn(g)} className="p-1.5 rounded-lg hover:bg-muted"><Eye className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!viewGrn} onClose={() => setViewGrn(null)} title={`GRN ${viewGrn?.number}`} size="lg">
        {viewGrn && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-muted-foreground">Date:</span> {viewGrn.date}</p>
              <p><span className="text-muted-foreground">Supplier:</span> {viewGrn.supplierName}</p>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Product</th><th className="text-right py-2">Qty</th><th className="text-right py-2">Cost</th><th className="text-right py-2">Total</th></tr></thead>
              <tbody>
                {viewGrn.items.map((item, i) => (
                  <tr key={i} className="border-b last:border-0"><td className="py-2">{item.name}</td><td className="py-2 text-right">{item.qty}</td><td className="py-2 text-right">Rs. {item.costPrice}</td><td className="py-2 text-right font-medium">Rs. {(item.qty * item.costPrice).toLocaleString()}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold text-primary">Rs. {viewGrn.total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
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

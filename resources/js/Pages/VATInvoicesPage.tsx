import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import { initialInvoices, initialCustomers } from '@/data/mockData';
import SearchBar from '@/components/shared/SearchBar';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

function VATInvoicesPage() {
  const [search, setSearch] = useState('');
  const vatCustomerIds = initialCustomers.filter((c) => c.isVat).map((c) => c.id);
  const vatInvoices = initialInvoices.filter((inv) => inv.customerId && vatCustomerIds.includes(inv.customerId));

  const filtered = vatInvoices.filter((inv) =>
    inv.number.toLowerCase().includes(search.toLowerCase()) || inv.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-72"><SearchBar value={search} onChange={setSearch} placeholder="Search VAT invoices..." /></div>
        <Button variant="outline" className="gap-2 ml-auto"><Printer className="h-4 w-4" /> Print Report</Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Invoice #</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Customer</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Total</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-sm text-muted-foreground">No VAT invoices found</td></tr>
            ) : filtered.map((inv) => (
              <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-sm font-medium text-primary">{inv.number}</td>
                <td className="px-4 py-3 text-sm">{inv.date}</td>
                <td className="px-4 py-3 text-sm">{inv.customerName}</td>
                <td className="px-4 py-3 text-sm font-semibold text-right">Rs. {inv.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default function WrappedVATInvoicesPage() {
  return (
    <>
      <Head title="VAT Invoices" />
      <VATInvoicesPage />
    </>
  );
}

(WrappedVATInvoicesPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

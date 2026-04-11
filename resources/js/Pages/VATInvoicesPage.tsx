import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import {
  initialCustomers,
  initialInvoices,
  initialVatInvoices,
  nextVatInvoiceNumber,
  type Customer,
  type VatInvoice,
} from '@/data/mockData';
import SearchBar from '@/components/shared/SearchBar';
import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Plus, Eye, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function VATInvoicesPage() {
  const [vatInvoices, setVatInvoices] = useState<VatInvoice[]>(initialVatInvoices);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Create modal state
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');

  const vatCustomers = initialCustomers.filter((c) => c.isVat);

  const customerInvoices = selectedCustomerId
    ? initialInvoices.filter((inv) => inv.customerId === selectedCustomerId)
    : [];

  const filtered = vatInvoices.filter(
    (vi) =>
      vi.vatInvoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      vi.customerName.toLowerCase().includes(search.toLowerCase()) ||
      vi.invoiceNumber.toLowerCase().includes(search.toLowerCase()),
  );

  const openPdfForm = (action: string, payload: object) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = action;
    form.target = '_blank';
    const dataInput = document.createElement('input');
    dataInput.type = 'hidden';
    dataInput.name = 'data';
    dataInput.value = JSON.stringify(payload);
    form.appendChild(dataInput);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const buildPayload = (vi: VatInvoice, customer: Customer | undefined) => ({
    taxInvoiceNumber: vi.vatInvoiceNumber,
    printedDateTime: vi.date + 'T00:00:00',
    companyVatNo: 'VAT-COMPANY-001',
    companyName: 'Edirisinghe Medi Enterprises',
    companyAddress: 'No. 123, Health Street, Colombo',
    companyPhone: '+94 11 234 5678',
    clientVatNo: customer?.vatNumber ?? '',
    clientName: vi.customerName,
    clientAddress: customer?.companyAddress ?? customer?.address ?? '',
    clientPhone: customer?.contactNumber ?? customer?.mobile ?? '',
    placeOfSupply: customer?.companyAddress ?? customer?.address ?? '',
    records: vi.records,
    subtotal: vi.subtotal,
    vatPercentage: vi.vatPercentage,
    vatAmount: vi.vatAmount,
    grandTotal: vi.grandTotal,
    paymentMode: vi.paymentMode,
  });

  const handleGenerate = () => {
    const customer = vatCustomers.find((c) => c.id === selectedCustomerId);
    const invoice = customerInvoices.find((inv) => inv.id === selectedInvoiceId);
    if (!customer || !invoice) return;

    const nickName =
      customer.nickName ?? customer.name.replace(/\s+/g, '').toUpperCase().slice(0, 8);
    const vatInvoiceNumber = nextVatInvoiceNumber(nickName);

    const VAT_PERCENT = 18;
    const subtotal = invoice.items.reduce((sum, item) => sum + item.qty * item.price, 0);
    const vatAmount = Math.round((subtotal * VAT_PERCENT) / 100);
    const grandTotal = subtotal + vatAmount;

    const records = invoice.items.map((item, idx) => ({
      refNo: String(idx + 1),
      invoiceItem: item.name,
      quantity: item.qty,
      unitPrice: item.price,
      amountExclVat: item.qty * item.price,
    }));

    const newVatInvoice: VatInvoice = {
      id: String(Date.now()),
      vatInvoiceNumber,
      customerId: customer.id,
      customerName: customer.companyName ?? customer.name,
      companyNickName: nickName,
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      date: new Date().toISOString().split('T')[0],
      records,
      subtotal,
      vatPercentage: VAT_PERCENT,
      vatAmount,
      grandTotal,
      paymentMode: invoice.paymentMethod === 'cash' ? 'Cash' : 'Credit Card',
    };

    openPdfForm('/vat-invoices/pdf', buildPayload(newVatInvoice, customer));
    setVatInvoices((prev) => [...prev, newVatInvoice]);
    setShowCreate(false);
    setSelectedCustomerId('');
    setSelectedInvoiceId('');
  };

  const handleView = (vi: VatInvoice) => {
    const customer = vatCustomers.find((c) => c.id === vi.customerId);
    openPdfForm('/vat-invoices/pdf/history', buildPayload(vi, customer));
  };

  const handleDelete = (id: string) => {
    setVatInvoices((prev) => prev.filter((vi) => vi.id !== id));
  };

  const selectedInvoice = customerInvoices.find((i) => i.id === selectedInvoiceId);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search VAT invoices..." />
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2 ml-auto">
          <Plus className="h-4 w-4" /> New VAT Invoice
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">VAT Invoice #</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Customer</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Invoice Ref</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Grand Total</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                    No VAT invoices found
                  </td>
                </tr>
              ) : (
                filtered.map((vi) => (
                  <tr key={vi.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-medium text-primary">{vi.vatInvoiceNumber}</td>
                    <td className="px-4 py-3 text-sm">{vi.date}</td>
                    <td className="px-4 py-3 text-sm">{vi.customerName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{vi.invoiceNumber}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-right">
                      Rs. {vi.grandTotal.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleView(vi)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="View PDF"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(vi.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        open={showCreate}
        onClose={() => {
          setShowCreate(false);
          setSelectedCustomerId('');
          setSelectedInvoiceId('');
        }}
        title="New VAT Invoice"
        size="md"
      >
        <div className="space-y-4">
          {/* Customer Select */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Customer
            </label>
            <Select
              value={selectedCustomerId}
              onValueChange={(v) => {
                setSelectedCustomerId(v);
                setSelectedInvoiceId('');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select VAT customer..." />
              </SelectTrigger>
              <SelectContent>
                {vatCustomers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.companyName ?? c.name}
                    {c.nickName && (
                      <span className="ml-1 text-muted-foreground">({c.nickName})</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Invoice Select */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Invoice
            </label>
            <Select
              value={selectedInvoiceId}
              onValueChange={setSelectedInvoiceId}
              disabled={!selectedCustomerId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !selectedCustomerId
                      ? 'Select a customer first'
                      : customerInvoices.length === 0
                        ? 'No invoices for this customer'
                        : 'Select invoice...'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {customerInvoices.map((inv) => (
                  <SelectItem key={inv.id} value={inv.id}>
                    {inv.number} — {inv.date} — Rs. {inv.total.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Invoice Summary Preview */}
          {selectedInvoice && (() => {
            const subtotal = selectedInvoice.items.reduce(
              (s, i) => s + i.qty * i.price,
              0,
            );
            const vatAmount = Math.round((subtotal * 18) / 100);
            return (
              <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Invoice Summary
                </p>
                <div className="space-y-1">
                  {selectedInvoice.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {item.name} × {item.qty}
                      </span>
                      <span>Rs. {(item.qty * item.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Sub Total</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">VAT (18%)</span>
                    <span>Rs. {vatAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Grand Total</span>
                    <span>Rs. {(subtotal + vatAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreate(false);
                setSelectedCustomerId('');
                setSelectedInvoiceId('');
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={!selectedCustomerId || !selectedInvoiceId}
              onClick={handleGenerate}
            >
              Generate VAT Invoice
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        message="Delete this VAT invoice? This action cannot be undone."
      />
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


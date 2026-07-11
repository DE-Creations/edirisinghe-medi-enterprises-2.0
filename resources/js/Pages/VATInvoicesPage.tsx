import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Printer, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface Customer { id: number; name: string; }
interface InvoiceRow { id: number; invoice_number: string; invoice_date: string; grand_total: number; sub_total: number; is_vat_invoice_issued: boolean; }
interface InvoiceItem { id: number; quantity: number; unit_price: number; stock_batch?: { product?: { generic_name: string } }; }
interface InvoiceDetail { id: number; invoice_number: string; invoice_date: string; sub_total: number; grand_total: number; discount: number; is_vat_invoice_issued: boolean; customer?: { id: number; name: string; contact_no: string; address: string }; items: InvoiceItem[]; }
interface CustomerVat { company_name?: string; nick_name?: string; company_address?: string; company_contact?: string; vat_number?: string; }
interface InvoiceDataResponse { invoice: InvoiceDetail; customer_vat: CustomerVat | null; vat_percentage: number; vat_amount: number; total_amount: number; }


export default function VATInvoicesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [searching, setSearching] = useState(false);

  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [invoiceData, setInvoiceData] = useState<InvoiceDataResponse | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  const [history, setHistory] = useState<any[]>([]);
  const [historySearch, setHistorySearch] = useState('');

  useEffect(() => {
    axios.get('/vat-invoice/customers')
      .then(res => setCustomers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCustomers([]));
    fetchHistory();
  }, []);

  const handleSearchInvoices = async () => {
    if (!selectedCustomerId || !selectedYear || !selectedMonth) return;
    setSearching(true);
    setHasSearched(false);
    setInvoices([]);
    setSelectedInvoiceId('');
    setInvoiceData(null);
    try {
      const res = await axios.post('/vat-invoice/search', {
        customer_id: parseInt(selectedCustomerId),
        year: parseInt(selectedYear),
        month: parseInt(selectedMonth),
      });
      setInvoices(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
      setHasSearched(true);
    }
  };

  const handleInvoiceSelect = async (id: string) => {
    setSelectedInvoiceId(id);
    setInvoiceData(null);
    if (!id) return;
    setLoadingData(true);
    try {
      const res = await axios.get<InvoiceDataResponse>('/vat-invoice/data/' + id);
      setInvoiceData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/vat-invoice/history', { params: { search: historySearch } });
      const data = res.data;
      setHistory(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      setHistory([]);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchHistory(), 500);
    return () => clearTimeout(t);
  }, [historySearch]);

  const [isPrinting, setIsPrinting] = useState(false);
  const [reprintingId, setReprintingId] = useState<number | null>(null);

  const getCsrfToken = (): string => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) return meta.getAttribute('content') || '';
    const cookieMatch = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return cookieMatch ? decodeURIComponent(cookieMatch[1]) : '';
  };

  const readBlobError = async (error: any): Promise<string> => {
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        return json.message || text;
      } catch {
        return error.message;
      }
    }
    return error.response?.data?.message || error.message;
  };

  const handlePrint = async () => {
    if (!invoiceData || !selectedInvoiceId) return;
    setIsPrinting(true);
    try {
      const response = await axios.post('/vat-invoice/generate',
        { invoice_id: selectedInvoiceId },
        {
          responseType: 'blob',
          headers: {
            'X-CSRF-TOKEN': getCsrfToken(),
            'Content-Type': 'application/json',
          }
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      // Refresh after printing
      setInvoiceData(null);
      setSelectedInvoiceId('');
      setTimeout(() => {
        handleSearchInvoices();
        fetchHistory();
      }, 500);
    } catch (error: any) {
      console.error('Error generating VAT invoice:', error);
      const msg = await readBlobError(error);
      alert('Failed to generate VAT invoice: ' + msg);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleReprint = async (id: number) => {
    setReprintingId(id);
    try {
      const response = await axios.post('/vat-invoice/reprint',
        { id },
        {
          responseType: 'blob',
          headers: {
            'X-CSRF-TOKEN': getCsrfToken(),
            'Content-Type': 'application/json',
          }
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error: any) {
      console.error('Error reprinting VAT invoice:', error);
      const msg = await readBlobError(error);
      alert('Failed to reprint VAT invoice: ' + msg);
    } finally {
      setReprintingId(null);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, '0'),
    label: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }),
  }));

  const inv = invoiceData?.invoice;
  const cvat = invoiceData?.customer_vat;

  return (
    <AppShell>
      <Head title="VAT Invoices" />
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">VAT Invoices</h1>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList>
            <TabsTrigger value="generate">Generate VAT Invoice</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* ── Generate Tab ─────────────────────────────────────────────── */}
          <TabsContent value="generate" className="space-y-5 mt-4">

            {/* Section 1 – Search */}
            <Card>
              <CardHeader><CardTitle>Step 1 — Search Invoices</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <Label className="mb-1 block">Customer</Label>
                    <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                      <SelectTrigger><SelectValue placeholder="Select Customer" /></SelectTrigger>
                      <SelectContent>
                        {customers.map(c => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-36">
                    <Label className="mb-1 block">Year</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                      <SelectContent>
                        {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-40">
                    <Label className="mb-1 block">Month</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                      <SelectContent>
                        {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSearchInvoices} disabled={searching || !selectedCustomerId}>
                    <Search className="w-4 h-4 mr-2" />
                    {searching ? 'Searching…' : 'Search'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section 2 – Invoice Selector */}
            {hasSearched && (
              <Card>
                <CardHeader><CardTitle>Step 2 — Select Invoice</CardTitle></CardHeader>
                <CardContent>
                  {invoices.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No invoices found for the selected customer, year and month.</p>
                  ) : (
                    <Select value={selectedInvoiceId} onValueChange={handleInvoiceSelect}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an invoice…" />
                      </SelectTrigger>
                      <SelectContent>
                        {invoices.map(inv => (
                          <SelectItem key={inv.id} value={inv.id.toString()}>
                            {inv.invoice_number} &nbsp;|&nbsp; {inv.invoice_date} &nbsp;|&nbsp; LKR {Number(inv.grand_total).toLocaleString()}
                            {inv.is_vat_invoice_issued ? '  ✓ VAT issued' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Sections 3‑5 — Invoice Details (shown when an invoice is selected) */}
            {loadingData && (
              <p className="text-muted-foreground text-sm text-center">Loading invoice data…</p>
            )}

            {invoiceData && !loadingData && (
              <>
                {/* Section 3 – Customer / Company Info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Step 3 — Customer &amp; Company Details</CardTitle>
                      {inv?.is_vat_invoice_issued && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> VAT Invoice Already Issued
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Customer</p>
                        <p className="font-medium">{inv?.customer?.name}</p>
                        <p className="text-sm">{inv?.customer?.contact_no}</p>
                        <p className="text-sm">{inv?.customer?.address}</p>
                      </div>
                      {cvat && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Company (VAT)</p>
                          <p className="font-medium">{cvat.company_name}</p>
                          <p className="text-sm">{cvat.company_address}</p>
                          <p className="text-sm">{cvat.company_contact}</p>
                          <p className="text-sm font-mono">VAT No: {cvat.vat_number}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Section 4 – Invoice Items */}
                <Card>
                  <CardHeader><CardTitle>Step 4 — Invoice Items</CardTitle></CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="p-2 text-left">#</th>
                            <th className="p-2 text-left">Product</th>
                            <th className="p-2 text-right">Qty</th>
                            <th className="p-2 text-right">Unit Price (LKR)</th>
                            <th className="p-2 text-right">Amount (LKR)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inv?.items?.map((item, idx) => (
                            <tr key={item.id} className="border-b hover:bg-muted/30">
                              <td className="p-2">{idx + 1}</td>
                              <td className="p-2">{item.stock_batch?.product?.generic_name ?? 'N/A'}</td>
                              <td className="p-2 text-right">{item.quantity}</td>
                              <td className="p-2 text-right">{Number(item.unit_price).toLocaleString()}</td>
                              <td className="p-2 text-right">{(item.quantity * item.unit_price).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Section 5 – Totals / Summary + Print */}
                <Card>
                  <CardHeader><CardTitle>Step 5 — VAT Summary</CardTitle></CardHeader>
                  <CardContent>
                    <div className="max-w-sm ml-auto space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sub Total</span>
                        <span>LKR {Number(inv?.sub_total).toLocaleString()}</span>
                      </div>
                      {(inv?.discount ?? 0) > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount</span>
                          <span>- LKR {Number(inv?.discount).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">VAT ({invoiceData.vat_percentage}%)</span>
                        <span>LKR {Number(invoiceData.vat_amount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2 text-base">
                        <span>Total (incl. VAT)</span>
                        <span>LKR {Number(invoiceData.total_amount).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    {inv?.is_vat_invoice_issued ? (
                      <div className="flex items-center gap-2 text-amber-600 text-sm w-full">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        A VAT invoice has already been issued for this regular invoice.
                      </div>
                    ) : (
                      <Button onClick={handlePrint} disabled={isPrinting} className="w-full" size="lg">
                        <Printer className="w-5 h-5 mr-2" /> {isPrinting ? 'Generating...' : 'Print VAT Invoice'}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </>
            )}
          </TabsContent>

          {/* ── History Tab ──────────────────────────────────────────────── */}
          <TabsContent value="history" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Generated VAT Invoices</CardTitle>
                  <div className="w-64">
                    <Input placeholder="Search by VAT invoice no…" value={historySearch} onChange={e => setHistorySearch(e.target.value)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2">Date</th>
                        <th className="p-2">VAT Invoice No</th>
                        <th className="p-2">Regular Invoice No</th>
                        <th className="p-2">Customer</th>
                        <th className="p-2 text-right">Total (LKR)</th>
                        <th className="p-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(h => (
                        <tr key={h.id} className="border-b hover:bg-muted/30">
                          <td className="p-2">{new Date(h.created_at).toLocaleDateString()}</td>
                          <td className="p-2 font-mono text-xs">{h.vat_invoice_number}</td>
                          <td className="p-2">{h.invoice?.invoice_number}</td>
                          <td className="p-2">{h.customer?.name}</td>
                          <td className="p-2 text-right">{Number(h.total_amount).toLocaleString()}</td>
                          <td className="p-2 text-center">
                            <Button
                              onClick={() => handleReprint(h.id)}
                              disabled={reprintingId === h.id}
                              variant="ghost"
                              size="sm"
                              title="Reprint"
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {history.length === 0 && (
                        <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No VAT invoices found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

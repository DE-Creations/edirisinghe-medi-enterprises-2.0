import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import { initialCustomers, type Customer } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchBar from '@/components/shared/SearchBar';
import Modal from '@/components/shared/Modal';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editCust, setEditCust] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Customer>>({ isVat: false });
  const [tab, setTab] = useState<'all' | 'vat' | 'normal'>('all');

  const filtered = customers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search);
    if (tab === 'vat') return matchSearch && c.isVat;
    if (tab === 'normal') return matchSearch && !c.isVat;
    return matchSearch;
  });

  const handleSave = () => {
    if (editCust) {
      setCustomers((prev) => prev.map((c) => c.id === editCust.id ? { ...c, ...form } as Customer : c));
      setEditCust(null);
    } else {
      setCustomers((prev) => [...prev, { ...form, id: String(Date.now()) } as Customer]);
      setShowAdd(false);
    }
    setForm({ isVat: false });
  };

  const CustomerForm = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label><Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Mobile</label><Input value={form.mobile || ''} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></div>
      </div>
      <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label><Input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.isVat || false} onChange={(e) => setForm({ ...form, isVat: e.target.checked })} className="rounded" />
        <span className="text-sm">VAT Registered Customer</span>
      </label>
      {form.isVat && (
        <div className="grid grid-cols-2 gap-3 p-3 bg-muted rounded-lg">
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Company Name</label><Input value={form.companyName || ''} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Nick Name</label><Input value={form.nickName || ''} onChange={(e) => setForm({ ...form, nickName: e.target.value })} /></div>
          <div className="col-span-2"><label className="text-xs font-medium text-muted-foreground mb-1 block">VAT Company Address</label><Input value={form.companyAddress || ''} onChange={(e) => setForm({ ...form, companyAddress: e.target.value })} /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Contact Number</label><Input value={form.contactNumber || ''} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">VAT No</label><Input value={form.vatNumber || ''} onChange={(e) => setForm({ ...form, vatNumber: e.target.value })} /></div>
        </div>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={() => { setShowAdd(false); setEditCust(null); setForm({ isVat: false }); }}>Cancel</Button>
        <Button onClick={handleSave}>{editCust ? 'Update' : 'Add'} Customer</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-3 items-center">
          <div className="w-60"><SearchBar value={search} onChange={setSearch} placeholder="Search customers..." /></div>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {['all', 'VAT', 'Regular'].map((t) => (
              <button key={t} onClick={() => setTab(t as typeof tab)} className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${tab === t ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>{t === 'vat' ? 'VAT' : t}</button>
            ))}
          </div>
        </div>
        <Button onClick={() => { setForm({ isVat: false }); setShowAdd(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add Customer</Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Name</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Mobile</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Address</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Type</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
                <td className="px-4 py-3 text-sm">{c.mobile}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{c.address}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.isVat ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {c.isVat ? 'VAT' : 'Regular'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { setForm(c); setEditCust(c); }} className="p-1.5 rounded-lg hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showAdd || !!editCust} onClose={() => { setShowAdd(false); setEditCust(null); setForm({ isVat: false }); }} title={editCust ? 'Update Customer' : 'Add Customer'} size="lg">
        <CustomerForm />
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { setCustomers((prev) => prev.filter((c) => c.id !== deleteId)); setDeleteId(null); }} />
    </div>
  );
}


export default function WrappedCustomersPage() {
  return (
    <>
      <Head title="Customers" />
      <CustomersPage />
    </>
  );
}

(WrappedCustomersPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

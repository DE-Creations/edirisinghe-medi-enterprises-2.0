import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import { initialSuppliers, initialSupplierCompanies, type Supplier, type SupplierCompany } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchBar from '@/components/shared/SearchBar';
import Modal from '@/components/shared/Modal';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [companies, setCompanies] = useState<SupplierCompany[]>(initialSupplierCompanies);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editSup, setEditSup] = useState<Supplier | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Supplier>>({});
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState<Partial<SupplierCompany>>({});

  const filtered = suppliers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.company.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (editSup) {
      setSuppliers((prev) => prev.map((s) => s.id === editSup.id ? { ...s, ...form } as Supplier : s));
      setEditSup(null);
    } else {
      setSuppliers((prev) => [...prev, { ...form, id: String(Date.now()) } as Supplier]);
      setShowAdd(false);
    }
    setForm({});
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-72"><SearchBar value={search} onChange={setSearch} placeholder="Search suppliers..." /></div>
        <Button onClick={() => { setForm({}); setShowAdd(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add Supplier</Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Name</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Mobile</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Company</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-sm font-medium">{s.name}</td>
                <td className="px-4 py-3 text-sm">{s.mobile}</td>
                <td className="px-4 py-3 text-sm">{s.company}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { setForm(s); setEditSup(s); }} className="p-1.5 rounded-lg hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showAdd || !!editSup} onClose={() => { setShowAdd(false); setEditSup(null); setForm({}); }} title={editSup ? 'Update Supplier' : 'Add Supplier'}>
        <div className="space-y-3">
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label><Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Mobile</label><Input value={form.mobile || ''} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Company</label>
            <div className="flex gap-1">
              <Select value={form.company || ''} onValueChange={(v) => setForm({ ...form, company: v })}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => setShowNewCompany(true)}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => { setShowAdd(false); setEditSup(null); setForm({}); }}>Cancel</Button>
            <Button onClick={handleSave}>{editSup ? 'Update' : 'Add'} Supplier</Button>
          </div>
        </div>
      </Modal>

      <Modal open={showNewCompany} onClose={() => setShowNewCompany(false)} title="Add Company">
        <div className="space-y-3">
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Company Name</label><Input value={companyForm.name || ''} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Mobile</label><Input value={companyForm.mobile || ''} onChange={(e) => setCompanyForm({ ...companyForm, mobile: e.target.value })} /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label><Input value={companyForm.address || ''} onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowNewCompany(false)}>Cancel</Button>
            <Button onClick={() => {
              if (companyForm.name) {
                const newC = { ...companyForm, id: String(Date.now()) } as SupplierCompany;
                setCompanies((prev) => [...prev, newC]);
                setForm({ ...form, company: newC.name });
                setCompanyForm({});
                setShowNewCompany(false);
              }
            }}>Add Company</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { setSuppliers((prev) => prev.filter((s) => s.id !== deleteId)); setDeleteId(null); }} />
    </div>
  );
}


export default function WrappedSuppliersPage() {
  return (
    <>
      <Head title="Suppliers" />
      <SuppliersPage />
    </>
  );
}

(WrappedSuppliersPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

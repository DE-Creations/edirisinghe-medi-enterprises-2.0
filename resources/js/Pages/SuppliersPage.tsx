import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchBar from '@/components/shared/SearchBar';
import Modal from '@/components/shared/Modal';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

interface Company {
  id: number;
  name: string;
  mobile: string;
  address: string;
}

interface Supplier {
  id: number;
  name: string;
  contact_no: string;
  email: string;
  address: string;
  company_id: number;
  company?: Company; 
}


function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editSup, setEditSup] = useState<Supplier | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Supplier>>({});
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState<Partial<Company>>({});

  useEffect(() => {
    fetchSuppliers();
    fetchCompanies();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('/suppliers/all');
      setSuppliers(res.data);
    } catch (error: any) {
      console.log('Suppliers error:', error.response?.data);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/companies/all');
      setCompanies(res.data);
    } catch (error: any) {
      console.log('Companies error:', error.response?.data);
    }
  };

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.company?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (editSup) {
      // UPDATE
      try {
        const res = await axios.post(`/suppliers/update/${editSup.id}`, {
          name:       form.name,
          contact_no: form.contact_no,
          email:      form.email,
          address:    form.address,
          company_id: form.company_id,
        });
        setSuppliers((prev) => prev.map((s) => s.id === editSup.id ? res.data : s));
        setEditSup(null);
        setShowAdd(false);

      } catch (error: any) {
        console.log('Update error:', error.response?.data);
      }

    } else {
      // STORE
      try {
        const res = await axios.post('/suppliers/store', {
          name:       form.name,
          contact_no: form.contact_no,
          email:      form.email,
          address:    form.address,
          company_id: form.company_id,
        });
        setSuppliers((prev) => [...prev, res.data]);
        setShowAdd(false);

      } catch (error: any) {
        console.log('Store error:', error.response?.data);
      }
    }
    setForm({});
  };

  const handleDelete = async () => {
    await axios.delete(`/suppliers/delete/${deleteId}`);
    setSuppliers((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  };

  const handleAddCompany = async () => {
    if (companyForm.name) {
      const res = await axios.post('/companies/store', companyForm);
      const newCompany: Company = res.data;
      setCompanies((prev) => [...prev, newCompany]);
      setForm({ ...form, company_id: newCompany.id }); // set company_id not name
      setCompanyForm({});
      setShowNewCompany(false);
    }
  };

  return (
        <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search suppliers..." />
        </div>
        <Button onClick={() => { setForm({}); setShowAdd(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Supplier
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Name</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Mobile</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Company</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-sm font-medium">{s.name}</td>
                <td className="px-4 py-3 text-sm">{s.contact_no}</td>       {/* changed from mobile */}
                <td className="px-4 py-3 text-sm">{s.company?.name}</td>    {/* changed from s.company */}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { 
                      setForm({
                        name:       s.name,
                        contact_no: s.contact_no,
                        email:      s.email,
                        address:    s.address,
                        company_id: s.company_id,
                      }); 
                      setEditSup(s); 
                    }} className="p-1.5 rounded-lg hover:bg-muted">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(s.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Supplier Modal */}
      <Modal open={showAdd || !!editSup}
        onClose={() => { setShowAdd(false); setEditSup(null); setForm({}); }}
        title={editSup ? 'Update Supplier' : 'Add Supplier'}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
            <Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Mobile</label>
            {/* contact_no matches your DB column */}
            <Input value={form.contact_no || ''} onChange={(e) => setForm({ ...form, contact_no: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
            <Input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label>
            <Input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Company</label>
            <div className="flex gap-1">
              {/* Store company_id (number) not company name */}
              <Select
                value={form.company_id ? String(form.company_id) : ''}
                onValueChange={(v) => setForm({ ...form, company_id: Number(v) })}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => setShowNewCompany(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => { setShowAdd(false); setEditSup(null); setForm({}); }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editSup ? 'Update' : 'Add'} Supplier</Button>
          </div>
        </div>
      </Modal>

      {/* Add Company Modal */}
      <Modal open={showNewCompany} onClose={() => setShowNewCompany(false)} title="Add Company">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Company Name</label>
            <Input value={companyForm.name || ''} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Mobile</label>
            <Input value={companyForm.mobile || ''} onChange={(e) => setCompanyForm({ ...companyForm, mobile: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label>
            <Input value={companyForm.address || ''} onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowNewCompany(false)}>Cancel</Button>
            <Button onClick={handleAddCompany}>Add Company</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}  // changed to call API
      />
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

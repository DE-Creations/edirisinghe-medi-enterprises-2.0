import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchBar from '@/components/shared/SearchBar';
import Modal from '@/components/shared/Modal';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

interface Supplier {
  id: number;
  name: string;
  contact_no: string;
  email: string;
  address: string;
  is_vat: number;
  vatDetail?: {
    company_name: string;
    nick_name: string;
    company_address: string;
    company_contact: string;
    vat_number: string;
  };
}


function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editSup, setEditSup] = useState<Supplier | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Supplier> & {
    vat_company_name?: string;
    vat_nick_name?: string;
    vat_company_address?: string;
    vat_company_contact?: string;
    vat_number?: string;
  }>({});


  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('/suppliers/all');
      setSuppliers(res.data);
    } catch (error: any) {
      console.log('Suppliers error:', error.response?.data);
    }
  };

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (editSup) {
      // UPDATE
      try {
        const res = await axios.post(`/suppliers/update/${editSup.id}`, {
          name:                form.name,
          contact_no:          form.contact_no,
          email:               form.email,
          address:             form.address,
          is_vat:              form.is_vat ? 1 : 0,
          vat_company_name:    form.vat_company_name,
          vat_nick_name:       form.vat_nick_name,
          vat_company_address: form.vat_company_address,
          vat_company_contact: form.vat_company_contact,
          vat_number:          form.vat_number,
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
          name:                form.name,
          contact_no:          form.contact_no,
          email:               form.email,
          address:             form.address,
          is_vat:              form.is_vat ? 1 : 0,
          vat_company_name:    form.vat_company_name,
          vat_nick_name:       form.vat_nick_name,
          vat_company_address: form.vat_company_address,
          vat_company_contact: form.vat_company_contact,
          vat_number:          form.vat_number,
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
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-sm font-medium">{s.name}</td>
                <td className="px-4 py-3 text-sm">{s.contact_no}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { 
                      setForm({
                        name:                s.name,
                        contact_no:          s.contact_no,
                        email:               s.email,
                        address:             s.address,
                        is_vat:              s.is_vat,
                        vat_company_name:    s.vatDetail?.company_name    || '',
                        vat_nick_name:       s.vatDetail?.nick_name       || '',
                        vat_company_address: s.vatDetail?.company_address || '',
                        vat_company_contact: s.vatDetail?.company_contact || '',
                        vat_number:          s.vatDetail?.vat_number      || '',
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
          {/* VAT Registered */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form.is_vat}
              onChange={(e) => setForm({ ...form, is_vat: e.target.checked ? 1 : 0 })} />
            <span className="text-sm">VAT Registered Supplier</span>
          </label>

          {!!form.is_vat && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg border border-border">
              <p className="col-span-2 text-xs font-semibold text-muted-foreground">VAT Supplier Details</p>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Company Name</label>
                <Input value={form.vat_company_name || ''} onChange={(e) => setForm({ ...form, vat_company_name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Nick Name</label>
                <Input value={form.vat_nick_name || ''} onChange={(e) => setForm({ ...form, vat_nick_name: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Company Address</label>
                <Input value={form.vat_company_address || ''} onChange={(e) => setForm({ ...form, vat_company_address: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Contact Number</label>
                <Input value={form.vat_company_contact || ''} onChange={(e) => setForm({ ...form, vat_company_contact: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">VAT Number</label>
                <Input value={form.vat_number || ''} onChange={(e) => setForm({ ...form, vat_number: e.target.value })} />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => { setShowAdd(false); setEditSup(null); setForm({}); }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editSup ? 'Update' : 'Add'} Supplier</Button>
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

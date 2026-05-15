// import { Head } from '@inertiajs/react';
// import AppShell from '@/AppShell';
// import React, { useEffect, useState } from 'react';
// import { initialCustomers, type Customer } from '@/data/mockData';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import SearchBar from '@/components/shared/SearchBar';
// import Modal from '@/components/shared/Modal';
// import ConfirmDialog from '@/components/shared/ConfirmDialog';
// import { Plus, Edit, Trash2 } from 'lucide-react';
// import axios from 'axios';

// function CustomersPage() {
//   const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
//   const [search, setSearch] = useState('');
//   const [showAdd, setShowAdd] = useState(false);
//   const [editCust, setEditCust] = useState<Customer | null>(null);
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [form, setForm] = useState<Partial<Customer>>({ isVat: false });
//   const [tab, setTab] = useState<'all' | 'vat' | 'normal'>('all');

//   useEffect(() => {
//     fetchCustomers();
//   },[]);

//   const fetchCustomers = async ()=>{
//     try {
//         const response = await axios.get('customers/all');
//         const customerData = response.data.map((customer: any) => ({
//         id: customer.id,
//         name: customer.name,
//         mobile: customer.contact_no,
//         address: customer.address,
//         // isVat : customer.isVat
//         }));
//         setCustomers(customerData);
//     } catch (error) {
//         console.log(error);
//     // Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch service type data." });
//     }
//   }

//   const filtered = customers.filter((c) => {
//     const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search);
//     if (tab === 'vat') return matchSearch && c.isVat;
//     if (tab === 'normal') return matchSearch && !c.isVat;
//     return matchSearch;
//   });

//   const handleSave = async () => {
//     if (editCust) {
//       setCustomers((prev) => prev.map((c) => c.id === editCust.id ? { ...c, ...form } as Customer : c));
//       try {
//         const response = await axios.post(`/customers/update/${form.id}`, form);
//         const editCustomer = response.data;
//         // Swal.fire({ icon: "success", title: "Success", text: "Service Rule added Successfully!" });
//         setShowAdd(false);
//         setEditCust(null);
        
//       } catch (error) {
//       //         const message = error.response?.data?.detail || error.message || "Failed to update user.";
//       // Swal.fire({ icon: "error", title: "Error", text: message });
//       }

//     } else {
//       setCustomers((prev) => [...prev, { ...form, id: String(Date.now()) } as Customer]);
//         try {
//         const response = await axios.post('/customers/store', form);
//         const newCustomer = response.data;

//       //Swal.fire({ icon: "success", title: "Success", text: "Service Rule added Successfully!" });
//       // onUserRoleCreated();
//       // onClose();
//       // setFormData(initialState);

//       setShowAdd(false);
//       } catch (error) {
//       //         const message = error.response?.data?.detail || error.message || "Failed to update user.";
//       // Swal.fire({ icon: "error", title: "Error", text: message });
//       }

//     }
//     setForm({ isVat: false });
//     };

//   const deleteCustomer = async () => {
//     await axios.delete(`/customers/delete/${deleteId}`);
//     fetchCustomers();
//     setDeleteId(null);
//   }

//   const CustomerForm = () => (
//     <div className="space-y-3">
//       <div className="grid grid-cols-2 gap-3">
//         <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label><Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
//         <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Mobile</label><Input value={form.mobile || ''} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></div>
//       </div>
//       <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label><Input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
//       <label className="flex items-center gap-2 cursor-pointer">
//         <input type="checkbox" checked={form.isVat || false} onChange={(e) => setForm({ ...form, isVat: e.target.checked })} className="rounded" />
//         <span className="text-sm">VAT Registered Customer</span>
//       </label>
//       {form.isVat && (
//         <div className="grid grid-cols-2 gap-3 p-3 bg-muted rounded-lg">
//           <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Company Name</label><Input value={form.companyName || ''} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
//           <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Nick Name</label><Input value={form.nickName || ''} onChange={(e) => setForm({ ...form, nickName: e.target.value })} /></div>
//           <div className="col-span-2"><label className="text-xs font-medium text-muted-foreground mb-1 block">VAT Company Address</label><Input value={form.companyAddress || ''} onChange={(e) => setForm({ ...form, companyAddress: e.target.value })} /></div>
//           <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Contact Number</label><Input value={form.contactNumber || ''} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} /></div>
//           <div><label className="text-xs font-medium text-muted-foreground mb-1 block">VAT No</label><Input value={form.vatNumber || ''} onChange={(e) => setForm({ ...form, vatNumber: e.target.value })} /></div>
//         </div>
//       )}
//       <div className="flex justify-end gap-2 pt-2">
//         <Button variant="outline" onClick={() => { setShowAdd(false); setEditCust(null); setForm({ isVat: false }); }}>Cancel</Button>
//         <Button onClick={handleSave}>{editCust ? 'Update' : 'Add'} Customer</Button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="space-y-4 animate-fade-in">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <div className="flex gap-3 items-center">
//           <div className="w-60"><SearchBar value={search} onChange={setSearch} placeholder="Search customers..." /></div>
//           <div className="flex rounded-lg border border-border overflow-hidden">
//             {['all', 'VAT', 'Regular'].map((t) => (
//               <button key={t} onClick={() => setTab(t as typeof tab)} className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${tab === t ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>{t === 'vat' ? 'VAT' : t}</button>
//             ))}
//           </div>
//         </div>
//         <Button onClick={() => { setForm({ isVat: false }); setShowAdd(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add Customer</Button>
//       </div>

//       <div className="bg-card rounded-xl border border-border overflow-hidden">
//         <table className="w-full">
//           <thead><tr className="border-b bg-muted/50">
//             <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Name</th>
//             <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Mobile</th>
//             <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Address</th>
//             <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Type</th>
//             <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
//           </tr></thead>
//           <tbody>
//             {filtered.map((c) => (
//               <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
//                 <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
//                 <td className="px-4 py-3 text-sm">{c.mobile}</td>
//                 <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{c.address}</td>
//                 <td className="px-4 py-3">
//                   <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.isVat ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
//                     {c.isVat ? 'VAT' : 'Regular'}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 text-right">
//                   <div className="flex justify-end gap-1">
//                     <button onClick={() => { setForm(c); setEditCust(c); }} className="p-1.5 rounded-lg hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button>
//                     <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Modal open={showAdd || !!editCust} onClose={() => { setShowAdd(false); setEditCust(null); setForm({ isVat: false }); }} title={editCust ? 'Update Customer' : 'Add Customer'} size="lg">
//         <CustomerForm />
//       </Modal>
//       <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteCustomer}/>
//     </div>
//   );
// }


// export default function WrappedCustomersPage() {
//   return (
//     <>
//       <Head title="Customers" />
//       <CustomersPage />
//     </>
//   );
// }

// (WrappedCustomersPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchBar from '@/components/shared/SearchBar';
import Modal from '@/components/shared/Modal';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import axios from 'axios';

// --- Types ---
interface Customer {
    id:              number;
    name:            string;
    contact_no:      string;
    address:         string | null;
    is_vat:          number;  // 0 or 1
    company_name:    string | null;
    nick_name:       string | null;
    company_address: string | null;
    company_contact: string | null;
    vat_number:      string | null;
    balance_amount:  number;
}

type FormData = {
    name:            string;
    contact_no:      string;
    address:         string;
    is_vat:          boolean;
    company_name:    string;
    nick_name:       string;
    company_address: string;
    company_contact: string;
    vat_number:      string;
};

const emptyForm: FormData = {
    name:            '',
    contact_no:      '',
    address:         '',
    is_vat:          false,
    company_name:    '',
    nick_name:       '',
    company_address: '',
    company_contact: '',
    vat_number:      '',
};

function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search,    setSearch]    = useState('');
    const [tab,       setTab]       = useState<'all' | 'vat' | 'regular'>('all');
    const [showAdd,   setShowAdd]   = useState(false);
    const [editCust,  setEditCust]  = useState<Customer | null>(null);
    const [deleteId,  setDeleteId]  = useState<number | null>(null);
    const [form,      setForm]      = useState<FormData>(emptyForm);
    const [errors,    setErrors]    = useState<Record<string, string>>({});
    const [saving,    setSaving]    = useState(false);

    useEffect(() => { fetchCustomers(); }, []);

    const fetchCustomers = async () => {
        try {
            const res = await axios.get('/customers/all');
            setCustomers(res.data);
        } catch (e) { console.log(e); }
    };

    // ✅ Filter by tab and search
    const filtered = customers.filter((c) => {
        const matchSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.contact_no.includes(search);
        if (tab === 'vat')     return matchSearch && c.is_vat === 1;
        if (tab === 'regular') return matchSearch && c.is_vat === 0;
        return matchSearch;
    });

    const openAdd = () => {
        setForm(emptyForm);
        setErrors({});
        setShowAdd(true);
    };

    const openEdit = (c: Customer) => {
        setForm({
            name:            c.name,
            contact_no:      c.contact_no,
            address:         c.address         || '',
            is_vat:          c.is_vat === 1,
            company_name:    c.company_name    || '',
            nick_name:       c.nick_name       || '',
            company_address: c.company_address || '',
            company_contact: c.company_contact || '',
            vat_number:      c.vat_number      || '',
        });
        setErrors({});
        setEditCust(c);
    };

    const closeForm = () => {
        setShowAdd(false);
        setEditCust(null);
        setForm(emptyForm);
        setErrors({});
    };

    // ✅ Save customer
    const handleSave = async () => {
        setErrors({});
        setSaving(true);

        const payload = {
            ...form,
            is_vat: form.is_vat ? 1 : 0,
            // Clear VAT fields if not VAT customer
            company_name:    form.is_vat ? form.company_name    : null,
            nick_name:       form.is_vat ? form.nick_name       : null,
            company_address: form.is_vat ? form.company_address : null,
            company_contact: form.is_vat ? form.company_contact : null,
            vat_number:      form.is_vat ? form.vat_number      : null,
        };

        try {
            if (editCust) {
                const res = await axios.post(`/customers/update/${editCust.id}`, payload);
                setCustomers((prev) => prev.map((c) => c.id === editCust.id ? res.data : c));
                toast.success('Customer updated!');
            } else {
                const res = await axios.post('/customers/store', payload);
                setCustomers((prev) => [...prev, res.data]);
                toast.success('Customer added!');
            }
            closeForm();
        } catch (error: any) {
            if (error.response?.status === 422) {
                const errs = error.response.data.errors;
                const flat: Record<string, string> = {};
                Object.keys(errs).forEach((k) => { flat[k] = errs[k][0]; });
                setErrors(flat);
            } else {
                toast.error('Failed to save customer.');
            }
        } finally {
            setSaving(false);
        }
    };

    // ✅ Delete customer
    const handleDelete = async () => {
        try {
            await axios.delete(`/customers/delete/${deleteId}`);
            setCustomers((prev) => prev.filter((c) => c.id !== deleteId));
            setDeleteId(null);
            toast.success('Customer deleted.');
        } catch (e) {
            toast.error('Failed to delete customer.');
        }
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex gap-3 items-center flex-wrap">
                    <div className="w-60">
                        <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." />
                    </div>
                    {/* Tab filter */}
                    <div className="flex rounded-lg border border-border overflow-hidden">
                        {(['all', 'vat', 'regular'] as const).map((t) => (
                            <button key={t} onClick={() => setTab(t)}
                                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors
                                    ${tab === t ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                                {t === 'vat' ? 'VAT' : t === 'regular' ? 'Regular' : 'All'}
                            </button>
                        ))}
                    </div>
                </div>
                <Button onClick={openAdd} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Customer
                </Button>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Name</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Mobile</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Address</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Type</th>
                            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((c) => (
                            <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                                <td className="px-4 py-3">
                                    <p className="text-sm font-medium">{c.name}</p>
                                    {c.is_vat === 1 && c.company_name && (
                                        <p className="text-xs text-muted-foreground">{c.company_name}</p>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm">{c.contact_no}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                                    {c.address || '—'}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                        ${c.is_vat === 1
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-muted text-muted-foreground'}`}>
                                        {c.is_vat === 1 ? 'VAT' : 'Regular'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-1">
                                        <button onClick={() => openEdit(c)}
                                            className="p-1.5 rounded-lg hover:bg-muted">
                                            <Edit className="h-3.5 w-3.5" />
                                        </button>
                                        <button onClick={() => setDeleteId(c.id)}
                                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add / Edit Modal */}
            <Modal
                open={showAdd || !!editCust}
                onClose={closeForm}
                title={editCust ? 'Update Customer' : 'Add Customer'}
                size="lg">
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
                            <Input value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Mobile</label>
                            <Input value={form.contact_no}
                                onChange={(e) => setForm({ ...form, contact_no: e.target.value })} />
                            {errors.contact_no && <p className="text-xs text-destructive mt-1">{errors.contact_no}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label>
                        <Input value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    </div>

                    {/* VAT Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.is_vat}
                            onChange={(e) => setForm({ ...form, is_vat: e.target.checked })}
                            className="rounded" />
                        <span className="text-sm">VAT Registered Customer</span>
                    </label>

                    {/* VAT Fields — only show when is_vat checked */}
                    {form.is_vat && (
                        <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                            <p className="col-span-2 text-xs font-semibold text-muted-foreground">
                                VAT Customer Details
                            </p>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    Company Name
                                </label>
                                <Input value={form.company_name}
                                    onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
                                {errors.company_name && (
                                    <p className="text-xs text-destructive mt-1">{errors.company_name}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    Nick Name
                                </label>
                                <Input value={form.nick_name}
                                    onChange={(e) => setForm({ ...form, nick_name: e.target.value })} />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    Company Address
                                </label>
                                <Input value={form.company_address}
                                    onChange={(e) => setForm({ ...form, company_address: e.target.value })} />
                                {errors.company_address && (
                                    <p className="text-xs text-destructive mt-1">{errors.company_address}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    Contact Number
                                </label>
                                <Input value={form.company_contact}
                                    onChange={(e) => setForm({ ...form, company_contact: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    VAT Number
                                </label>
                                <Input value={form.vat_number}
                                    onChange={(e) => setForm({ ...form, vat_number: e.target.value })} />
                                {errors.vat_number && (
                                    <p className="text-xs text-destructive mt-1">{errors.vat_number}</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={closeForm}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : editCust ? 'Update Customer' : 'Add Customer'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete} />
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
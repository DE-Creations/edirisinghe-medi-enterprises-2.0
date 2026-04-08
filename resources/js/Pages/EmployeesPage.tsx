import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import { initialEmployees, type Employee } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchBar from '@/components/shared/SearchBar';
import Modal from '@/components/shared/Modal';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Plus, Edit, Trash2, User, Phone, MapPin, Mail, CreditCard } from 'lucide-react';

function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [viewEmp, setViewEmp] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Employee>>({});

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.mobile.includes(search)
  );

  const resetForm = () => setForm({});

  const handleSave = () => {
    if (editEmp) {
      setEmployees((prev) => prev.map((e) => e.id === editEmp.id ? { ...e, ...form } as Employee : e));
      setEditEmp(null);
    } else {
      setEmployees((prev) => [...prev, { ...form, id: String(Date.now()) } as Employee]);
      setShowAdd(false);
    }
    resetForm();
  };

  const openEdit = (emp: Employee) => { setForm(emp); setEditEmp(emp); };

  const EmployeeForm = () => (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2 sm:col-span-1">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
        <Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Mobile</label>
        <Input value={form.mobile || ''} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
      </div>
      <div className="col-span-2">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label>
        <Input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">NIC</label>
        <Input value={form.nic || ''} onChange={(e) => setForm({ ...form, nic: e.target.value })} />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
        <Input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Username</label>
        <Input value={form.username || ''} onChange={(e) => setForm({ ...form, username: e.target.value })} />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Role</label>
        <Select value={form.role || 'cashier'} onValueChange={(v) => setForm({ ...form, role: v as Employee['role'] })}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="cashier">Cashier</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {!editEmp && (
        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Password</label>
          <Input type="password" onChange={(e) => setForm({ ...form })} placeholder="Set password" />
        </div>
      )}
      <div className="col-span-2 flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={() => { setShowAdd(false); setEditEmp(null); resetForm(); }}>Cancel</Button>
        <Button onClick={handleSave}>{editEmp ? 'Update' : 'Add'} Employee</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-72"><SearchBar value={search} onChange={setSearch} placeholder="Search employees..." /></div>
        <Button onClick={() => { resetForm(); setShowAdd(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add Employee</Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Mobile</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Address</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Role</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id} onClick={() => setViewEmp(emp)} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{emp.name.charAt(0)}</div>
                      <span className="text-sm font-medium">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{emp.mobile}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{emp.address}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium capitalize">{emp.role}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => openEdit(emp)} className="p-1.5 rounded-lg hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteId(emp.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={showAdd || !!editEmp} onClose={() => { setShowAdd(false); setEditEmp(null); resetForm(); }} title={editEmp ? 'Update Employee' : 'Add Employee'} size="lg">
        <EmployeeForm />
      </Modal>

      {/* View Profile Modal */}
      <Modal open={!!viewEmp} onClose={() => setViewEmp(null)} title="Employee Profile" size="md">
        {viewEmp && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">{viewEmp.name.charAt(0)}</div>
              <div>
                <h3 className="text-lg font-bold">{viewEmp.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium capitalize">{viewEmp.role}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> {viewEmp.mobile}</div>
              <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> {viewEmp.email}</div>
              <div className="flex items-center gap-2 text-sm col-span-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {viewEmp.address}</div>
              <div className="flex items-center gap-2 text-sm"><CreditCard className="h-4 w-4 text-muted-foreground" /> {viewEmp.nic}</div>
              <div className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-muted-foreground" /> @{viewEmp.username}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { setEmployees((prev) => prev.filter((e) => e.id !== deleteId)); setDeleteId(null); }} />
    </div>
  );
}


export default function WrappedEmployeesPage() {
  return (
    <>
      <Head title="Employees" />
      <EmployeesPage />
    </>
  );
}

(WrappedEmployeesPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

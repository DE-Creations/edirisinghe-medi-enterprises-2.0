import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import { initialEmployees, nextEmployeeNumber, type Employee } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import SearchBar from '@/components/shared/SearchBar';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Plus, Edit, Trash2, User, Phone, MapPin, Mail, CreditCard, Briefcase, Calendar } from 'lucide-react';

function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [viewEmp, setViewEmp] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Employee>>({});

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.mobile.includes(search) ||
    e.employeeNumber.toLowerCase().includes(search.toLowerCase())
  );

  const roleOptions = [
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'cashier', label: 'Cashier' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const resetForm = () => setForm({});
  const closeForm = () => { setShowAdd(false); setEditEmp(null); resetForm(); };

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

  const openAdd = () => {
    setForm({ employeeNumber: nextEmployeeNumber(), status: 'active', role: 'cashier' });
    setShowAdd(true);
  };

  const openEdit = (emp: Employee) => { setForm(emp); setEditEmp(emp); };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search employees..." />
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Emp #</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Mobile</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">Designation</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Role</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => setViewEmp(emp)}
                  className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{emp.employeeNumber}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{emp.name}</p>
                        {emp.status === 'inactive' && (
                          <span className="text-[10px] text-destructive font-medium">Inactive</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{emp.mobile}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{emp.designation || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium capitalize">
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => openEdit(emp)} className="p-1.5 rounded-lg hover:bg-muted">
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(emp.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={showAdd || !!editEmp} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editEmp ? 'Update Employee' : 'Add Employee'}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {/* Row 1: Emp# (read-only) + Name */}
            <FloatingInput
              label="Employee Number"
              value={form.employeeNumber || ''}
              readOnly
              className="bg-muted/30 cursor-not-allowed"
              onChange={() => {}}
            />
            <FloatingInput
              label="Name"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            {/* Row 2: Mobile + Designation */}
            <FloatingInput
              label="Mobile"
              value={form.mobile || ''}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
            <FloatingInput
              label="Designation (optional)"
              value={form.designation || ''}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
            />

            {/* Row 3: Address (full width) */}
            <div className="sm:col-span-2">
              <FloatingInput
                label="Address"
                value={form.address || ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            {/* Row 4: NIC + Email */}
            <FloatingInput
              label="NIC"
              value={form.nic || ''}
              onChange={(e) => setForm({ ...form, nic: e.target.value })}
            />
            <FloatingInput
              label="Email"
              type="email"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {/* Row 5: Hire Date + Status */}
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground">Hire Date (optional)</p>
              <DatePicker
                value={form.hireDate || ''}
                onChange={(v) => setForm({ ...form, hireDate: v })}
                placeholder="Select hire date"
                className="w-full h-10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground">Status</p>
              <Combobox
                options={statusOptions}
                value={form.status || 'active'}
                onValueChange={(v) => setForm({ ...form, status: v as Employee['status'] })}
                placeholder="Select status..."
                searchPlaceholder="Search status..."
              />
            </div>

            {/* Row 6: Username + Role (aligned) */}
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground invisible">_</p>
              <FloatingInput
                label="Username"
                value={form.username || ''}
                autoComplete="new-password"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground">Role</p>
              <Combobox
                options={roleOptions}
                value={form.role || 'cashier'}
                onValueChange={(v) => setForm({ ...form, role: v as Employee['role'] })}
                placeholder="Select role..."
                searchPlaceholder="Search role..."
              />
            </div>

            {/* Password (add only) */}
            {!editEmp && (
              <div className="sm:col-span-2">
                <FloatingInput
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder=" "
                  onChange={() => {}}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
            <Button onClick={handleSave}>{editEmp ? 'Update' : 'Add'} Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── View Profile Dialog ── */}
      <Dialog open={!!viewEmp} onOpenChange={(open) => !open && setViewEmp(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Employee Profile</DialogTitle>
          </DialogHeader>
          {viewEmp && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  {viewEmp.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground">{viewEmp.employeeNumber}</p>
                  <h3 className="text-lg font-bold">{viewEmp.name}</h3>
                  {viewEmp.designation && (
                    <p className="text-sm text-muted-foreground">{viewEmp.designation}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium capitalize">
                      {viewEmp.role}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${viewEmp.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                      {viewEmp.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> {viewEmp.mobile}</div>
                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> {viewEmp.email}</div>
                <div className="flex items-center gap-2 text-sm col-span-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {viewEmp.address}</div>
                <div className="flex items-center gap-2 text-sm"><CreditCard className="h-4 w-4 text-muted-foreground" /> {viewEmp.nic}</div>
                <div className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-muted-foreground" /> @{viewEmp.username}</div>
                {viewEmp.hireDate && (
                  <div className="flex items-center gap-2 text-sm col-span-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Hired: {new Date(viewEmp.hireDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { setEmployees((prev) => prev.filter((e) => e.id !== deleteId)); setDeleteId(null); }}
      />
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

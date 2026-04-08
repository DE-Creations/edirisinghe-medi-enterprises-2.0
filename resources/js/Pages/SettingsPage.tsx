import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Sun, Moon, Shield, Building, Receipt } from 'lucide-react';

function SettingsPage() {
  const { isDark, toggle } = useTheme();
  const [vatPercent, setVatPercent] = useState('15');
  const [vatDate, setVatDate] = useState('2026-04-01');
  const [companyName, setCompanyName] = useState('PharmaPOS Pharmacy');
  const [companyAddress, setCompanyAddress] = useState('123 Health Street, Colombo 03');
  const [companyPhone, setCompanyPhone] = useState('+94 11 234 5678');

  const roles = [
    { role: 'Owner', permissions: ['Full Access', 'Manage Employees', 'View Reports', 'Settings', 'Billing', 'Products', 'Stock', 'GRN'] },
    { role: 'Admin', permissions: ['Manage Employees', 'Products', 'Stock', 'GRN', 'Customers', 'Suppliers', 'Billing'] },
    { role: 'Cashier', permissions: ['Billing', 'View Customers', 'Invoice History'] },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Theme */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">{isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-muted-foreground">Toggle between light and dark mode</p>
          </div>
          <button onClick={toggle} className={`relative h-7 w-12 rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-muted'}`}>
            <div className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Roles */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4" /> Roles & Permissions</h3>
        <div className="space-y-3">
          {roles.map((r) => (
            <div key={r.role} className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm font-semibold mb-2">{r.role}</p>
              <div className="flex flex-wrap gap-1">
                {r.permissions.map((p) => (
                  <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Company Profile */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Building className="h-4 w-4" /> Company Profile</h3>
        <div className="space-y-3">
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Company Name</label><Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label><Input value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Phone</label><Input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} /></div>
          <Button>Save Changes</Button>
        </div>
      </div>

      {/* VAT Settings */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Receipt className="h-4 w-4" /> VAT Settings</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Current VAT %</label><Input type="number" value={vatPercent} onChange={(e) => setVatPercent(e.target.value)} /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Effective Date</label><DatePicker value={vatDate} onChange={setVatDate} className="w-full" /></div>
        </div>
        <Button className="mt-3">Update VAT</Button>
      </div>
    </div>
  );
}


export default function WrappedSettingsPage() {
  return (
    <>
      <Head title="Settings" />
      <SettingsPage />
    </>
  );
}

(WrappedSettingsPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

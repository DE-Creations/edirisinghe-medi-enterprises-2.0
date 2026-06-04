import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import logoUrl from '../../../assets/logo.png';
import {
  LayoutDashboard, FileText, Package, ShoppingCart,
  Truck, ClipboardList, Settings, LogOut,
  ChevronLeft, ChevronRight, Pill, Receipt, History,
  UserCheck, Menu, TrendingUp, TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NotificationBell from './NotificationBell';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['owner', 'admin', 'cashier'] },
  { label: 'Invoice (POS)', path: '/invoice', icon: ShoppingCart, roles: ['owner', 'admin', 'cashier'] },
  { label: 'Invoice History', path: '/invoice-history', icon: History, roles: ['owner', 'admin', 'cashier'] },
  { label: 'GRN', path: '/grn', icon: ClipboardList, roles: ['owner', 'admin'] },
  { label: 'GRN History', path: '/grn-history', icon: FileText, roles: ['owner', 'admin'] },
  { label: 'Products', path: '/products', icon: Pill, roles: ['owner', 'admin'] },
  { label: 'Stock', path: '/stock', icon: Package, roles: ['owner', 'admin'] },
  { label: 'Customers', path: '/customers', icon: UserCheck, roles: ['owner', 'admin', 'cashier'] },
  { label: 'Suppliers', path: '/suppliers', icon: Truck, roles: ['owner', 'admin'] },
  { label: 'VAT Invoices', path: '/vat-invoices', icon: Receipt, roles: ['owner', 'admin'] },
  { label: 'Receivables', path: '/receivables', icon: TrendingUp, roles: ['owner', 'admin'] },
  { label: 'Payables', path: '/payables', icon: TrendingDown, roles: ['owner', 'admin'] },
  { label: 'Settings', path: '/settings', icon: Settings, roles: ['owner', 'admin'] },
];

interface SidebarContentProps {
  collapsed: boolean;
  filteredNav: NavItem[];
  onNavClick: () => void;
}

// Defined OUTSIDE AppLayout so React sees the same component type on every
// render — prevents unmount/remount loop.
function SidebarContent({ collapsed, filteredNav, onNavClick }: SidebarContentProps) {
  const { logout } = useAuth();
  const { url } = usePage();
  const pathname = url.split('?')[0];

  const handleLogout = () => {
    // logout();
    // router.visit('/login');
    router.post('/logout');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <img
          src={logoUrl}
          alt="Logo"
          className={cn('object-contain flex-shrink-0 transition-all duration-300', collapsed ? 'h-8 w-8' : 'h-10 w-10')}
        />
        {!collapsed && (
          <div className="animate-fade-in min-w-0">
            <h1 className="text-sm font-bold text-sidebar-primary-foreground leading-tight break-words">
              {import.meta.env.VITE_APP_NAME}
            </h1>
            <p className="text-[10px] text-sidebar-foreground">Management System</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {filteredNav.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onNavClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200',
                active
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
              {!collapsed && <span className="animate-fade-in">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-destructive hover:bg-destructive/10 w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { url } = usePage();
  const pathname = url.split('?')[0];

  const filteredNav = navItems.filter((n) => user && n.roles.includes(user.role));

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 relative',
          collapsed ? 'w-[68px]' : 'w-[240px]'
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          filteredNav={filteredNav}
          onNavClick={() => setMobileOpen(false)}
        />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-foreground/50" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-[240px] bg-sidebar z-50">
            <SidebarContent
              collapsed={false}
              filteredNav={filteredNav}
              onNavClick={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-semibold">
              {filteredNav.find((n) => n.path === pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground font-medium capitalize">
              {user?.role}
            </span>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
        <footer className="h-7 flex items-center justify-center border-t border-border bg-card flex-shrink-0">
          <p className="text-[10px] text-muted-foreground tracking-wide">Developed by DE Creations (PVT) LTD</p>
        </footer>
      </div>
    </div>
  );
}

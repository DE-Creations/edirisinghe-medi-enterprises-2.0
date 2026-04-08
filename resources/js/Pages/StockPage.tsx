import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import { initialProducts, type Product } from '@/data/mockData';
import SearchBar from '@/components/shared/SearchBar';
import Modal from '@/components/shared/Modal';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';

function StockPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [editProd, setEditProd] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [stockQty, setStockQty] = useState('');

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="w-full sm:w-72"><SearchBar value={search} onChange={setSearch} placeholder="Search stock..." /></div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Product</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Category</th>
            <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Stock</th>
            <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Reorder</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((p) => {
              const low = p.stock <= p.reorderLevel;
              return (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3"><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.brand}</p></td>
                  <td className="px-4 py-3 text-sm">{p.category}</td>
                  <td className="px-4 py-3 text-center text-sm font-bold">{p.stock}</td>
                  <td className="px-4 py-3 text-center text-sm text-muted-foreground">{p.reorderLevel}</td>
                  <td className="px-4 py-3">
                    {low ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                        <AlertTriangle className="h-3 w-3" /> Low
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">In Stock</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setEditProd(p); setStockQty(String(p.stock)); }} className="p-1.5 rounded-lg hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={!!editProd} onClose={() => setEditProd(null)} title="Update Stock" size="sm">
        {editProd && (
          <div className="space-y-3">
            <p className="text-sm font-medium">{editProd.name}</p>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Stock Quantity</label>
              <Input type="number" value={stockQty} onChange={(e) => setStockQty(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditProd(null)}>Cancel</Button>
              <Button onClick={() => { setProducts((prev) => prev.map((p) => p.id === editProd.id ? { ...p, stock: Number(stockQty) } : p)); setEditProd(null); }}>Update</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { setProducts((prev) => prev.filter((p) => p.id !== deleteId)); setDeleteId(null); }} />
    </div>
  );
}


export default function WrappedStockPage() {
  return (
    <>
      <Head title="Stock" />
      <StockPage />
    </>
  );
}

(WrappedStockPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

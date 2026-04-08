import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import { initialProducts, brands, categories, type Product } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchBar from '@/components/shared/SearchBar';
import Modal from '@/components/shared/Modal';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Plus, Edit, Trash2, Barcode } from 'lucide-react';

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editProd, setEditProd] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [brandList, setBrandList] = useState(brands);
  const [catList, setCatList] = useState(categories);
  const [newBrand, setNewBrand] = useState('');
  const [newCat, setNewCat] = useState('');
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search)
  );

  const handleSave = () => {
    if (editProd) {
      setProducts((prev) => prev.map((p) => p.id === editProd.id ? { ...p, ...form } as Product : p));
      setEditProd(null);
    } else {
      setProducts((prev) => [...prev, { ...form, id: String(Date.now()), stock: 0, reorderLevel: 10 } as Product]);
      setShowAdd(false);
    }
    setForm({});
  };

  const ProductForm = () => (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2 sm:col-span-1">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Product Name</label>
        <Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Barcode</label>
        <div className="flex gap-2">
          <Input value={form.barcode || ''} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
          <Button variant="outline" size="icon" onClick={() => setForm({ ...form, barcode: String(Math.floor(Math.random() * 9000000000) + 1000000000) })}><Barcode className="h-4 w-4" /></Button>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Brand</label>
        <div className="flex gap-1">
          <Select value={form.brand || ''} onValueChange={(v) => setForm({ ...form, brand: v })}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brandList.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => setShowNewBrand(true)}><Plus className="h-4 w-4" /></Button>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
        <div className="flex gap-1">
          <Select value={form.category || ''} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {catList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => setShowNewCat(true)}><Plus className="h-4 w-4" /></Button>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Selling Price</label>
        <Input type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Cost Price</label>
        <Input type="number" value={form.costPrice || ''} onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })} />
      </div>
      <div className="col-span-2">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
        <Input value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      {form.barcode && (
        <div className="col-span-2 p-3 bg-muted rounded-lg flex items-center gap-3">
          <Barcode className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Barcode Preview</p>
            <p className="text-lg font-mono tracking-widest">{form.barcode}</p>
          </div>
        </div>
      )}
      <div className="col-span-2 flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={() => { setShowAdd(false); setEditProd(null); setForm({}); }}>Cancel</Button>
        <Button onClick={handleSave}>{editProd ? 'Update' : 'Add'} Product</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-72"><SearchBar value={search} onChange={setSearch} placeholder="Search products..." /></div>
        <Button onClick={() => { setForm({}); setShowAdd(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Name</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Barcode</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Brand</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Category</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Price</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground hidden md:table-cell">{p.barcode}</td>
                  <td className="px-4 py-3 text-sm">{p.brand}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{p.category}</span></td>
                  <td className="px-4 py-3 text-sm font-semibold text-right">Rs. {p.price}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setForm(p); setEditProd(p); }} className="p-1.5 rounded-lg hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showAdd || !!editProd} onClose={() => { setShowAdd(false); setEditProd(null); setForm({}); }} title={editProd ? 'Update Product' : 'Add Product'} size="lg">
        <ProductForm />
      </Modal>

      <Modal open={showNewBrand} onClose={() => setShowNewBrand(false)} title="Add New Brand" size="sm">
        <div className="space-y-3">
          <Input value={newBrand} onChange={(e) => setNewBrand(e.target.value)} placeholder="Brand name" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewBrand(false)}>Cancel</Button>
            <Button onClick={() => { if (newBrand) { setBrandList((p) => [...p, newBrand]); setForm({ ...form, brand: newBrand }); setNewBrand(''); setShowNewBrand(false); } }}>Add</Button>
          </div>
        </div>
      </Modal>

      <Modal open={showNewCat} onClose={() => setShowNewCat(false)} title="Add New Category" size="sm">
        <div className="space-y-3">
          <Input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Category name" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewCat(false)}>Cancel</Button>
            <Button onClick={() => { if (newCat) { setCatList((p) => [...p, newCat]); setForm({ ...form, category: newCat }); setNewCat(''); setShowNewCat(false); } }}>Add</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { setProducts((prev) => prev.filter((p) => p.id !== deleteId)); setDeleteId(null); }} />
    </div>
  );
}


export default function WrappedProductsPage() {
  return (
    <>
      <Head title="Products" />
      <ProductsPage />
    </>
  );
}

(WrappedProductsPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

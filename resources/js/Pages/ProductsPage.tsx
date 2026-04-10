import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState } from 'react';
import { initialProducts, brands, categories, type Product } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import SearchBar from '@/components/shared/SearchBar';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Plus, Edit, Trash2, Barcode } from 'lucide-react';

const spinnerOff = '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProd, setEditProd] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [brandList, setBrandList] = useState(brands);
  const [catList, setCatList] = useState(categories);

  // Add brand/category dialogs
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [newCat, setNewCat] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm({}); setEditProd(null); setShowForm(true); };
  const openEdit = (p: Product) => { setForm(p); setEditProd(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditProd(null); setForm({}); };

  const handleSave = () => {
    if (!form.name || !form.brand || !form.category) return;
    if (editProd) {
      setProducts((prev) => prev.map((p) => p.id === editProd.id ? { ...p, ...form } as Product : p));
    } else {
      setProducts((prev) => [
        ...prev,
        { price: 0, costPrice: 0, stock: 0, reorderLevel: 10, mfgDate: '', expDate: '', barcode: '', description: '', ...form, id: String(Date.now()) } as Product,
      ]);
    }
    closeForm();
  };

  const handleAddBrand = () => {
    if (!newBrand.trim()) return;
    setBrandList((p) => [...p, newBrand.trim()]);
    setForm((f) => ({ ...f, brand: newBrand.trim() }));
    setNewBrand('');
    setShowNewBrand(false);
  };

  const handleAddCat = () => {
    if (!newCat.trim()) return;
    setCatList((p) => [...p, newCat.trim()]);
    setForm((f) => ({ ...f, category: newCat.trim() }));
    setNewCat('');
    setShowNewCat(false);
  };

  const brandOptions = brandList.map((b) => ({ value: b, label: b }));
  const catOptions = catList.map((c) => ({ value: c, label: c }));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Barcode</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Brand</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Category</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Stock</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground hidden md:table-cell">{p.barcode || '—'}</td>
                  <td className="px-4 py-3 text-sm">{p.brand}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{p.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-right">{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editProd ? 'Update Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {/* Product Name */}
            <div className="sm:col-span-2">
              <FloatingInput
                label="Product Name"
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Barcode */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <FloatingInput
                  label="Barcode"
                  value={form.barcode || ''}
                  onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                  className={spinnerOff}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                title="Generate barcode"
                onClick={() => setForm({ ...form, barcode: String(Math.floor(Math.random() * 9000000000) + 1000000000) })}
              >
                <Barcode className="h-4 w-4" />
              </Button>
            </div>

            {/* Reorder Level */}
            <div>
              <FloatingInput
                label="Reorder Level"
                type="number"
                value={form.reorderLevel ?? ''}
                onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) })}
                className={spinnerOff}
              />
            </div>

            {/* Brand */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Brand</p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Combobox
                    options={brandOptions}
                    value={form.brand || ''}
                    onValueChange={(v) => setForm({ ...form, brand: v })}
                    placeholder="Select brand"
                    searchPlaceholder="Search brands..."
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  title="Add new brand"
                  onClick={() => setShowNewBrand(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Category</p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Combobox
                    options={catOptions}
                    value={form.category || ''}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                    placeholder="Select category"
                    searchPlaceholder="Search categories..."
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  title="Add new category"
                  onClick={() => setShowNewCat(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Description</p>
              <Textarea
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Product description..."
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Barcode preview */}
            {form.barcode && (
              <div className="sm:col-span-2 p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                <Barcode className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Barcode Preview</p>
                  <p className="text-base font-mono tracking-widest">{form.barcode}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
            <Button onClick={handleSave}>{editProd ? 'Update' : 'Add'} Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Brand Dialog */}
      <Dialog open={showNewBrand} onOpenChange={(open) => !open && setShowNewBrand(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <FloatingInput
              label="Brand Name"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowNewBrand(false); setNewBrand(''); }}>Cancel</Button>
            <Button onClick={handleAddBrand}>Add Brand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Category Dialog */}
      <Dialog open={showNewCat} onOpenChange={(open) => !open && setShowNewCat(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <FloatingInput
              label="Category Name"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCat()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowNewCat(false); setNewCat(''); }}>Cancel</Button>
            <Button onClick={handleAddCat}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { setProducts((prev) => prev.filter((p) => p.id !== deleteId)); setDeleteId(null); }}
      />
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


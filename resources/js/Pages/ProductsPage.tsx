import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import BarcodeComponent from 'react-barcode';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';
import { Combobox } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import SearchBar from '@/components/shared/SearchBar';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Plus, Edit, Trash2, Barcode, AlertTriangle, Printer } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface UnitType {
  id: string;
  name: string;
}

interface Product {
  id: number;
  generic_name: string;
  sku: string;
  barcode_value: string;
  reorder_level: number;
  category_id: number;
  unit_type_id: number;
  brand_id: number;
  status: number;
  stock_batches_sum_current_quantity?: number;
  category?: Category;
  brand?: Brand;
  unit_type?: UnitType;
}

const spinnerOff = '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProd, setEditProd] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});

  const [showNewBrand, setShowNewBrand] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);
  const [showNewUnitType, setShowNewUnitType] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newUnitTypeName, setNewUnitTypeName] = useState('');

  const [printProduct, setPrintProduct] = useState<Product | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [copies, setCopies] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: `
            @page { size: 50mm 20mm; margin: 0; }
      html, body { margin: 0; padding: 0; background: white; }
    `,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [p, b, c, u] = await Promise.all([
        axios.get('/products/all'),
        axios.get('/brands/all'),
        axios.get('/categories/all'),
        axios.get('/unit-types/all'),
      ]);
      setProducts(p.data);
      setCategories(c.data);
      setBrands(b.data);
      setUnitTypes(u.data);
    } catch (error: any) {
      console.error('Fetch error:', error.response?.data);
    }
  };

  const filtered = products.filter((p) =>
    p.generic_name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode_value.includes(search) ||
    p.brand?.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm({ status: 1 }); setEditProd(null); setShowForm(true); };
  const openEdit = (p: Product) => { setForm(p); setEditProd(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditProd(null); setForm({}); };

  // Save product
  const handleSave = async () => {

    const payload = {
      generic_name: form.generic_name,
      sku: form.sku || `SKU-${Date.now()}`,
      barcode_value: form.barcode_value || String(Math.floor(Math.random() * 9000000000) + 1000000000),
      reorder_level: form.reorder_level,
      category_id: form.category_id,
      unit_type_id: form.unit_type_id,
      brand_id: form.brand_id,
      status: form.status ?? 1,
    };

    try {
      if (editProd) {
        const res = await axios.post(`/products/update/${editProd.id}`, payload);
        setProducts((prev) => prev.map((p) => p.id === editProd.id ? res.data : p));
      } else {
        const res = await axios.post('/products/store', payload);
        setProducts((prev) => [...prev, res.data]);
      }
      closeForm();

    } catch (error: any) {
      console.log('Save error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to save product.');
    }
  };

  // Delete product
  const handleDelete = async () => {
    try {
      await axios.delete(`/products/delete/${deleteId}`);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      console.log('Delete error:', error.response?.data);
    }
  };

  // Add new brand inline
  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return;
    try {
      const res = await axios.post('/brands/store', { name: newBrandName.trim() });
      setBrands((prev) => [...prev, res.data]);
      setForm((f) => ({ ...f, brand_id: res.data.id }));
      setNewBrandName('');
      setShowNewBrand(false);
    } catch (error: any) {
      console.log('Brand error:', error.response?.data);
    }
  };

  // Add new category inline
  const handleAddCat = async () => {
    if (!newCatName.trim()) return;
    try {
      const res = await axios.post('/categories/store', { name: newCatName.trim() });
      setCategories((prev) => [...prev, res.data]);
      setForm((f) => ({ ...f, category_id: res.data.id }));
      setNewCatName('');
      setShowNewCat(false);
    } catch (error: any) {
      console.log('Category error:', error.response?.data);
    }
  };

  // Add new unit type inline
  const handleAddUnitType = async () => {
    if (!newUnitTypeName.trim()) return;
    try {
      const res = await axios.post('/unit-types/store', { name: newUnitTypeName.trim() });
      setUnitTypes((prev) => [...prev, res.data]);
      setForm((f) => ({ ...f, unit_type_id: res.data.id }));
      setNewUnitTypeName('');
      setShowNewUnitType(false);
    } catch (error: any) {
      console.log('UnitType error:', error.response?.data);
    }
  };

  const brandOptions = brands.map((b) => ({ value: String(b.id), label: b.name }));
  const catOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));
  const unitTypeOptions = unitTypes.map((u) => ({ value: String(u.id), label: u.name }));


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
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Generic Name</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Barcode</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Brand</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Category</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Unit</th>
                                <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Qty</th>
                                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p) => {
                                const totalQty = p.stock_batches_sum_current_quantity ?? 0;
                                const isLow = totalQty < p.reorder_level;
                                return (
                                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                    <td className="px-4 py-3 text-sm font-medium">{p.generic_name}</td>
                                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground hidden md:table-cell">{p.barcode_value || '—'}</td>
                                    <td className="px-4 py-3 text-sm">{p.brand?.name}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                                            {p.category?.name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{p.unit_type?.name}</td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex flex-col items-center gap-0.5">
                                            <span className={`text-sm font-bold ${isLow ? 'text-destructive' : ''}`}>{totalQty}</span>
                                            {isLow && (
                                                <span className="inline-flex items-center gap-0.5 text-xs text-amber-600">
                                                    <AlertTriangle className="h-3 w-3" /> Low
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button onClick={() => { setPrintProduct(p); setShowPrintPreview(true); }}
                                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                                title="Print Barcode">
                                                <Printer className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => openEdit(p)}
                                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                                <Edit className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => setDeleteId(p.id)}
                                                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                        No products found.
                                    </td>
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

                        <div className="sm:col-span-2">
                            <FloatingInput label="Generic Name"
                                value={form.generic_name || ''}
                                onChange={(e) => setForm({ ...form, generic_name: e.target.value })} />
                        </div>

                        <div>
                            <FloatingInput label="SKU"
                                value={form.sku || ''}
                                onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                        </div>

                        <div className="flex gap-2 items-end">
                            <div className="flex-1">
                                <FloatingInput label="Barcode"
                                    value={form.barcode_value || ''}
                                    onChange={(e) => setForm({ ...form, barcode_value: e.target.value })}
                                    className={spinnerOff} />
                            </div>
                            <Button variant="outline" size="icon" className="shrink-0"
                                onClick={() => setForm({ ...form, barcode_value: String(Math.floor(Math.random() * 9000000000) + 1000000000) })}>
                                <Barcode className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="mt-auto">
                            <FloatingInput label="Reorder Level" type="number"
                                value={form.reorder_level ?? ''}
                                onChange={(e) => setForm({ ...form, reorder_level: Number(e.target.value) })}
                                className={spinnerOff} />
                        </div>

                        {/* Brand */}
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">Brand</p>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Combobox options={brandOptions}
                                        value={form.brand_id ? String(form.brand_id) : ''}
                                        onValueChange={(v) => setForm({ ...form, brand_id: Number(v) })}
                                        placeholder="Select brand" searchPlaceholder="Search brands..." />
                                </div>
                                <Button variant="outline" size="icon" onClick={() => setShowNewBrand(true)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">Category</p>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Combobox options={catOptions}
                                        value={form.category_id ? String(form.category_id) : ''}
                                        onValueChange={(v) => setForm({ ...form, category_id: Number(v) })}
                                        placeholder="Select category" searchPlaceholder="Search categories..." />
                                </div>
                                <Button variant="outline" size="icon" onClick={() => setShowNewCat(true)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Unit Type */}
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">Unit Type</p>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Combobox options={unitTypeOptions}
                                        value={form.unit_type_id ? String(form.unit_type_id) : ''}
                                        onValueChange={(v) => setForm({ ...form, unit_type_id: Number(v) })}
                                        placeholder="Select unit type" searchPlaceholder="Search unit types..." />
                                </div>
                                <Button variant="outline" size="icon" onClick={() => setShowNewUnitType(true)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Barcode preview */}
                        {form.barcode_value && (
                            <div className="sm:col-span-2 p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                                <Barcode className="h-5 w-5 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Barcode Preview</p>
                                    <p className="text-base font-mono tracking-widest">{form.barcode_value}</p>
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

            {/* Add Brand Dialog */}
            <Dialog open={showNewBrand} onOpenChange={(open) => !open && setShowNewBrand(false)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle>Add New Brand</DialogTitle></DialogHeader>
                    <div className="py-2">
                        <FloatingInput label="Brand Name" value={newBrandName}
                            onChange={(e) => setNewBrandName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()} autoFocus />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowNewBrand(false); setNewBrandName(''); }}>Cancel</Button>
                        <Button onClick={handleAddBrand}>Add Brand</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Category Dialog */}
            <Dialog open={showNewCat} onOpenChange={(open) => !open && setShowNewCat(false)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle>Add New Category</DialogTitle></DialogHeader>
                    <div className="py-2">
                        <FloatingInput label="Category Name" value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCat()} autoFocus />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowNewCat(false); setNewCatName(''); }}>Cancel</Button>
                        <Button onClick={handleAddCat}>Add Category</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Unit Type Dialog */}
            <Dialog open={showNewUnitType} onOpenChange={(open) => !open && setShowNewUnitType(false)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle>Add New Unit Type</DialogTitle></DialogHeader>
                    <div className="py-2">
                        <FloatingInput label="Unit Type Name" value={newUnitTypeName}
                            onChange={(e) => setNewUnitTypeName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddUnitType()} autoFocus />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowNewUnitType(false); setNewUnitTypeName(''); }}>Cancel</Button>
                        <Button onClick={handleAddUnitType}>Add Unit Type</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Hidden print target — exact 50mm×20mm per label, off-screen */}
            <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
                <div ref={printRef}>
                    {printProduct && Array.from({ length: copies }).map((_, i) => (
                        <div key={i} style={{
                            width: '50mm', height: '20mm',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            pageBreakAfter: i < copies - 1 ? 'always' : 'avoid',
                            breakAfter: i < copies - 1 ? 'page' : 'avoid',
                        }}>
                            <div style={{
                                width: '46mm',
                                height: '16mm',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}>
                                <div style={{ fontSize: '4pt', color: '#888', textAlign: 'center', lineHeight: 1, marginBottom: '0.6mm', textTransform: 'lowercase', width: '100%' }}>
                                    Edirisinghe Medi Enterprises
                                </div>
                                <div style={{ fontSize: '5.5pt', fontWeight: 700, textAlign: 'center', lineHeight: 1.1, color: 'black', marginBottom: '0.6mm', maxWidth: '100%', wordBreak: 'break-word' }}>
                                    {printProduct.generic_name}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                    <BarcodeComponent
                                        value={printProduct.barcode_value}
                                        width={1.1}
                                        height={27}
                                        fontSize={6}
                                        margin={0}
                                        background="#ffffff"
                                        displayValue={true} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Print Barcode Dialog — visual preview + copies */}
            <Dialog open={showPrintPreview} onOpenChange={(open) => { if (!open) { setShowPrintPreview(false); setCopies(1); } }}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle>Print Barcode Label</DialogTitle></DialogHeader>
                    <div className="flex items-center justify-center p-6 bg-muted/40 rounded-lg">
                        {printProduct ? (
                            <div style={{
                                width: '220px', height: '96px',
                                background: 'white',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '8px 10px',
                                boxSizing: 'border-box',
                                overflow: 'hidden',
                            }}>
                                <span style={{ fontSize: '8px', color: '#9ca3af', textAlign: 'center', lineHeight: 1, marginBottom: '4px', textTransform: 'lowercase', display: 'block', width: '100%' }}>Edirisinghe Medi Enterprises</span>
                                <span style={{ fontSize: '12px', fontWeight: 700, textAlign: 'center', lineHeight: 1.1, color: '#000', marginBottom: '5px', wordBreak: 'break-word', display: 'block', width: '100%' }}>{printProduct.generic_name}</span>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                        <BarcodeComponent
                                            value={printProduct.barcode_value}
                                            width={1.49}
                                            height={38}
                                            fontSize={9}
                                            margin={0}
                                            background="#ffffff"
                                            displayValue={true} />
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No product selected.</p>
                        )}
                    </div>
                    <div className="flex items-center gap-3 px-1">
                        <span className="text-sm text-muted-foreground shrink-0">Copies</span>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={copies}
                            onChange={(e) => setCopies(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                            className="w-20 border border-input rounded-md px-2 py-1 text-sm text-center bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                        <span className="text-xs text-muted-foreground">(max 100)</span>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowPrintPreview(false); setCopies(1); }}>Close</Button>
                        <Button onClick={handlePrint} disabled={!printProduct}><Printer className="h-4 w-4 mr-2" />Print {copies > 1 ? `${copies} Labels` : 'Label'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
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


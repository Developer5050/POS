"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Package, ChevronUp, ChevronDown } from 'lucide-react';
import { products as initialProducts, categories as initialCategories, type Product, type Category } from '@/data/mockdata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SortConfig = {
    key: keyof Product | null;
    direction: 'asc' | 'desc';
};


export default function Products() {
    const [productsList, setProductsList] = useState<Product[]>(initialProducts);
    const [categoriesList, setCategoriesList] = useState<Category[]>(initialCategories);
    const [selectedCat, setSelectedCat] = useState<string>('All');
    const [search, setSearch] = useState('');
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [showProductDialog, setShowProductDialog] = useState(false);
    const [showCatDialog, setShowCatDialog] = useState(false);
    const [catName, setCatName] = useState('');
    const [editCat, setEditCat] = useState<Category | null>(null);

    const [form, setForm] = useState<Partial<Product>>({
        name: '', category: '', purchasePrice: 0, salePrice: 0, stock: 0, supplier: ''
    });

    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

    const sortedProducts = [...productsList].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const key = sortConfig.key;
        const valA = a[key];
        const valB = b[key];

        if (typeof valA === 'string' && typeof valB === 'string') {
            return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }
        return 0;
    });

    const requestSort = (key: keyof Product) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const filteredProducts = productsList.filter(p =>
        (selectedCat === 'All' || p.category === selectedCat) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const openNewProduct = () => {
        setEditProduct(null);
        setForm({ name: '', category: categoriesList[0]?.name || '', purchasePrice: 0, salePrice: 0, stock: 0, supplier: '' });
        setShowProductDialog(true);
    };

    const openEditProduct = (p: Product) => {
        setEditProduct(p);
        setForm(p);
        setShowProductDialog(true);
    };

    const saveProduct = () => {
        if (editProduct) {
            setProductsList(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...form } as Product : p));
        } else {
            const newP: Product = { id: Date.now().toString(), ...form } as Product;
            setProductsList(prev => [...prev, newP]);
        }
        setShowProductDialog(false);
    };

    const deleteProduct = (id: string) => {
        setProductsList(prev => prev.filter(p => p.id !== id));
    };

    const saveCat = () => {
        if (editCat) {
            setCategoriesList(prev => prev.map(c => c.id === editCat.id ? { ...c, name: catName } : c));
        } else {
            setCategoriesList(prev => [...prev, { id: Date.now().toString(), name: catName, productCount: 0 }]);
        }
        setShowCatDialog(false);
        setCatName('');
        setEditCat(null);
    };

    const deleteCat = (id: string) => {
        setCategoriesList(prev => prev.filter(c => c.id !== id));
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header flex items-center justify-between">
                <h1 className="page-title mt-2">Products</h1>

                <Button
                    onClick={openNewProduct}
                    size="sm"
                    className="bg-[#27AA83] hover:bg-[#219a75] text-white flex items-center gap-1 mt-2 text-[13px]"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Product
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
                {/* Categories */}
                <div className="stat-card h-fit mt-6 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">

                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold">Categories</h3>

                        <Dialog open={showCatDialog} onOpenChange={setShowCatDialog}>
                            <DialogTrigger asChild>
                                <button
                                    className="text-[#27AA83] hover:underline text-xs"
                                    onClick={() => { setEditCat(null); setCatName(''); }}
                                >
                                    + Add
                                </button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editCat ? 'Edit' : 'Add'} Category</DialogTitle>
                                </DialogHeader>

                                <Input
                                    value={catName}
                                    onChange={e => setCatName(e.target.value)}
                                    placeholder="Category name"
                                />

                                <Button
                                    onClick={saveCat}
                                    className="mt-2 bg-[#27AA83] hover:bg-[#219a75] text-white"
                                >
                                    Save
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-1">

                        {/* All Products */}
                        <button
                            onClick={() => setSelectedCat('All')}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
      ${selectedCat === 'All'
                                    ? 'bg-[#27AA83] text-white'
                                    : 'hover:bg-muted'
                                }`}
                        >
                            All Products
                        </button>

                        {/* Category List */}
                        {categoriesList.map(c => (
                            <div key={c.id} className="flex items-center group">

                                <button
                                    onClick={() => setSelectedCat(c.name)}
                                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors
          ${selectedCat === c.name
                                            ? 'bg-[#27AA83] text-white'
                                            : 'hover:bg-muted'
                                        }`}
                                >
                                    {c.name}
                                </button>

                                <div className="hidden group-hover:flex gap-1 pr-1">

                                    <button
                                        onClick={() => {
                                            setEditCat(c);
                                            setCatName(c.name);
                                            setShowCatDialog(true);
                                        }}
                                    >
                                        <Edit2 className="w-3 h-3 text-muted-foreground" />
                                    </button>

                                    <button onClick={() => deleteCat(c.id)}>
                                        <Trash2 className="w-3 h-3 text-destructive" />
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

                {/* Products Grid */}
                <div>
                    {/* Search Field */}
                    <div className="mb-6 flex gap-3 mt-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                className="search-input w-full pl-10 border border-[#27AA83] dark:border-zinc-700 rounded-lg p-2"
                                placeholder="Search products by name..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="stat-card bg-white dark:bg-zinc-900 rounded-lg p-2 shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-x-auto">
                        <table className="w-full min-w-[600px] text-sm text-left">
                            <thead className="border-b border-zinc-200 dark:border-zinc-700">
                                <tr>
                                    {['name', 'category', 'purchasePrice', 'salePrice', 'stock'].map((col) => (
                                        <th
                                            key={col}
                                            className="px-3 py-2 cursor-pointer select-none"
                                            onClick={() => requestSort(col as keyof Product)}
                                        >
                                            <div className="flex items-center gap-1">
                                                {col === 'name' && 'Product'}
                                                {col === 'category' && 'Category'}
                                                {col === 'purchasePrice' && 'Buy Price'}
                                                {col === 'salePrice' && 'Sell Price'}
                                                {col === 'stock' && 'Stock'}
                                                {sortConfig.key === col && (
                                                    sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-3 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedProducts.map(p => (
                                    <tr key={p.id} className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-muted">
                                        <td className="px-3 py-2 font-medium">{p.name}</td>
                                        <td className="px-3 py-2 text-muted-foreground">{p.category}</td>
                                        <td className="px-3 py-2">${p.purchasePrice}</td>
                                        <td className="px-3 py-2 text-primary">${p.salePrice}</td>
                                        <td className={`px-3 py-2 font-semibold ${p.stock < 15 ? 'text-destructive' : ''}`}>{p.stock}</td>
                                        <td className="px-3 py-2 flex gap-2">
                                            <button onClick={() => openEditProduct(p)} className="p-1 rounded hover:bg-muted">
                                                <Edit2 className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                            <button onClick={() => deleteProduct(p.id)} className="p-1 rounded hover:bg-muted">
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Product Dialog */}
            {/* <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editProduct ? 'Edit' : 'Add'} Product</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categoriesList.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Purchase Price</Label><Input type="number" value={form.purchasePrice || 0} onChange={e => setForm({ ...form, purchasePrice: +e.target.value })} /></div>
              <div><Label>Sale Price</Label><Input type="number" value={form.salePrice || 0} onChange={e => setForm({ ...form, salePrice: +e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Stock</Label><Input type="number" value={form.stock || 0} onChange={e => setForm({ ...form, stock: +e.target.value })} /></div>
              <div><Label>Supplier</Label><Input value={form.supplier || ''} onChange={e => setForm({ ...form, supplier: e.target.value })} /></div>
            </div>
            <Button onClick={saveProduct} className="w-full">Save Product</Button>
          </div>
        </DialogContent>
      </Dialog> */}
        </motion.div>
    );
}

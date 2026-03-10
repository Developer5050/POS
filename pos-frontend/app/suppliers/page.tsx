"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, ShoppingBag } from 'lucide-react';
import { suppliers as initialSuppliers, products as allProducts, type Supplier } from '@/data/mockdata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function Suppliers() {
  const [list, setList] = useState<Supplier[]>(initialSuppliers);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState<Partial<Supplier>>({ name: '', phone: '', address: '', company: '' });
  const [showPurchase, setShowPurchase] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({ supplierId: '', productId: '', qty: 1, purchasePrice: 0, salePrice: 0 });

  const filtered = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.company.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setEditing(null); setForm({ name: '', phone: '', address: '', company: '' }); setShowDialog(true); };
  const openEdit = (s: Supplier) => { setEditing(s); setForm(s); setShowDialog(true); };

  const save = () => {
    if (editing) {
      setList(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } as Supplier : s));
    } else {
      setList(prev => [...prev, { id: Date.now().toString(), ...form } as Supplier]);
    }
    setShowDialog(false);
  };

  const savePurchase = () => {
    toast.success(`Stock increased by ${purchaseForm.qty} units`);
    setShowPurchase(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1 className="page-title">Suppliers</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowPurchase(true)} variant="outline" size="sm"><ShoppingBag className="w-4 h-4 mr-1" /> New Purchase</Button>
          <Button onClick={openNew} size="sm"><Plus className="w-4 h-4 mr-1" /> Add Supplier</Button>
        </div>
      </div>

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input className="search-input w-full pl-10" placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="stat-card overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Company</th><th>Phone</th><th>Address</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td className="font-medium">{s.name}</td>
                <td>{s.company}</td>
                <td>{s.phone}</td>
                <td className="text-muted-foreground">{s.address}</td>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded hover:bg-muted"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setList(prev => prev.filter(x => x.id !== s.id))} className="p-1.5 rounded hover:bg-muted"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Supplier</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Company</Label><Input value={form.company || ''} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Address</Label><Input value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
            <Button onClick={save} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPurchase} onOpenChange={setShowPurchase}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Purchase</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Supplier</Label>
              <Select value={purchaseForm.supplierId} onValueChange={v => setPurchaseForm({ ...purchaseForm, supplierId: v })}>
                <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                <SelectContent>{list.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - {s.company}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Product</Label>
              <Select value={purchaseForm.productId} onValueChange={v => setPurchaseForm({ ...purchaseForm, productId: v })}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>{allProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Quantity</Label><Input type="number" value={purchaseForm.qty} onChange={e => setPurchaseForm({ ...purchaseForm, qty: +e.target.value })} /></div>
              <div><Label>Buy Price</Label><Input type="number" value={purchaseForm.purchasePrice} onChange={e => setPurchaseForm({ ...purchaseForm, purchasePrice: +e.target.value })} /></div>
              <div><Label>Sell Price</Label><Input type="number" value={purchaseForm.salePrice} onChange={e => setPurchaseForm({ ...purchaseForm, salePrice: +e.target.value })} /></div>
            </div>
            <Button onClick={savePurchase} className="w-full">Save Purchase</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

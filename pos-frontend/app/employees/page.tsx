"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { employees as initialEmployees, type Employee } from '@/data/mockdata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function Employees() {
  const [list, setList] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState<Partial<Employee>>({ name: '', phone: '', position: '', salary: 0, joiningDate: '' });

  const filtered = list.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setEditing(null); setForm({ name: '', phone: '', position: '', salary: 0, joiningDate: '' }); setShowDialog(true); };
  const openEdit = (e: Employee) => { setEditing(e); setForm(e); setShowDialog(true); };

  const save = () => {
    if (editing) {
      setList(prev => prev.map(e => e.id === editing.id ? { ...e, ...form } as Employee : e));
    } else {
      setList(prev => [...prev, { id: Date.now().toString(), ...form } as Employee]);
    }
    setShowDialog(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1 className="page-title">Employees</h1>
        <Button onClick={openNew} size="sm"><Plus className="w-4 h-4 mr-1" /> Add Employee</Button>
      </div>

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input className="search-input w-full pl-10" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(e => (
          <div key={e.id} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold">{e.name}</p>
                <span className="badge-info">{e.position}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(e)} className="p-1 rounded hover:bg-muted"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => setList(prev => prev.filter(x => x.id !== e.id))} className="p-1 rounded hover:bg-muted"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
              </div>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{e.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Salary</span><span className="font-semibold">${e.salary.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span>{e.joiningDate}</span></div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Employee</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Position</Label><Input value={form.position || ''} onChange={e => setForm({ ...form, position: e.target.value })} /></div>
            <div><Label>Salary</Label><Input type="number" value={form.salary || 0} onChange={e => setForm({ ...form, salary: +e.target.value })} /></div>
            <div><Label>Joining Date</Label><Input type="date" value={form.joiningDate || ''} onChange={e => setForm({ ...form, joiningDate: e.target.value })} /></div>
            <Button onClick={save} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

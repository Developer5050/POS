"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { employees as initialEmployees, type Employee } from '@/data/mockdata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      <div className="page-header flex items-center justify-between">
        <h1 className="page-title text-[18px] font-bold mt-1">Employees</h1>
        <Button
          onClick={openNew}
          size="sm"
          className="bg-[#27AA83] hover:bg-[#219a75] text-white flex items-center gap-1 text-[13px] mt-1"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      <div className="mb-4 relative max-w-md mt-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input className="search-input w-full pl-10 py-2.5 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83] text-[13px] mt-0.5 rounded-lg p-2" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-md">
        <table className="min-w-full">

          {/* Table Header */}
          <thead className="bg-[#27AA83] text-white">
            <tr>
              <th className="px-4 py-2 text-left rounded-tl-md">Name</th>
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Salary</th>
              <th className="px-4 py-2 text-left">Joined</th>
              <th className="px-4 py-2 text-right rounded-tr-md">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y">
            {filtered.map((e) => (
              <tr key={e.id} className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">

                <td className="px-4 py-2 text-[14px]">{e.name}</td>

                <td className="px-4 py-2 text-[14px]">
                  <span className="badge-info">{e.position}</span>
                </td>

                <td className="px-4 py-2 text-[14px]">{e.phone}</td>

                <td className="px-4 py-2 text-[14px]">
                  ${e.salary.toLocaleString()}
                </td>

                <td className="px-4 py-2 text-[14px]">{e.joiningDate}</td>

                <td className="px-4 py-2 flex justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => openEdit(e)}
                          className="p-1"
                        >
                          <Edit2 className="w-4 h-4 text-black cursor-pointer" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                        Edit Employee
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setList((prev) => prev.filter((x) => x.id !== e.id))}
                          className="p-1"
                        >
                          <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                        Delete Employee
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Add'} Employee</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">

            <div>
              <Label>Name <span className="text-red-500">*</span></Label>
              <Input
                className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83] "
                value={form.name || ''}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Phone <span className="text-red-500">*</span></Label>
              <Input
                className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83] "
                value={form.phone || ''}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div>
              <Label>Position <span className="text-red-500">*</span></Label>
              <Input
                className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83] "
                value={form.position || ''}
                onChange={e => setForm({ ...form, position: e.target.value })}
              />
            </div>

            <div>
              <Label>Salary <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83] "
                value={form.salary || 0}
                onChange={e => setForm({ ...form, salary: +e.target.value })}
              />
            </div>

            <div>
              <Label>Joining Date <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83] "
                value={form.joiningDate || ''}
                onChange={e => setForm({ ...form, joiningDate: e.target.value })}
              />
            </div>

            <Button
              className="w-full bg-[#27AA83] hover:bg-[#21976f] text-white"
              onClick={save}
            >
              Save
            </Button>

          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

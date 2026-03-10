"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { expenses as initialExpenses, orders, products, type Expense } from '@/data/mockdata';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Expenses() {
  const [expenseList, setExpenseList] = useState<Expense[]>(initialExpenses);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<Partial<Expense>>({ category: 'Miscellaneous', description: '', amount: 0, date: '2026-03-06' });

  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const totalPurchaseCost = orders.reduce((s, o) => s + o.items.reduce((si, i) => {
    const p = products.find(x => x.id === i.productId);
    return si + (p ? p.purchasePrice * i.quantity : 0);
  }, 0), 0);
  const totalExpenses = expenseList.reduce((s, e) => s + e.amount, 0);
  const profit = totalSales - totalPurchaseCost - totalExpenses;

  const salesRecords = orders.flatMap(o => o.items.map(i => {
    const p = products.find(x => x.id === i.productId);
    return {
      name: i.productName,
      date: o.date,
      salePrice: i.price,
      purchasePrice: p?.purchasePrice || 0,
      profit: i.total - (p ? p.purchasePrice * i.quantity : 0),
    };
  }));

  const chartData = [
    { name: 'Sales', amount: totalSales },
    { name: 'Purchase Cost', amount: totalPurchaseCost },
    { name: 'Expenses', amount: totalExpenses },
    { name: profit >= 0 ? 'Profit' : 'Loss', amount: Math.abs(profit) },
  ];

  const save = () => {
    setExpenseList(prev => [...prev, { id: Date.now().toString(), ...form } as Expense]);
    setShowDialog(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1 className="page-title">Expenses & Profit</h1>
        <Button onClick={() => setShowDialog(true)} size="sm"><Plus className="w-4 h-4 mr-1" /> Add Expense</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Total Sales</span></div>
          <p className="text-xl font-bold">${totalSales.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-warning" /><span className="text-xs text-muted-foreground">Purchase Cost</span></div>
          <p className="text-xl font-bold">${totalPurchaseCost.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-destructive" /><span className="text-xs text-muted-foreground">Expenses</span></div>
          <p className="text-xl font-bold">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            {profit >= 0 ? <TrendingUp className="w-4 h-4 text-success" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
            <span className="text-xs text-muted-foreground">Profit / Loss</span>
          </div>
          <p className={`text-xl font-bold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
            {profit >= 0 ? '+' : '-'}${Math.abs(profit).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="stat-card mb-6">
        <h3 className="text-sm font-semibold mb-4">Monthly Summary</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="amount" fill="hsl(162, 63%, 41%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Records */}
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-3">Sales Records</h3>
          <table className="data-table">
            <thead><tr><th>Product</th><th>Date</th><th>Sale</th><th>Cost</th><th>Profit</th></tr></thead>
            <tbody>
              {salesRecords.map((r, i) => (
                <tr key={i}>
                  <td className="font-medium">{r.name}</td>
                  <td className="text-muted-foreground">{r.date}</td>
                  <td>${r.salePrice}</td>
                  <td>${r.purchasePrice}</td>
                  <td className={r.profit >= 0 ? 'text-success font-medium' : 'text-destructive font-medium'}>${r.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Other Expenses */}
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-3">Other Expenses</h3>
          <table className="data-table">
            <thead><tr><th>Category</th><th>Description</th><th>Amount</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {expenseList.map(e => (
                <tr key={e.id}>
                  <td><span className="badge-info">{e.category}</span></td>
                  <td>{e.description}</td>
                  <td className="font-semibold">${e.amount.toLocaleString()}</td>
                  <td className="text-muted-foreground">{e.date}</td>
                  <td><button onClick={() => setExpenseList(prev => prev.filter(x => x.id !== e.id))} className="p-1 rounded hover:bg-muted"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Salary', 'Rent', 'Electricity', 'Maintenance', 'Miscellaneous'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Description</Label><Input value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Amount</Label><Input type="number" value={form.amount || 0} onChange={e => setForm({ ...form, amount: +e.target.value })} /></div>
            <div><Label>Date</Label><Input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <Button onClick={save} className="w-full">Save Expense</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

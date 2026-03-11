"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { expenses as initialExpenses, orders, products, type Expense } from '@/data/mockdata';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      <div className="page-header flex items-center justify-between">
        <h1 className="page-title text-[18px] font-bold mt-1">Expenses & Profit</h1>
        <Button
          onClick={() => setShowDialog(true)}
          size="sm"
          className="bg-[#27AA83] hover:bg-[#219a75] text-white flex items-center gap-1 text-[13px] mt-1"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-5">

        {/* Total Sales */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-[12px] font-medium text-muted-foreground">Total Sales</span>
          </div>
          <p className="text-[16px] font-bold mt-1">
            ${totalSales.toLocaleString()}
          </p>
        </div>

        {/* Purchase Cost */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <DollarSign className="w-4 h-4 text-orange-500" />
            <span className="text-[12px] font-medium text-muted-foreground">Purchase Cost</span>
          </div>
          <p className="text-[16px] font-bold mt-1">
            ${totalPurchaseCost.toLocaleString()}
          </p>
        </div>

        {/* Expenses */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <DollarSign className="w-4 h-4 text-red-500" />
            <span className="text-[12px] font-medium text-muted-foreground">Expenses</span>
          </div>
          <p className="text-[16px] font-bold mt-1">
            ${totalExpenses.toLocaleString()}
          </p>
        </div>

        {/* Profit / Loss */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            {profit >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className="text-[12px] font-medium text-muted-foreground">Profit / Loss</span>
          </div>

          <p className={`text-[16px] font-bold mt-1 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profit >= 0 ? '+' : '-'}${Math.abs(profit).toLocaleString()}
          </p>
        </div>

      </div>

      {/* Chart */}
      <div className="stat-card mb-6 border border-gray-200 rounded-lg p-4">
        <h3 className="text-[14px] font-bold text-muted-foreground mb-4">Monthly Summary</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Bar dataKey="amount" fill="hsl(162, 63%, 41%)" radius={[4, 4, 0, 0]} />
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                  Monthly Summary
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Sales Records */}
        <div className="overflow-x-auto bg-white shadow rounded-md border border-gray-200">

          <div className="px-4 py-3 font-bold text-gray-700">
            Sales Records
          </div>

          <table className="min-w-full">
            <thead className="bg-[#27AA83] text-white">
              <tr>
                <th className="px-4 py-2 text-[14px] font-bold text-left rounded-tl-md">Product</th>
                <th className="px-4 py-2 text-[14px] font-bold text-left">Sale</th>
                <th className="px-4 py-2 text-[14px] font-bold text-left">Cost</th>
                <th className="px-4 py-2 text-[14px] font-bold text-left">Profit</th>
                <th className="px-4 py-2 text-[14px] font-bold text-left rounded-tr-md">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {salesRecords.map((r, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-[14px]">{r.name}</td>
                  <td className="px-4 py-3 text-[14px]">${r.salePrice}</td>
                  <td className="px-4 py-3 text-[14px]">${r.purchasePrice}</td>
                  <td className={`px-4 py-3 text-[14px] ${r.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${r.profit.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-[14px]">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>


        {/* Other Expenses */}
        <div className="overflow-x-auto bg-white shadow rounded-md border border-gray-200">

          <div className="px-4 py-3 font-bold text-gray-700">
            Other Expenses
          </div>

          <table className="min-w-full">
            <thead className="bg-[#27AA83] text-white">
              <tr>
                <th className="px-4 py-2 text-[14px] font-bold text-left rounded-tl-md">Category</th>
                <th className="px-4 py-2 text-[14px] font-bold text-left">Description</th>
                <th className="px-4 py-2 text-[14px] font-bold text-left">Amount</th>
                <th className="px-4 py-2 text-[14px] font-bold text-left">Date</th>
                <th className="px-4 py-2 text-[14px] font-bold text-right rounded-tr-md">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {expenseList.map((e) => (
                <tr key={e.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-1 text-[14px]">
                    {e.category}
                  </td>

                  <td className="px-4 py-1 text-[14px]">{e.description}</td>

                  <td className="px-4 py-1 text-[14px]">
                    ${e.amount.toLocaleString()}
                  </td>

                  <td className="px-4 py-1 text-[14px]">{e.date}</td>

                  <td className="px-4 py-1 mt-2 text-[14px] flex justify-end">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() =>
                              setExpenseList((prev) =>
                                prev.filter((x) => x.id !== e.id)
                              )
                            }
                            className="p-1"
                          >
                            <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                          Delete Expense
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">

            {/* Category */}
            <div>
              <Label className="text-[14px]">
                Category <span className="text-red-500">*</span>
              </Label>

              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent className="bg-white border border-gray-200 shadow-md text-[14px]">
                  {['Salary', 'Rent', 'Electricity', 'Maintenance', 'Miscellaneous'].map(
                    (c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="text-[14px] hover:bg-gray-100 cursor-pointer"
                      >
                        {c}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label className="text-[14px]">
                Description <span className="text-red-500">*</span>
              </Label>
              <Input
                className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
                value={form.description || ''}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {/* Amount */}
            <div>
              <Label className="text-[14px]">
                Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
                value={form.amount || 0}
                onChange={(e) =>
                  setForm({ ...form, amount: +e.target.value })
                }
              />
            </div>

            {/* Date */}
            <div>
              <Label className="text-[14px]">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
                value={form.date || ''}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />
            </div>

            {/* Button */}
            <Button
              onClick={save}
              className="w-full bg-[#27AA83] hover:bg-[#21976f] text-white"
            >
              Save Expense
            </Button>

          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

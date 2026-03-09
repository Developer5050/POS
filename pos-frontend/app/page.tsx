"use client";

import { motion } from 'framer-motion';
import {
  Package, Users, Truck, ShoppingCart, TrendingUp, TrendingDown, DollarSign, Calendar
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { products, customers, suppliers, orders, expenses, salesData, monthlySalesData } from '@/data/mockdata';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const todaySales = orders.filter(o => o.date === '2026-03-06').reduce((s, o) => s + o.total, 0);
  const monthlySales = orders.reduce((s, o) => s + o.total, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalPurchaseCost = orders.reduce((s, o) => s + o.items.reduce((si, i) => {
    const prod = products.find(p => p.id === i.productId);
    return si + (prod ? prod.purchasePrice * i.quantity : 0);
  }, 0), 0);
  const profit = monthlySales - totalPurchaseCost - totalExpenses;

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, bgColor: 'bg-green-200', iconColor: 'text-green-600' },
    { label: 'Total Customers', value: customers.length, icon: Users, bgColor: 'bg-blue-200', iconColor: 'text-blue-600' },
    { label: 'Total Suppliers', value: suppliers.length, icon: Truck, bgColor: 'bg-yellow-200', iconColor: 'text-yellow-600' },
    { label: "Today's Sales", value: `$${todaySales.toLocaleString()}`, icon: ShoppingCart, bgColor: 'bg-teal-200', iconColor: 'text-teal-600' },
    { label: 'Monthly Sales', value: `$${monthlySales.toLocaleString()}`, icon: DollarSign, bgColor: 'bg-indigo-200', iconColor: 'text-indigo-600' },
    { label: 'Total Expenses', value: `$${totalExpenses.toLocaleString()}`, icon: Calendar, bgColor: 'bg-red-200', iconColor: 'text-red-600' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={item}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 mt-4"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="stat-card bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.bgColor}`}>
                <s.icon className={`w-4 h-4 ${s.iconColor}`} />
              </div>
            </div>
            <p className="text-[12px] font-medium text-muted-foreground">{s.label}</p>
            <p className="text-lg font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Profit/Loss Banner */}
      <motion.div
        variants={item}
        className="stat-card bg-white dark:bg-zinc-900 rounded-lg p-4 mb-6 flex items-center gap-4 shadow-sm border border-zinc-200 dark:border-zinc-700"
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${profit >= 0 ? "bg-green-200" : "bg-red-200"
            }`}
        >
          {profit >= 0 ? (
            <TrendingUp className="w-5 h-5 text-green-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-600" />
          )}
        </div>
        <div>
          <p className="text-[12px] font-medium text-muted-foreground">Monthly Profit / Loss</p>
          <p
            className={`text-lg font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"
              }`}
          >
            {profit >= 0 ? "+" : ""}
            ${profit.toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          variants={item}
          className="stat-card bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700"
        >
          <h3 className="text-sm font-semibold mb-4">Daily Sales</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(162, 63%, 41%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(162, 63%, 41%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="hsl(162, 63%, 41%)"
                fill="url(#salesGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          variants={item}
          className="stat-card bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700"
        >
          <h3 className="text-sm font-semibold mb-4">Monthly Sales vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <Tooltip />
              <Bar dataKey="sales" fill="hsl(162, 63%, 41%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
  variants={item}
  className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700"
>
  <h3 className="text-sm font-semibold mb-4">Recent Orders</h3>

  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      
      {/* Table Header */}
      <thead className="text-xs uppercase text-zinc-500 border-b border-zinc-200 dark:border-zinc-700">
        <tr>
          <th className="py-3 text-left font-semibold">Invoice</th>
          <th className="py-3 text-left font-semibold">Customer</th>
          <th className="py-3 text-left font-semibold">Date</th>
          <th className="py-3 text-left font-semibold">Amount</th>
          <th className="py-3 text-left font-semibold">Status</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody>
        {orders.slice(0, 5).map((o) => (
          <tr
            key={o.id}
            className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            <td className="py-3 font-mono text-xs">{o.invoiceNo}</td>

            <td className="py-3">{o.customerName}</td>

            <td className="py-3 text-zinc-500">{o.date}</td>

            <td className="py-3 font-semibold">
              ${o.total.toLocaleString()}
            </td>

            <td className="py-3">
              {o.status === "paid" && (
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                  paid
                </span>
              )}

              {o.status === "pending" && (
                <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-600">
                  pending
                </span>
              )}

              {o.status === "overdue" && (
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
                  overdue
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</motion.div>
    </motion.div>
  );
}

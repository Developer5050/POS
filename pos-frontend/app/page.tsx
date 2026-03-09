"use client";

import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};



// import { motion } from 'framer-motion';
// import {
//   Package, Users, Truck, ShoppingCart, TrendingUp, TrendingDown, DollarSign, Calendar
// } from 'lucide-react';
// import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { products, customers, suppliers, orders, expenses, salesData, monthlySalesData } from '@/data/mockdata';

// const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
// const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

// export default function Dashboard() {
//   const todaySales = orders.filter(o => o.date === '2026-03-06').reduce((s, o) => s + o.total, 0);
//   const monthlySales = orders.reduce((s, o) => s + o.total, 0);
//   const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
//   const totalPurchaseCost = orders.reduce((s, o) => s + o.items.reduce((si, i) => {
//     const prod = products.find(p => p.id === i.productId);
//     return si + (prod ? prod.purchasePrice * i.quantity : 0);
//   }, 0), 0);
//   const profit = monthlySales - totalPurchaseCost - totalExpenses;

//   const stats = [
//     { label: 'Total Products', value: products.length, icon: Package, color: 'var(--primary)' },
//     { label: 'Total Customers', value: customers.length, icon: Users, color: 'var(--info)' },
//     { label: 'Total Suppliers', value: suppliers.length, icon: Truck, color: 'var(--warning)' },
//     { label: "Today's Sales", value: `$${todaySales.toLocaleString()}`, icon: ShoppingCart, color: 'var(--success)' },
//     { label: 'Monthly Sales', value: `$${monthlySales.toLocaleString()}`, icon: DollarSign, color: 'var(--primary)' },
//     { label: 'Total Expenses', value: `$${totalExpenses.toLocaleString()}`, icon: Calendar, color: 'var(--destructive)' },
//   ];

//   return (
//     <motion.div variants={container} initial="hidden" animate="show">
//       <div className="page-header">
//         <h1 className="page-title">Dashboard</h1>
//         <span className="text-sm text-muted-foreground">March 6, 2026</span>
//       </div>

//       {/* Stats Grid */}
//       <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
//         {stats.map((s) => (
//           <div key={s.label} className="stat-card">
//             <div className="flex items-center gap-2 mb-2">
//               <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `hsl(${s.color} / 0.12)` }}>
//                 <s.icon className="w-4 h-4" style={{ color: `hsl(${s.color})` }} />
//               </div>
//             </div>
//             <p className="text-xs text-muted-foreground">{s.label}</p>
//             <p className="text-xl font-bold mt-0.5">{s.value}</p>
//           </div>
//         ))}
//       </motion.div>

//       {/* Profit/Loss Banner */}
//       <motion.div variants={item} className="stat-card mb-6 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {profit >= 0 ? (
//             <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'hsl(var(--success) / 0.12)' }}>
//               <TrendingUp className="w-5 h-5 text-success" />
//             </div>
//           ) : (
//             <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'hsl(var(--destructive) / 0.12)' }}>
//               <TrendingDown className="w-5 h-5 text-destructive" />
//             </div>
//           )}
//           <div>
//             <p className="text-sm text-muted-foreground">Monthly Profit / Loss</p>
//             <p className={`text-2xl font-bold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
//               {profit >= 0 ? '+' : ''}${profit.toLocaleString()}
//             </p>
//           </div>
//         </div>
//       </motion.div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         <motion.div variants={item} className="stat-card">
//           <h3 className="text-sm font-semibold mb-4">Daily Sales</h3>
//           <ResponsiveContainer width="100%" height={220}>
//             <AreaChart data={salesData}>
//               <defs>
//                 <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor="hsl(162, 63%, 41%)" stopOpacity={0.3} />
//                   <stop offset="100%" stopColor="hsl(162, 63%, 41%)" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
//               <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
//               <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
//               <Tooltip />
//               <Area type="monotone" dataKey="sales" stroke="hsl(162, 63%, 41%)" fill="url(#salesGrad)" strokeWidth={2} />
//             </AreaChart>
//           </ResponsiveContainer>
//         </motion.div>

//         <motion.div variants={item} className="stat-card">
//           <h3 className="text-sm font-semibold mb-4">Monthly Sales vs Expenses</h3>
//           <ResponsiveContainer width="100%" height={220}>
//             <BarChart data={monthlySalesData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
//               <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
//               <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
//               <Tooltip />
//               <Bar dataKey="sales" fill="hsl(162, 63%, 41%)" radius={[4, 4, 0, 0]} />
//               <Bar dataKey="expenses" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </motion.div>
//       </div>

//       {/* Recent Orders */}
//       <motion.div variants={item} className="stat-card">
//         <h3 className="text-sm font-semibold mb-4">Recent Orders</h3>
//         <table className="data-table">
//           <thead>
//             <tr>
//               <th>Invoice</th>
//               <th>Customer</th>
//               <th>Date</th>
//               <th>Amount</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.slice(0, 5).map((o) => (
//               <tr key={o.id}>
//                 <td className="font-mono text-xs">{o.invoiceNo}</td>
//                 <td>{o.customerName}</td>
//                 <td className="text-muted-foreground">{o.date}</td>
//                 <td className="font-semibold">${o.total.toLocaleString()}</td>
//                 <td>
//                   <span className={o.status === 'paid' ? 'badge-success' : o.status === 'pending' ? 'badge-warning' : 'badge-destructive'}>
//                     {o.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </motion.div>
//     </motion.div>
//   );
// }

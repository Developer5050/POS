"use client";
import { motion } from 'framer-motion';
import { Eye, Printer, Download, Search } from 'lucide-react';
import { orders } from '@/data/mockdata';
import { useState } from 'react';

export default function Invoices() {
  const [search, setSearch] = useState('');
  const filtered = orders.filter(o =>
    o.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1 className="page-title">Invoices</h1>
      </div>

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input className="search-input w-full pl-10" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="stat-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Invoice #</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td className="font-mono text-xs font-medium">{o.invoiceNo}</td>
                <td>{o.customerName}</td>
                <td className="text-muted-foreground">{o.date}</td>
                <td className="font-semibold">${o.total.toLocaleString()}</td>
                <td>
                  <span className={o.status === 'paid' ? 'badge-success' : o.status === 'pending' ? 'badge-warning' : 'badge-destructive'}>
                    {o.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-muted" title="View"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded hover:bg-muted" title="Print"><Printer className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded hover:bg-muted" title="Download PDF"><Download className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

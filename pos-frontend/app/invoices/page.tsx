"use client";
import { motion } from 'framer-motion';
import { Eye, Printer, Download, Search } from 'lucide-react';
import { orders } from '@/data/mockdata';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function Invoices() {
  const [search, setSearch] = useState('');
  const filtered = orders.filter(o =>
    o.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1 className="page-title text-[18px] font-bold mt-1">Invoices</h1>
      </div>

      <div className="mb-4 relative mt-3 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input className="search-input w-full pl-10 py-2.5 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83] text-[13px] mt-0.5 rounded-lg p-2" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="stat-card overflow-x-auto bg-white shadow rounded-lg">

        <table className="min-w-full divide-y divide-gray-200">

          {/* Table Header */}
          <thead className="bg-[#27AA83] text-xs uppercase text-white border-b border-[#27AA83] h-[38px]">
            <tr>
              <th className="py-3 px-3 text-left font-semibold rounded-tl-lg">Invoice</th>
              <th className="py-3 px-3 text-left font-semibold">Customer</th>
              <th className="py-3 px-3 text-left font-semibold">Amount</th>
              <th className="py-3 px-3 text-left font-semibold">Status</th>
              <th className="py-3 px-3 text-left font-semibold">Date</th>
              <th className="py-3 px-3 text-left font-semibold rounded-tr-lg">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">

            {filtered.map((o, idx) => (
              <tr
                key={o.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >

                <td className="px-4 py-2 text-[14px]">
                  {o.invoiceNo}
                </td>

                <td className="px-4 py-2 text-[14px]">
                  {o.customerName}
                </td>

                <td className="px-4 py-2 font-medium text-[14px]">
                  ${o.total.toLocaleString()}
                </td>

                <td className="px-4 py-2">

                  {o.status === "paid" && (
                    <span className="px-2.5 py-1.5 text-xs rounded-xl bg-orange-100 text-orange-600">
                      paid
                    </span>
                  )}
                  {o.status === "overdue" && (
                    <span className="px-2.5 py-1.5 text-xs rounded-xl bg-red-100 text-red-600">
                      overdue
                    </span>
                  )}
                  {o.status === "pending" && (
                    <span className="px-2.5 py-1.5 text-xs rounded-xl bg-green-100 text-green-600">
                      pending
                    </span>
                  )}

                </td>

                <td className="px-4 py-2 text-[14px]">
                  {o.date}
                </td>

                <td className="px-4 py-2">
                  <div className="flex gap-3">

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Eye className="w-4 h-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                          View Invoice
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Printer className="w-4 h-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                          Print Invoice
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Download className="w-4 h-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                          Download Invoice
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

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

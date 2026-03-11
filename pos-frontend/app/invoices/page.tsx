"use client";
import { motion } from 'framer-motion';
import { Eye, Printer, Download, Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { orders as initialOrders, type Order } from '@/data/mockdata';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SortConfig = {
  key: keyof Order | null;
  direction: 'asc' | 'desc';
};

export default function Invoices() {
  const [list, setList] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const filtered = list.filter(o =>
    o.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const requestSort = (key: keyof Order) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedList = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const key = sortConfig.key;
    const aVal = a[key] ?? '';
    const bVal = b[key] ?? '';
    
    if (typeof aVal === 'string') {
      return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal as unknown as string) : (bVal as unknown as string).localeCompare(aVal);
    }
    if (typeof aVal === 'number') {
      return sortConfig.direction === 'asc' ? aVal - (bVal as unknown as number) : (bVal as unknown as number) - aVal;
    }
    return 0;
  });

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
              <th className="py-3 px-3 text-left font-semibold rounded-tl-lg cursor-pointer select-none" onClick={() => requestSort('invoiceNo')}>
                <div className="flex items-center gap-1">
                  Invoice
                  {sortConfig.key === 'invoiceNo' ? (
                    sortConfig.direction === 'asc' ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )
                  ) : (
                    <ChevronsUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>
              <th className="py-3 px-3 text-left font-semibold cursor-pointer select-none" onClick={() => requestSort('customerName')}>
                <div className="flex items-center gap-1">
                  Customer
                  {sortConfig.key === 'customerName' ? (
                    sortConfig.direction === 'asc' ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )
                  ) : (
                    <ChevronsUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>
              <th className="py-3 px-3 text-left font-semibold cursor-pointer select-none" onClick={() => requestSort('total')}>
                <div className="flex items-center gap-1">
                  Amount
                  {sortConfig.key === 'total' ? (
                    sortConfig.direction === 'asc' ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )
                  ) : (
                    <ChevronsUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>
              <th className="py-3 px-3 text-left font-semibold cursor-pointer select-none" onClick={() => requestSort('status')}>
                <div className="flex items-center gap-1">
                  Status
                  {sortConfig.key === 'status' ? (
                    sortConfig.direction === 'asc' ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )
                  ) : (
                    <ChevronsUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>
              <th className="py-3 px-3 text-left font-semibold cursor-pointer select-none" onClick={() => requestSort('date')}>
                <div className="flex items-center gap-1">
                  Date
                  {sortConfig.key === 'date' ? (
                    sortConfig.direction === 'asc' ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )
                  ) : (
                    <ChevronsUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>
              <th className="py-3 px-3 text-left font-semibold rounded-tr-lg">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">

            {sortedList.map((o, idx) => (
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

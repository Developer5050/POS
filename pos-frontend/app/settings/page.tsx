"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    businessName: 'RetailPOS Store',
    address: '123 Business St, Lahore',
    phone: '+92 300 1234567',
    currency: 'USD',
    taxRate: 0,
    invoicePrefix: 'INV-',
    lowStockAlert: 10,
  });

  const save = () => { toast.success('Settings saved!'); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <Button onClick={save} size="sm"><Save className="w-4 h-4 mr-1" /> Save Settings</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Business Information</h3>
          </div>
          <div><Label>Business Name</Label><Input value={settings.businessName} onChange={e => setSettings({ ...settings, businessName: e.target.value })} /></div>
          <div><Label>Address</Label><Input value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} /></div>
        </div>

        <div className="stat-card space-y-4">
          <h3 className="font-semibold">Invoice & Tax</h3>
          <div><Label>Currency</Label><Input value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })} /></div>
          <div><Label>Tax Rate (%)</Label><Input type="number" value={settings.taxRate} onChange={e => setSettings({ ...settings, taxRate: +e.target.value })} /></div>
          <div><Label>Invoice Prefix</Label><Input value={settings.invoicePrefix} onChange={e => setSettings({ ...settings, invoicePrefix: e.target.value })} /></div>
          <div><Label>Low Stock Alert Threshold</Label><Input type="number" value={settings.lowStockAlert} onChange={e => setSettings({ ...settings, lowStockAlert: +e.target.value })} /></div>
        </div>
      </div>
    </motion.div>
  );
}

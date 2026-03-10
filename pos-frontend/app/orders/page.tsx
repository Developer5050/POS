"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { products as allProducts, customers as allCustomers, type OrderItem } from '@/data/mockdata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function NewOrder() {
  const [prodSearch, setProdSearch] = useState('');
  const [custSearch, setCustSearch] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [dcNo, setDcNo] = useState('');
  const [poNo, setPoNo] = useState('');

  const filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(prodSearch.toLowerCase()));
  const filteredCustomers = allCustomers.filter(c => c.name.toLowerCase().includes(custSearch.toLowerCase()));
  const grandTotal = cart.reduce((s, i) => s + i.total, 0);

  const addToCart = (productId: string, productName: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i);
      }
      return [...prev, { productId, productName, quantity: 1, price, total: price }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.productId !== productId) return i;
      const newQty = Math.max(1, i.quantity + delta);
      return { ...i, quantity: newQty, total: newQty * i.price };
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const saveOrder = () => {
    if (!selectedCustomer || cart.length === 0) {
      toast.error('Please select a customer and add products');
      return;
    }
    toast.success('Order saved & invoice generated!');
    setCart([]);
    setSelectedCustomer(null);
    setDcNo('');
    setPoNo('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1 className="page-title">New Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: Products */}
        <div>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input className="search-input w-full pl-10" placeholder="Search products..." value={prodSearch} onChange={e => setProdSearch(e.target.value)} />
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {filteredProducts.map(p => (
              <button
                key={p.id}
                onClick={() => addToCart(p.id, p.name, p.salePrice)}
                className="stat-card text-left hover:border-primary/40 transition-colors cursor-pointer"
              >
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-primary">${p.salePrice}</span>
                  <span className="text-xs text-muted-foreground">Stock: {p.stock}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Cart */}
          <div className="stat-card">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Cart ({cart.length} items)
            </h3>
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No items in cart</p>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.productId} className="flex items-center justify-between py-2 border-b border-border/50">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">${item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.productId, -1)} className="w-7 h-7 rounded-md bg-muted flex items-center justify-center hover:bg-muted/80"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, 1)} className="w-7 h-7 rounded-md bg-muted flex items-center justify-center hover:bg-muted/80"><Plus className="w-3 h-3" /></button>
                      <span className="w-16 text-right text-sm font-semibold">${item.total.toFixed(2)}</span>
                      <button onClick={() => removeFromCart(item.productId)} className="p-1 hover:bg-muted rounded"><X className="w-3.5 h-3.5 text-destructive" /></button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-2 text-lg font-bold">
                  <span>Grand Total</span>
                  <span className="text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Customer & Order Info */}
        <div className="space-y-4">
          <div className="stat-card">
            <h3 className="text-sm font-semibold mb-3">Customer</h3>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="search-input w-full pl-10" placeholder="Search customer..." value={custSearch} onChange={e => setCustSearch(e.target.value)} />
            </div>
            <div className="space-y-1 max-h-[180px] overflow-y-auto">
              {filteredCustomers.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCustomer(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCustomer === c.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  <p className="font-medium">{c.name}</p>
                  <p className={`text-xs ${selectedCustomer === c.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{c.phone}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="stat-card space-y-3">
            <h3 className="text-sm font-semibold">Order Details</h3>
            <div><Label>DC No</Label><Input value={dcNo} onChange={e => setDcNo(e.target.value)} placeholder="Delivery Challan No" /></div>
            <div><Label>PO No</Label><Input value={poNo} onChange={e => setPoNo(e.target.value)} placeholder="Purchase Order No" /></div>
          </div>

          <div className="stat-card">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Grand Total</span>
              <span className="text-primary">${grandTotal.toFixed(2)}</span>
            </div>
            <Button className="w-full mt-4" onClick={saveOrder} disabled={cart.length === 0}>
              Save Order & Generate Invoice
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

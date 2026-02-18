'use client';

import { OrderItem, Customer } from '@/app/lib/storageManager';
import { BarChart3, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface AnalyticsProps {
  orders: OrderItem[];
  customers: Customer[];
}

export function Analytics({ orders, customers }: AnalyticsProps) {
  const now = new Date();

  // Calculate metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalItems = orders.reduce((sum, o) => sum + o.quantity, 0);
  const uniqueCustomers = new Set(orders.map(o => o.customerPhone)).size;

  // Get today's stats
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayOrders = orders.filter(o => new Date(o.createdAt) >= todayStart);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const todayItems = todayOrders.reduce((sum, o) => sum + o.quantity, 0);

  // Orders by age
  const ordersByAge = {
    today: orders.filter(o => {
      if (o.status !== 'pending') return false;
      const orderDate = new Date(o.createdAt);
      const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return orderDay.getTime() === today.getTime();
    }),
    '2-3days': orders.filter(o => {
      if (o.status !== 'pending') return false;
      const days = Math.floor((now.getTime() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return days >= 2 && days <= 3;
    }),
    'week': orders.filter(o => {
      if (o.status !== 'pending') return false;
      const days = Math.floor((now.getTime() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return days >= 4 && days <= 7;
    }),
    'overdue': orders.filter(o => {
      if (o.status !== 'pending') return false;
      const days = Math.floor((now.getTime() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return days > 7;
    }),
  };

  // Outstanding balance
  const outstandingBalance = customers.reduce((sum, c) => sum + Math.max(0, c.totalDue - c.advanceCredit), 0);

  // Top customers by orders
  const topCustomers = [...customers]
    .sort((a, b) => b.orders.length - a.orders.length)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={28} className="text-primary" />
        <h2 className="text-2xl font-bold">📊 विश्लेषण</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-4 rounded-lg border-2 border-primary">
          <p className="text-xs text-muted-foreground mb-1">कुल आय</p>
          <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-primary mt-1">आज: ₹{todayRevenue}</p>
        </div>

        {/* Total Orders */}
        <div className="bg-card p-4 rounded-lg border-2 border-border">
          <p className="text-xs text-muted-foreground mb-1">कुल ऑर्डर</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
          <p className="text-xs text-muted-foreground mt-1">बाकी: {pendingOrders}</p>
        </div>

        {/* Total Items */}
        <div className="bg-card p-4 rounded-lg border-2 border-border">
          <p className="text-xs text-muted-foreground mb-1">कुल कपड़े</p>
          <p className="text-2xl font-bold">{totalItems}</p>
          <p className="text-xs text-muted-foreground mt-1">आज: {todayItems}</p>
        </div>

        {/* Unique Customers */}
        <div className="bg-card p-4 rounded-lg border-2 border-border">
          <p className="text-xs text-muted-foreground mb-1">ग्राहक</p>
          <p className="text-2xl font-bold">{uniqueCustomers}</p>
          <p className="text-xs text-muted-foreground mt-1">नए: {uniqueCustomers}</p>
        </div>

        {/* Completed */}
        <div className="bg-green-500/10 p-4 rounded-lg border-2 border-green-500">
          <p className="text-xs text-muted-foreground mb-1">पूरे किए हुए</p>
          <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
          <p className="text-xs text-muted-foreground mt-1">{Math.round((completedOrders / totalOrders) * 100) || 0}%</p>
        </div>

        {/* Outstanding Balance */}
        <div className={`p-4 rounded-lg border-2 ${
          outstandingBalance > 0
            ? 'bg-destructive/10 border-destructive'
            : 'bg-green-500/10 border-green-500'
        }`}>
          <p className="text-xs text-muted-foreground mb-1">बकाया</p>
          <p className="text-2xl font-bold">₹{outstandingBalance.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Orders by Age Section */}
      <div className="bg-card p-4 rounded-lg border-2 border-border space-y-3">
        <h3 className="font-bold flex items-center gap-2">
          <Clock size={20} /> पुराने ऑर्डर
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {/* Today */}
          <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500 text-center">
            <p className="text-2xl font-bold">{ordersByAge.today.length}</p>
            <p className="text-xs text-muted-foreground">आज का</p>
          </div>

          {/* 2-3 Days */}
          <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-600 text-center">
            <p className="text-2xl font-bold">{ordersByAge['2-3days'].length}</p>
            <p className="text-xs text-muted-foreground">2-3 दिन पुराना</p>
          </div>

          {/* Week */}
          <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-600 text-center">
            <p className="text-2xl font-bold">{ordersByAge.week.length}</p>
            <p className="text-xs text-muted-foreground">सप्ताह पुराना</p>
          </div>

          {/* Overdue */}
          {ordersByAge.overdue.length > 0 && (
            <div className="bg-destructive/10 p-3 rounded-lg border-2 border-destructive text-center">
              <p className="text-2xl font-bold text-destructive">{ordersByAge.overdue.length}</p>
              <p className="text-xs font-bold">⚠️ 7+ दिन पुराना</p>
            </div>
          )}
        </div>
      </div>

      {/* Overdue Orders List */}
      {ordersByAge.overdue.length > 0 && (
        <div className="bg-destructive/10 p-4 rounded-lg border-2 border-destructive space-y-2">
          <h3 className="font-bold flex items-center gap-2 text-destructive">
            <AlertCircle size={20} /> 7+ दिन पुराने ऑर्डर
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {ordersByAge.overdue.map(order => {
              const daysOld = Math.floor((now.getTime() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={order.id} className="bg-background p-2 rounded text-sm flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{daysOld} दिन पुराना</p>
                  </div>
                  <p className="font-bold text-destructive">₹{order.totalAmount}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Customers */}
      {topCustomers.length > 0 && (
        <div className="bg-card p-4 rounded-lg border-2 border-border space-y-3">
          <h3 className="font-bold flex items-center gap-2">
            <TrendingUp size={20} /> शीर्ष ग्राहक
          </h3>
          <div className="space-y-2">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.orders.length} ऑर्डर</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{Math.max(0, customer.totalDue - customer.advanceCredit).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted-foreground">बकाया</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

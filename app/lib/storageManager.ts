// Enhanced localStorage manager for Rahul Dry Cleaners

export interface OrderItem {
  id: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  ratePerItem: number;
  totalAmount: number;
  photoUrl?: string;
  createdAt: string;
  completedAt?: string;
  status: 'pending' | 'completed';
}

export interface Payment {
  id: string;
  customerId: string;
  amount: number;
  type: 'payment' | 'credit' | 'refund';
  date: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalDue: number;
  totalPaid: number;
  advanceCredit: number;
  orders: string[]; // order IDs
  payments: string[]; // payment IDs
  createdAt: string;
  lastOrderAt?: string;
}

const STORAGE_KEYS = {
  ORDERS: 'rahul_dry_orders',
  CUSTOMERS: 'rahul_dry_customers',
  PAYMENTS: 'rahul_dry_payments',
};

class StorageManager {
  // Orders
  saveOrder(order: OrderItem): void {
    const orders = this.getOrders();
    orders.push(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  getOrders(): OrderItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  updateOrder(orderId: string, updates: Partial<OrderItem>): void {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  }

  deleteOrder(orderId: string): void {
    const orders = this.getOrders().filter(o => o.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  // Customers
  getOrCreateCustomer(name: string, phone: string): Customer {
    let customers = this.getCustomers();
    let customer = customers.find(c => c.phone === phone);

    if (!customer) {
      customer = {
        id: 'cust_' + Date.now(),
        name,
        phone,
        totalDue: 0,
        totalPaid: 0,
        advanceCredit: 0,
        orders: [],
        payments: [],
        createdAt: new Date().toISOString(),
      };
      customers.push(customer);
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    }
    return customer;
  }

  getCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getCustomer(customerId: string): Customer | undefined {
    return this.getCustomers().find(c => c.id === customerId);
  }

  updateCustomer(customerId: string, updates: Partial<Customer>): void {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === customerId);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    }
  }

  // Payments
  savePayment(payment: Payment): void {
    const payments = this.getPayments();
    payments.push(payment);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

    // Update customer balance
    const customers = this.getCustomers();
    const customer = customers.find(c => c.id === payment.customerId);
    if (customer) {
      if (payment.type === 'payment') {
        customer.totalPaid += payment.amount;
        customer.totalDue = Math.max(0, customer.totalDue - payment.amount);
      } else if (payment.type === 'credit') {
        customer.advanceCredit += payment.amount;
      } else if (payment.type === 'refund') {
        customer.totalDue = Math.max(0, customer.totalDue - payment.amount);
      }
      customer.payments.push(payment.id);
      this.updateCustomer(customer.id, customer);
    }
  }

  getPayments(): Payment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getPaymentsByCustomer(customerId: string): Payment[] {
    return this.getPayments().filter(p => p.customerId === customerId);
  }

  // Analytics
  getAnalytics(timeFrame: 'today' | 'week' | 'month' = 'today') {
    const orders = this.getOrders();
    const now = new Date();
    let startDate = new Date();

    if (timeFrame === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (timeFrame === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeFrame === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    }

    const filteredOrders = orders.filter(o => new Date(o.createdAt) >= startDate);

    const stats = {
      totalOrders: filteredOrders.length,
      totalRevenue: filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      pendingOrders: filteredOrders.filter(o => o.status === 'pending').length,
      completedOrders: filteredOrders.filter(o => o.status === 'completed').length,
      totalItems: filteredOrders.reduce((sum, o) => sum + o.quantity, 0),
      averagePerOrder: filteredOrders.length > 0 ? filteredOrders.reduce((sum, o) => sum + o.quantity, 0) / filteredOrders.length : 0,
    };

    return stats;
  }

  getOrdersByAge() {
    const orders = this.getOrders().filter(o => o.status === 'pending');
    const now = new Date();

    return {
      today: orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return orderDay.getTime() === today.getTime();
      }),
      '2-3days': orders.filter(o => {
        const days = Math.floor((now.getTime() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        return days >= 2 && days <= 3;
      }),
      'week': orders.filter(o => {
        const days = Math.floor((now.getTime() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        return days >= 4 && days <= 7;
      }),
      'overdue': orders.filter(o => {
        const days = Math.floor((now.getTime() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        return days > 7;
      }),
    };
  }

  getCustomerBalance(customerId: string) {
    const customer = this.getCustomer(customerId);
    if (!customer) return null;

    return {
      customerId,
      customerName: customer.name,
      totalDue: customer.totalDue,
      advanceCredit: customer.advanceCredit,
      netBalance: customer.totalDue - customer.advanceCredit,
      lastOrderAt: customer.lastOrderAt,
      orderCount: customer.orders.length,
    };
  }

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
  }
}

export const storage = new StorageManager();

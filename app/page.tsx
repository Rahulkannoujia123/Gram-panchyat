'use client';

import { useState, useEffect } from 'react';
import { VoiceRecognition } from '@/app/components/VoiceRecognition';
import { CustomerBalance } from '@/app/components/CustomerBalance';
import { Analytics } from '@/app/components/Analytics';
import {
  storage,
  OrderItem,
  Customer,
  Payment,
} from '@/app/lib/storageManager';
import { generateWhatsAppMessage, downloadPDF } from '@/app/lib/pdfGenerator';
import {
  Download,
  Send,
  Trash2,
  Check,
} from 'lucide-react';

type Tab = 'orders' | 'customers' | 'analytics' | 'settings';

export default function Home() {
  const [tab, setTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('pending');

  // Load data on mount
  useEffect(() => {
    const loadedOrders = storage.getOrders();
    const loadedCustomers = storage.getCustomers();
    setOrders(loadedOrders);
    setCustomers(loadedCustomers);
  }, []);

  // Parse voice input
  const parseVoiceInput = (text: string, language: string) => {
    const cleanText = text.toLowerCase().trim();
    console.log('[v0] Parsing voice:', cleanText, 'Language:', language);

    // Simple regex patterns for name and quantity
    // Pattern: "Name ke 5 kapde" or "5 kapde name" or "name 5"
    const quantityMatch = cleanText.match(/(\d+)/);
    const quantity = quantityMatch ? parseInt(quantityMatch[0]) : 1;

    // Extract name (remove numbers and common keywords)
    const words = cleanText
      .replace(/kapd[aieou]|clothes|shirt|pant|saree|dupatta|\d+/gi, '')
      .split(/\s+/)
      .filter(w => w.length > 1);
    const name = words.join(' ') || 'Customer';

    return { name: name.charAt(0).toUpperCase() + name.slice(1), quantity };
  };

  // Handle transcript from voice - AUTO SAVE
  const handleTranscript = (text: string, language: string) => {
    // Only process final transcripts (without "...")
    if (text.includes('...')) {
      setTranscript(text);
      return;
    }

    setTranscript(text);
    console.log('[v0] Processing final transcript:', text);

    const { name, quantity } = parseVoiceInput(text, language);

    // Auto-save order immediately
    const totalAmount = quantity * 8;

    // Get or create customer
    let phone = localStorage.getItem(`phone_${name}`);
    if (!phone) {
      phone = '';
    }

    const customer = storage.getOrCreateCustomer(name, phone);

    const newOrder: OrderItem = {
      id: 'order_' + Date.now(),
      customerName: name,
      customerPhone: phone,
      quantity,
      ratePerItem: 8,
      totalAmount,
      photoUrl: '',
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    console.log('[v0] Auto-saving order:', newOrder);
    storage.saveOrder(newOrder);

    // Update customer
    customer.orders.push(newOrder.id);
    customer.totalDue += totalAmount;
    customer.lastOrderAt = new Date().toISOString();
    storage.updateCustomer(customer.id, customer);

    // Refresh data
    setOrders(storage.getOrders());
    setCustomers(storage.getCustomers());

    // Reset UI
    setTranscript('');

    // Voice feedback
    const msg = new SpeechSynthesisUtterance(
      `ठीक है, ${name} के ${quantity} कपड़े नोट कर लिए हैं। कुल राशि ${totalAmount} रुपये है।`
    );
    msg.lang = 'hi-IN';
    window.speechSynthesis.speak(msg);
  };

  // Complete order
  const completeOrder = (orderId: string) => {
    storage.updateOrder(orderId, { status: 'completed', completedAt: new Date().toISOString() });
    setOrders(storage.getOrders());
  };

  // Delete order
  const deleteOrder = (orderId: string) => {
    storage.deleteOrder(orderId);
    setOrders(storage.getOrders());
  };

  // Add payment to customer
  const addPayment = (customerId: string, amount: number, type: 'payment' | 'credit') => {
    const payment: Payment = {
      id: 'pay_' + Date.now(),
      customerId,
      amount,
      type,
      date: new Date().toISOString(),
    };

    storage.savePayment(payment);
    setCustomers(storage.getCustomers());
  };

  // Export bill as PDF
  const exportBillPDF = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const customerOrders = orders.filter(o => o.customerPhone === customer.phone);
    const billData = {
      customer,
      orders: customerOrders,
      totalDue: customer.totalDue,
      advanceCredit: customer.advanceCredit,
      netBalance: customer.totalDue - customer.advanceCredit,
      generatedAt: new Date().toISOString(),
    };

    downloadPDF(billData);
  };

  // Send bill via WhatsApp
  const sendViaWhatsApp = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const customerOrders = orders.filter(o => o.customerPhone === customer.phone);
    const billData = {
      customer,
      orders: customerOrders,
      totalDue: customer.totalDue,
      advanceCredit: customer.advanceCredit,
      netBalance: customer.totalDue - customer.advanceCredit,
      generatedAt: new Date().toISOString(),
    };

    const message = generateWhatsAppMessage(billData);
    const whatsappUrl = `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter(o => o.status === filterStatus);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b-2 border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            🏪 RAHUL DRY CLEANERS
          </h1>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Voice-Controlled Order Manager
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-4 pb-24">
        {/* Voice Input Section */}
        {tab === 'orders' && (
          <div className="bg-card p-4 rounded-lg border-2 border-primary mb-4">
            <VoiceRecognition
              onTranscript={handleTranscript}
              isListening={isListening}
              setIsListening={setIsListening}
              transcript={transcript}
            />
          </div>
        )}



        {/* Customer Modal */}
        {showCustomerModal && selectedCustomer && (
          <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4">
                <CustomerBalance
                  customer={selectedCustomer}
                  orderCount={orders.filter(o => o.customerPhone === selectedCustomer.phone).length}
                  onAddPayment={(amount, type) => {
                    addPayment(selectedCustomer.id, amount, type);
                    setShowCustomerModal(false);
                  }}
                  onClose={() => setShowCustomerModal(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {(['orders', 'customers', 'analytics', 'settings'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                tab === t
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary'
              }`}
            >
              {t === 'orders' && '📦 ऑर्डर'}
              {t === 'customers' && '👥 ग्राहक'}
              {t === 'analytics' && '📊 विश्लेषण'}
              {t === 'settings' && '⚙️ सेटिंग'}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="space-y-4">
            {/* Filter Buttons */}
            <div className="flex gap-2">
              {(['all', 'pending', 'completed'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    filterStatus === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {status === 'all' && `सभी (${orders.length})`}
                  {status === 'pending' && `बाकी (${orders.filter(o => o.status === 'pending').length})`}
                  {status === 'completed' && `पूरे (${orders.filter(o => o.status === 'completed').length})`}
                </button>
              ))}
            </div>



            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="text-center p-8 bg-card rounded-lg border-2 border-border">
                  <p className="text-muted-foreground text-lg">
                    {filterStatus === 'pending'
                      ? 'कोई बाकी ऑर्डर नहीं 🎉'
                      : 'कोई ऑर्डर नहीं'}
                  </p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div
                    key={order.id}
                    className={`p-4 rounded-lg border-2 ${
                      order.status === 'completed'
                        ? 'bg-green-500/10 border-green-500'
                        : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold">{order.customerName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('en-IN')} •{' '}
                          {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">₹{order.totalAmount}</p>
                        <p className="text-xs text-muted-foreground">{order.quantity} कपड़े</p>
                      </div>
                    </div>

                    {order.photoUrl && (
                      <img
                        src={order.photoUrl}
                        alt="Order"
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}

                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => completeOrder(order.id)}
                          className="flex-1 bg-primary text-primary-foreground rounded-lg p-2 font-bold hover:opacity-90 flex items-center justify-center gap-2"
                        >
                          <Check size={18} /> पूरा करें
                        </button>
                      )}
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="flex-1 bg-destructive text-white rounded-lg p-2 font-bold hover:opacity-90 flex items-center justify-center gap-2"
                      >
                        <Trash2 size={18} /> हटाएं
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {tab === 'customers' && (
          <div className="space-y-3">
            {customers.length === 0 ? (
              <div className="text-center p-8 bg-card rounded-lg border-2 border-border">
                <p className="text-muted-foreground text-lg">कोई ग्राहक नहीं</p>
              </div>
            ) : (
              customers
                .sort((a, b) => (b.lastOrderAt || '').localeCompare(a.lastOrderAt || ''))
                .map(customer => {
                  const balance = customer.totalDue - customer.advanceCredit;
                  const customerOrders = orders.filter(o => o.customerPhone === customer.phone);
                  return (
                    <div
                      key={customer.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-102 ${
                        balance > 0
                          ? 'bg-destructive/10 border-destructive'
                          : 'bg-green-500/10 border-green-500'
                      }`}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowCustomerModal(true);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">{customer.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">₹{Math.abs(balance).toLocaleString('en-IN')}</p>
                          <p className="text-xs font-bold text-muted-foreground">
                            {balance > 0 ? 'बकाया' : 'जमा'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 text-xs text-muted-foreground mb-3">
                        <span>📦 {customerOrders.length} ऑर्डर</span>
                        <span>•</span>
                        <span>💰 ₹{customer.totalPaid} भुगतान</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            exportBillPDF(customer.id);
                          }}
                          className="flex-1 bg-secondary text-secondary-foreground rounded-lg p-2 font-bold hover:opacity-90 text-sm flex items-center justify-center gap-1"
                        >
                          <Download size={16} /> बिल
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            sendViaWhatsApp(customer.id);
                          }}
                          className="flex-1 bg-green-600 text-white rounded-lg p-2 font-bold hover:opacity-90 text-sm flex items-center justify-center gap-1"
                        >
                          <Send size={16} /> WhatsApp
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {tab === 'analytics' && <Analytics orders={orders} customers={customers} />}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="space-y-3">
            <div className="bg-card p-4 rounded-lg border-2 border-border">
              <h3 className="font-bold text-lg mb-3">⚙️ सेटिंग्स</h3>

              <div className="space-y-2">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">कुल ऑर्डर: {orders.length}</p>
                  <p className="text-sm text-muted-foreground">कुल ग्राहक: {customers.length}</p>
                  <p className="text-sm text-muted-foreground">कुल आय: ₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('en-IN')}</p>
                </div>

                <button
                  onClick={() => {
                    if (confirm('सभी डेटा साफ करना है? यह कार्य वापस नहीं किया जा सकता!')) {
                      storage.clearAllData();
                      setOrders([]);
                      setCustomers([]);
                    }
                  }}
                  className="w-full bg-destructive text-white p-3 rounded-lg font-bold hover:opacity-90"
                >
                  🗑️ सभी डेटा साफ करें
                </button>

                <button
                  onClick={() => {
                    // Export data as JSON
                    const data = {
                      orders,
                      customers,
                      exportedAt: new Date().toISOString(),
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], {
                      type: 'application/json',
                    });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `rahul_dry_cleaners_backup_${new Date().getTime()}.json`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full bg-primary text-primary-foreground p-3 rounded-lg font-bold hover:opacity-90 flex items-center justify-center gap-2"
                >
                  <Download size={20} /> डेटा बैकअप करें
                </button>
              </div>
            </div>

            <div className="bg-blue-500/10 p-4 rounded-lg border-2 border-blue-500 text-sm">
              <p className="font-bold mb-2">ℹ️ जानकारी</p>
              <p className="text-muted-foreground mb-2">यह ऐप आपके ब्राउज़र में सभी डेटा स्थानीय रूप से सहेजता है।</p>
              <p className="text-muted-foreground">कोई डेटा सर्वर पर नहीं जाता।</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {tab === 'orders' && (
        <button
          onClick={() => {
            if (!isListening) {
              setIsListening(true);
            } else {
              setIsListening(false);
            }
          }}
          className={`fixed bottom-8 right-4 md:bottom-16 md:right-8 p-6 rounded-full transition-all transform ${
            isListening
              ? 'bg-destructive text-white scale-110 animate-pulse'
              : 'bg-primary text-primary-foreground hover:scale-110'
          }`}
          title={isListening ? 'रुकें' : 'शुरू करें'}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m4.24-4.24l4.24-4.24" />
          </svg>
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border z-40">
        <div className="max-w-4xl mx-auto px-4 flex justify-around">
          {(['orders', 'customers', 'analytics', 'settings'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 font-bold transition-all border-t-4 ${
                tab === t
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              {t === 'orders' && '📦'}
              {t === 'customers' && '👥'}
              {t === 'analytics' && '📊'}
              {t === 'settings' && '⚙️'}
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}

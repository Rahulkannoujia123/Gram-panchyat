'use client';

import { useState } from 'react';
import { Customer, Payment } from '@/app/lib/storageManager';
import { Plus, Minus, TrendingUp } from 'lucide-react';

interface CustomerBalanceProps {
  customer: Customer;
  orderCount: number;
  onAddPayment: (amount: number, type: 'payment' | 'credit') => void;
  onClose: () => void;
}

export function CustomerBalance({
  customer,
  orderCount,
  onAddPayment,
  onClose,
}: CustomerBalanceProps) {
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'payment' | 'credit'>('payment');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const netBalance = customer.totalDue - customer.advanceCredit;

  const handleAddPayment = () => {
    if (paymentAmount && parseFloat(paymentAmount) > 0) {
      onAddPayment(parseFloat(paymentAmount), paymentType);
      setPaymentAmount('');
      setShowPaymentForm(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{customer.name}</h3>
        <button
          onClick={onClose}
          className="text-xl font-bold text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>

      {/* Main Balance Card */}
      <div className={`p-4 rounded-lg border-2 ${
        netBalance > 0 ? 'bg-destructive/10 border-destructive' : 'bg-green-500/10 border-green-500'
      }`}>
        <p className="text-sm text-muted-foreground mb-2">
          {netBalance > 0 ? 'बकाया राशि' : 'अग्रिम शेष'}
        </p>
        <p className="text-4xl font-bold">
          ₹{Math.abs(netBalance).toLocaleString('en-IN')}
        </p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card p-3 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">कुल बकाया</p>
          <p className="text-2xl font-bold">₹{customer.totalDue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-card p-3 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">जमा राशि</p>
          <p className="text-2xl font-bold text-primary">₹{customer.advanceCredit.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-card p-3 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">कुल भुगतान</p>
          <p className="text-2xl font-bold">₹{customer.totalPaid.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-card p-3 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">कुल ऑर्डर</p>
          <p className="text-2xl font-bold">{orderCount}</p>
        </div>
      </div>

      {/* Phone */}
      <div className="bg-card p-3 rounded-lg border border-border">
        <p className="text-xs text-muted-foreground">फोन नंबर</p>
        <p className="text-lg font-semibold">{customer.phone}</p>
      </div>

      {/* Payment Section */}
      {!showPaymentForm ? (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setPaymentType('payment');
              setShowPaymentForm(true);
            }}
            className="flex-1 bg-primary text-primary-foreground rounded-lg p-3 font-bold hover:opacity-90 flex items-center justify-center gap-2"
          >
            <Plus size={20} /> भुगतान लें
          </button>
          <button
            onClick={() => {
              setPaymentType('credit');
              setShowPaymentForm(true);
            }}
            className="flex-1 bg-secondary text-secondary-foreground rounded-lg p-3 font-bold hover:opacity-90 flex items-center justify-center gap-2"
          >
            <TrendingUp size={20} /> जमा कराएं
          </button>
        </div>
      ) : (
        <div className="space-y-3 bg-card p-4 rounded-lg border-2 border-primary">
          {/* Payment Type Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentType('payment')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                paymentType === 'payment'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              भुगतान
            </button>
            <button
              onClick={() => setPaymentType('credit')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                paymentType === 'credit'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              जमा
            </button>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">तेजी से राशि चुनें:</p>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  onClick={() => setPaymentAmount(amt.toString())}
                  className="bg-muted text-muted-foreground p-2 rounded-lg text-sm font-bold hover:bg-secondary transition-all"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Amount Input */}
          <input
            type="number"
            value={paymentAmount}
            onChange={e => setPaymentAmount(e.target.value)}
            placeholder="राशि दर्ज करें"
            className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg text-lg font-bold text-center"
          />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowPaymentForm(false)}
              className="flex-1 bg-muted text-muted-foreground rounded-lg p-3 font-bold hover:opacity-90"
            >
              रद्द करें
            </button>
            <button
              onClick={handleAddPayment}
              disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
              className="flex-1 bg-primary text-primary-foreground rounded-lg p-3 font-bold hover:opacity-90 disabled:opacity-50"
            >
              ✓ सहेजें
            </button>
          </div>
        </div>
      )}

      {/* Customer Info */}
      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
        <p>
          ग्राहक से: {new Date(customer.createdAt).toLocaleDateString('en-IN')}
        </p>
        {customer.lastOrderAt && (
          <p>
            आखिरी ऑर्डर: {new Date(customer.lastOrderAt).toLocaleDateString('en-IN')}
          </p>
        )}
      </div>
    </div>
  );
}

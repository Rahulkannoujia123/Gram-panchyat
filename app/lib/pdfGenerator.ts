// PDF bill generator for Rahul Dry Cleaners

import { OrderItem, Customer } from './storageManager';

interface BillData {
  customer: Customer;
  orders: OrderItem[];
  totalDue: number;
  advanceCredit: number;
  netBalance: number;
  generatedAt: string;
}

/**
 * Generate a simple PDF bill using HTML canvas
 * Returns blob for download
 */
export function generatePDFBill(billData: BillData): string {
  // Create canvas-based PDF-like HTML
  const html = generateBillHTML(billData);

  // Use a simple approach - create downloadable HTML that looks like PDF
  return html;
}

function generateBillHTML(data: BillData): string {
  const today = new Date(data.generatedAt);
  const dateStr = today.toLocaleDateString('en-IN');

  const ordersHTML = data.orders
    .map(
      order => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${order.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${order.ratePerItem}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${order.totalAmount}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.status === 'completed' ? '✓' : 'Pending'}</td>
    </tr>
  `
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rahul Dry Cleaners - Bill</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
    }
    .bill-container {
      background-color: white;
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
      border: 2px solid #333;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #FFD700;
      padding-bottom: 15px;
    }
    .shop-name {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
    .bill-title {
      font-size: 14px;
      color: #666;
      margin-top: 5px;
    }
    .bill-number {
      font-size: 12px;
      color: #999;
      margin-top: 5px;
    }
    .customer-info {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f9f9f9;
      border-left: 3px solid #FFD700;
    }
    .info-label {
      font-weight: bold;
      color: #333;
      font-size: 12px;
    }
    .info-value {
      color: #666;
      font-size: 14px;
      margin-top: 3px;
    }
    table {
      width: 100%;
      margin-bottom: 20px;
      font-size: 13px;
    }
    th {
      background-color: #FFD700;
      color: #000;
      padding: 10px;
      text-align: left;
      font-weight: bold;
      border: 1px solid #333;
    }
    td {
      padding: 8px;
      border-bottom: 1px solid #ddd;
    }
    .summary {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 2px solid #333;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .summary-row.total {
      font-weight: bold;
      font-size: 16px;
      color: #FFD700;
      background-color: #333;
      padding: 10px;
      margin-top: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #999;
      border-top: 1px solid #ddd;
      padding-top: 15px;
    }
    .balance-alert {
      margin-top: 15px;
      padding: 10px;
      background-color: #fff3cd;
      border-left: 3px solid #ffc107;
    }
    @media print {
      body { background-color: white; }
      .bill-container { border: none; }
    }
  </style>
</head>
<body>
  <div class="bill-container">
    <div class="header">
      <div class="shop-name">🏪 RAHUL DRY CLEANERS</div>
      <div class="bill-title">CLEANING & PRESSING BILL</div>
      <div class="bill-number">Bill Date: ${dateStr}</div>
    </div>

    <div class="customer-info">
      <div>
        <div class="info-label">CUSTOMER NAME:</div>
        <div class="info-value">${data.customer.name}</div>
      </div>
      <div style="margin-top: 10px;">
        <div class="info-label">PHONE:</div>
        <div class="info-value">${data.customer.phone}</div>
      </div>
      <div style="margin-top: 10px;">
        <div class="info-label">CUSTOMER SINCE:</div>
        <div class="info-value">${new Date(data.customer.createdAt).toLocaleDateString('en-IN')}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Items</th>
          <th>Rate</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${ordersHTML}
      </tbody>
    </table>

    <div class="summary">
      <div class="summary-row">
        <span>Total Items:</span>
        <span>${data.orders.reduce((sum, o) => sum + o.quantity, 0)}</span>
      </div>
      <div class="summary-row">
        <span>Total Amount:</span>
        <span>₹${data.orders.reduce((sum, o) => sum + o.totalAmount, 0)}</span>
      </div>
      <div class="summary-row">
        <span>Advance Credit:</span>
        <span>₹${data.advanceCredit}</span>
      </div>
      ${data.netBalance > 0 ? `
        <div class="summary-row total">
          <span>TOTAL DUE:</span>
          <span>₹${data.netBalance}</span>
        </div>
      ` : `
        <div class="summary-row total" style="background-color: #28a745;">
          <span>PAID UP ✓</span>
          <span>₹${Math.abs(data.netBalance)}</span>
        </div>
      `}
    </div>

    ${data.netBalance > 0 ? `
      <div class="balance-alert">
        <strong>⚠️ Outstanding Balance: ₹${data.netBalance}</strong><br>
        Please settle the amount at your earliest convenience.
      </div>
    ` : ''}

    <div class="footer">
      <p>Thank you for your business! 🙏</p>
      <p>Generated on ${new Date().toLocaleString('en-IN')}</p>
      <p style="margin-top: 10px; color: #666;">For queries, contact: Rahul Dry Cleaners</p>
    </div>
  </div>

  <script>
    // Auto print on load if not preventing default
    if (window.location.hash === '#print') {
      setTimeout(() => window.print(), 500);
    }
  </script>
</body>
</html>
  `;

  return html;
}

/**
 * Generate WhatsApp message with bill summary
 */
export function generateWhatsAppMessage(data: BillData): string {
  const totalAmount = data.orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const itemCount = data.orders.reduce((sum, o) => sum + o.quantity, 0);

  const message = `
🏪 *RAHUL DRY CLEANERS* 🏪

नमस्ते ${data.customer.name} जी! 👋

आपका बिल तैयार है:

📊 *बिल विवरण:*
• कपड़ों की संख्या: ${itemCount}
• कुल राशि: ₹${totalAmount}
• पिछली बकाया: ₹${data.totalDue}
${data.advanceCredit > 0 ? `• जमा राशि: ₹${data.advanceCredit}` : ''}
• बाकी राशि: ₹${data.netBalance}

📅 बिल तिथि: ${new Date().toLocaleDateString('en-IN')}

${data.netBalance > 0 ? '⏰ कृपया जल्द से जल्द भुगतान करें 🙏' : '✅ आपका खाता सेटल है!'}

धन्यवाद! 🎉
  `.trim();

  return encodeURIComponent(message);
}

/**
 * Download PDF as file
 */
export function downloadPDF(billData: BillData): void {
  const html = generateBillHTML(billData);
  const blob = new Blob([html], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Bill_${billData.customer.name}_${new Date().getTime()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

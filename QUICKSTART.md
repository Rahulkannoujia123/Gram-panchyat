# Quick Start Guide - Rahul Dry Cleaners

## 30-Second Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000 in **Chrome** or **Edge** (best browser support for voice)

## How It Works

### 1️⃣ Speak Customer Order
"कैटरीना ओके पांच कपड़े" (Katerina 5 clothes)

### 2️⃣ Order Auto-Saves
- Customer: कैटरीना ओके
- Quantity: 5
- Amount: ₹40 (5 × ₹8/item)
- Status: Pending

### 3️⃣ Voice Confirms
App speaks: "ठीक है, कैटरीना ओके के 5 कपड़े नोट कर लिए हैं। कुल राशि 40 रुपये है।"

### 4️⃣ Complete Order
Click "Complete" when pressed/delivered

### 5️⃣ Track Balance
- View customer balance (how much they owe)
- Send reminders via WhatsApp
- Export bill as PDF

### 6️⃣ View Analytics
- Daily revenue
- Customer metrics
- Payment history

## Voice Commands (Hindi & English)

### Hindi Examples
- "राज दस कपड़े" → Raj, 10 clothes
- "शर्मा जी पाँच" → Sharma, 5 clothes
- "कैटरीना तीन कपड़े" → Katerina, 3 clothes

### English Examples
- "John 5 clothes" → John, 5 clothes
- "Smith 10 shirts" → Smith, 10 items
- "Sarah 3 kapde" → Sarah, 3 items

## App Tabs

| Tab | What It Does |
|-----|-------------|
| **📦 ऑर्डर** | View all pending/completed orders |
| **👥 ग्राहक** | Track customer balance & dues |
| **📊 विश्लेषण** | View daily revenue & analytics |
| **⚙️ सेटिंग** | Backup data, clear all, info |

## Keyboard Shortcuts

| Action | Keys |
|--------|------|
| Toggle Mic | Click Button or `M` |
| Change Language | Click HI/EN buttons |
| Switch Tab | Click tab buttons |

## Key Features

✅ **Automatic Billing**: ₹8 × quantity auto-calculated  
✅ **Voice Recognition**: Speak in Hindi or English  
✅ **Order Tracking**: Pending → Completed workflow  
✅ **Customer Management**: Track balance, payments, dues  
✅ **WhatsApp Ready**: Send bills directly to customers  
✅ **PDF Export**: Download customer invoices  
✅ **Analytics Dashboard**: Daily revenue insights  
✅ **Local Storage**: No internet needed after setup  

## Common Tasks

### Add New Order
1. Press Microphone button
2. Speak: "[Name] [Number] [कपड़े/clothes]"
3. ✅ Order saved automatically

### Complete Order
1. Find order in "📦 ऑर्डर" tab
2. Click "पूरा करें" button
3. ✅ Order moves to completed

### Check Customer Balance
1. Go to "👥 ग्राहक" tab
2. Find customer name
3. See balance (बकाया = owes, जमा = advance)

### Send WhatsApp
1. Click "WhatsApp" on any completed order
2. Choose customer from list or enter phone
3. ✅ Message sent automatically

### Export Bill
1. Go to "👥 ग्राहक" tab
2. Click "बिल" (Bill) button
3. Download PDF or share

### View Analytics
1. Click "📊 विश्लेषण" tab
2. See daily revenue, top customers, trends
3. Export data if needed

## Troubleshooting

### ❌ Mic Not Working
- Use **Chrome** or **Edge** browser
- Allow microphone permission
- Check that site is HTTPS

### ❌ Orders Not Saving
- Enable localStorage in browser
- Don't use private/incognito mode
- Check browser console for errors

### ❌ Voice Not Recognizing
- Speak clearly and slowly
- Ensure good microphone
- Try simpler commands first

### ❌ WhatsApp Not Working
- Save customer phone number first
- Use format: 91XXXXXXXXXX (with country code)
- Ensure WhatsApp is on your phone

## Tips & Tricks

💡 **Tip 1**: Save customer names to avoid re-entering phone numbers  
💡 **Tip 2**: Use "पूरा करें" immediately after pressing to keep orders organized  
💡 **Tip 3**: Check analytics daily to track revenue  
💡 **Tip 4**: Export backup regularly in settings tab  
💡 **Tip 5**: Test voice in quiet environment first  

## Data Storage

- All data stored in browser (localStorage)
- No internet connection needed after first visit
- Data persists between sessions
- Can export backup as JSON file
- Clear all data in settings if needed

## Next Steps

1. ✅ Test voice recognition
2. ✅ Add 5 test orders
3. ✅ Complete 2-3 orders
4. ✅ Check analytics
5. ✅ Deploy to Vercel (see DEPLOYMENT.md)

## Need Help?

- Check README.md for detailed features
- See DEPLOYMENT.md for hosting guide
- Check browser console for error messages
- Try in different browser if issues persist

---

**Ready?** Press the microphone button and start taking orders! 🎙️

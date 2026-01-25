# Meta Conversions API & Pixel Tracking Setup

This project now includes full Meta Pixel and Conversions API (CAPI) tracking for Purchase events.

## Prerequisites

To enable Server-Side Tracking (CAPI), you must add the following environment variables to your **BACKEND** `.env` file (`backend/.env`):

```env
# Meta / Facebook Pixel & CAPI
META_PIXEL_ID=your_pixel_id_here
META_API_ACCESS_TOKEN=your_long_lived_access_token_here
```

### How to get the Access Token:
1. Go to **Meta Events Manager**.
2. Select your Pixel > **Settings**.
3. Scroll down to **Conversions API**.
4. Click **Generate Access Token**.
5. Copy the token and paste it into `backend/.env`.

## Implementation Details

### 1. Frontend (Pixel)
- File: `src/utils/metaPixel.ts` - Helper to fire Pixel events.
- File: `src/components/login/Checkout.tsx` - Fires `Purchase` event upon successful Razorpay payment.
- File: `src/app/payment/success/page.js` - Fires `Purchase` event upon successful payment verification on the success page.
- **Deduplication**: Uses `order.id` (Database UUID) as the `eventID`.

### 2. Backend (CAPI)
- File: `backend/src/utils/metaCapi.js` - Utility to send events to Meta Graph API.
- File: `backend/src/controllers/paymentController.js` - Triggers CAPI `Purchase` event immediately after payment verification (for Razorpay, PhonePe, and Payment Links).
- **Deduplication**: Uses the same `order.id` (Database UUID) as `event_id` to ensure Meta can deduplicate events received from both Pixel and Server.
- **User Data**: Hashes Email, Phone, First Name, and Last Name before sending to Meta.

## Verification
1. **Pixel**: Use "Meta Pixel Helper" Chrome extension. You should see `Purchase` event fire on the Order Success / My Orders page after payment.
2. **CAPI**: Check "Events Manager" > "Test Events". You should see events coming from "Server" with the same `event_id` as Browser events. They should show as "Deduplicated".

## Troubleshooting
- If events are not appearing, check `backend/.env` credentials.
- Check backend logs for "Meta CAPI Error" or "Meta CAPI Purchase Sent".

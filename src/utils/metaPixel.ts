export const trackPurchase = (data: {
  value: number;
  currency: string;
  orderId: string;
  items: any[];
}) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq('track', 'Purchase', {
      value: data.value,
      currency: data.currency,
      content_ids: data.items.map((item) => item.id || item.productId || item.item_id),
      content_type: 'product',
      num_items: data.items.reduce((acc, item) => acc + (item.quantity || 1), 0),
      order_id: data.orderId,
    }, { eventID: data.orderId }); // Pass eventID as the third argument for deduplication
  }
};

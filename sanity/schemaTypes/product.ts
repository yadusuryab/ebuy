// sanity/schemas/order.ts

export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  orderings: [
    {
      title: 'Newest First',
      name: 'orderedAtDesc',
      by: [{ field: 'orderedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'orderStatus',
      description: 'totalAmount',
    },
    prepare({ title, subtitle, description }: any) {
      const statusEmoji: Record<string, string> = {
        pending: '🕐',
        processing: '⚙️',
        shipped: '🚚',
        delivered: '✅',
        cancelled: '❌',
      };
      return {
        title: title,
        subtitle: `${statusEmoji[subtitle] ?? ''} ${subtitle?.toUpperCase()} · ₹${description ?? 0}`,
      };
    },
  },
  fields: [
    // ── Customer ────────────────────────────────────────────────────────────
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule: any) => Rule.required().min(2),
    },
    {
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      validation: (Rule: any) => Rule.required().min(10).max(15),
    },
    {
      name: 'alternatePhone',
      title: 'Alternate Phone',
      type: 'string',
    },
    {
      name: 'instagramId',
      title: 'Instagram ID',
      type: 'string',
    },

    // ── Address ─────────────────────────────────────────────────────────────
    {
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.required().min(10),
    },
    {
      name: 'landmark',
      title: 'Landmark',
      type: 'string',
    },
    {
      name: 'district',
      title: 'District',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'state',
      title: 'State',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'pincode',
      title: 'Pincode',
      type: 'string',
      validation: (Rule: any) =>
        Rule.required().regex(/^[1-9][0-9]{5}$/, {
          name: 'pincode',
          invert: false,
        }),
    },

    // ── Products ─────────────────────────────────────────────────────────────
    {
      name: 'products',
      title: 'Ordered Products',
      type: 'array',
      validation: (Rule: any) => Rule.required().min(1),
      of: [
        {
          type: 'object',
          name: 'orderItem',
          title: 'Order Item',
          preview: {
            select: {
              title: 'product.name',
              qty: 'quantity',
              size: 'size',
              color: 'color',
            },
            prepare({ title, qty, size, color }: any) {
              const variants = [size, color].filter(Boolean).join(' · ');
              return {
                title: title ?? 'Unknown Product',
                subtitle: `Qty: ${qty ?? 1}${variants ? ` · ${variants}` : ''}`,
              };
            },
          },
          fields: [
            {
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule: any) => Rule.required().min(1).integer(),
            },
            {
              name: 'size',
              title: 'Selected Size',
              type: 'string',
            },
            {
              name: 'color',
              title: 'Selected Color',
              type: 'string',
            },
          ],
        },
      ],
    },

    // ── Payment ──────────────────────────────────────────────────────────────
    {
      name: 'paymentMode',
      title: 'Payment Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Online Payment', value: 'online' },
          { title: 'Cash on Delivery', value: 'cod' },
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'paymentStatus',
      title: 'Payment Received',
      type: 'boolean',
      initialValue: false,
      description: 'Mark true once advance/full payment is confirmed',
    },
    {
      name: 'transactionId',
      title: 'Transaction ID',
      type: 'string',
      description: 'UPI / payment gateway transaction reference',
    },
    {
      name: 'shippingCharges',
      title: 'Shipping Charges (₹)',
      type: 'number',
      initialValue: 0,
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: 'totalAmount',
      title: 'Total Amount (₹)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'advanceAmount',
      title: 'Advance Paid (₹)',
      type: 'number',
      initialValue: 0,
      validation: (Rule: any) => Rule.min(0),
      description: 'For COD: advance collected upfront. For online: equals total.',
    },
    {
      name: 'codRemaining',
      title: 'COD Remaining (₹)',
      type: 'number',
      initialValue: 0,
      validation: (Rule: any) => Rule.min(0),
      description: 'Amount to collect on delivery (0 for online orders)',
    },

    // ── Status ───────────────────────────────────────────────────────────────
    {
      name: 'orderStatus',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: '🕐 Pending', value: 'pending' },
          { title: '⚙️ Processing', value: 'processing' },
          { title: '🚚 Shipped', value: 'shipped' },
          { title: '✅ Delivered', value: 'delivered' },
          { title: '❌ Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'trackingId',
      title: 'Tracking ID / AWB',
      type: 'string',
      description: 'Courier tracking number once shipped',
    },
    {
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 2,
      description: 'Visible only in Sanity Studio',
    },

    // ── Timestamps ───────────────────────────────────────────────────────────
    {
      name: 'orderedAt',
      title: 'Ordered At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    },
  ],
};
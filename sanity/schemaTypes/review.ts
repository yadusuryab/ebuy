export default {
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    {
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
    },
    {
      name: 'name',
      title: 'Reviewer Name',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'instaId',
      title: 'Instagram ID',
      type: 'string',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule:any) => Rule.min(1).max(5),
    },
    {
      name: 'review',
      title: 'Review Text',
      type: 'text',
    },
    {
      name: 'images',
      title: 'Review Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description: 'Important for SEO and accessibility',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: new Date().toISOString(),
      readOnly: true,
    },
  ],
};
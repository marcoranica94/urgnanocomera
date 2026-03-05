import type { CollectionConfig } from 'payload'

export const TimelineEvents: CollectionConfig = {
  slug: 'timeline-events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['year', 'title', 'category'],
  },
  fields: [
    {
      name: 'year',
      type: 'number',
      required: true,
      label: 'Anno',
      min: 1900,
      max: 2000,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titolo evento',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrizione',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoria',
      options: [
        { label: 'Storia e politica', value: 'storia' },
        { label: 'Tradizioni', value: 'tradizione' },
        { label: 'Urbanistica', value: 'urbanistica' },
        { label: 'Vita di comunità', value: 'comunità' },
      ],
    },
    {
      name: 'photos',
      type: 'relationship',
      relationTo: 'photos',
      hasMany: true,
      label: 'Foto correlate',
    },
  ],
}

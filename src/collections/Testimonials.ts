import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'person', 'status'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titolo',
    },
    {
      name: 'person',
      type: 'text',
      label: 'Testimone (nome, con consenso GDPR)',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Tipo',
      options: [
        { label: 'Video', value: 'video' },
        { label: 'Audio', value: 'audio' },
        { label: 'Testo scritto', value: 'written' },
      ],
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'File video/audio',
      admin: {
        condition: (data) => data.type === 'video' || data.type === 'audio',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Testo (per tipo "scritto" o trascrizione)',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Sommario',
    },
    {
      name: 'year',
      type: 'number',
      label: 'Anno a cui si riferisce il racconto',
      min: 1900,
      max: 2000,
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      label: 'Luogo',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tag',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'gdprConsent',
      type: 'checkbox',
      label: 'Consenso GDPR ottenuto dal testimone',
      defaultValue: false,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Stato',
      options: [
        { label: 'Pubblicata', value: 'published' },
        { label: 'In attesa', value: 'pending' },
        { label: 'Rifiutata', value: 'rejected' },
      ],
      defaultValue: 'pending',
      required: true,
    },
  ],
}

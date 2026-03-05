import type { CollectionConfig } from 'payload'

export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'status'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titolo',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL',
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Sommario (usato in anteprima e OpenGraph)',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Immagine di copertina',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenuto (blocchi multimediali)',
    },
    {
      name: 'relatedPhotos',
      type: 'relationship',
      relationTo: 'photos',
      hasMany: true,
      label: 'Foto correlate',
    },
    {
      name: 'relatedTestimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      label: 'Testimonianze correlate',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tag',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Stato',
      options: [
        { label: 'Pubblicata', value: 'published' },
        { label: 'Bozza', value: 'draft' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data pubblicazione',
    },
  ],
}

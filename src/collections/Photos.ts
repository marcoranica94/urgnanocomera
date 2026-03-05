import type { CollectionConfig } from 'payload'
import { indexPhoto, deletePhotoFromIndex } from '../lib/meilisearch.ts'

export const Photos: CollectionConfig = {
  slug: 'photos',
  hooks: {
    afterChange: [
      async ({ doc }) => { await indexPhoto(doc) },
    ],
    afterDelete: [
      async ({ id }) => { await deletePhotoFromIndex(id) },
    ],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'location', 'status'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titolo',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrizione',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Fotografia',
    },
    {
      name: 'year',
      type: 'number',
      label: 'Anno stimato',
      min: 1800,
      max: 2000,
      admin: { description: 'Es: 1965' },
    },
    {
      name: 'decade',
      type: 'select',
      label: 'Decennio',
      options: [
        '1900-1910','1910-1920','1920-1930','1930-1940','1940-1950',
        '1950-1960','1960-1970','1970-1980','1980-1990','1990-2000',
      ].map(d => ({ label: d, value: d })),
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
      name: 'uploader',
      type: 'select',
      label: 'Fonte',
      options: [
        { label: 'Archivio comunale', value: 'admin' },
        { label: 'Contributo cittadino', value: 'citizen' },
      ],
      defaultValue: 'admin',
      required: true,
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

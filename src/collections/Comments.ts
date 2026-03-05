import type {CollectionConfig} from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'photo', 'isTagging', 'status'],
  },
  fields: [
    {
      name: 'photo',
      type: 'relationship',
      relationTo: 'photos',
      required: true,
      label: 'Fotografia',
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      label: 'Nome (pubblico)',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Testo del commento',
    },
    {
      name: 'isTagging',
      type: 'checkbox',
      label: 'Commento di identificazione/censimento',
      defaultValue: false,
      admin: {
        description: 'Spunta se questo commento identifica persone o luoghi nella foto',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Stato moderazione',
      defaultValue: 'pending',
      options: [
        { label: 'Pubblicato', value: 'published' },
        { label: 'In attesa', value: 'pending' },
        { label: 'Rifiutato', value: 'rejected' },
      ],
    },
  ],
  timestamps: true,
}

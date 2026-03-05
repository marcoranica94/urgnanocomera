import type {CollectionConfig} from 'payload'

export const Contributions: CollectionConfig = {
  slug: 'contributions',
  admin: {
    useAsTitle: 'submitterName',
    defaultColumns: ['submitterName', 'type', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Tipo contributo',
      options: [
        { label: 'Fotografia', value: 'photo' },
        { label: 'Video', value: 'video' },
        { label: 'Audio', value: 'audio' },
        { label: 'Racconto scritto', value: 'story' },
      ],
    },
    {
      name: 'submitterName',
      type: 'text',
      required: true,
      label: 'Nome del mittente',
    },
    {
      name: 'submitterEmail',
      type: 'email',
      required: true,
      label: 'Email (non visibile pubblicamente)',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Descrizione del contributo',
    },
    {
      name: 'estimatedYear',
      type: 'number',
      label: 'Anno stimato',
      min: 1800,
      max: 2000,
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      label: 'Luogo (se noto)',
    },
    {
      name: 'files',
      type: 'array',
      label: 'File allegati',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'gdprConsent',
      type: 'checkbox',
      required: true,
      label: 'Consenso GDPR fornito dal cittadino',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Stato moderazione',
      defaultValue: 'pending',
      options: [
        { label: 'In attesa', value: 'pending' },
        { label: 'Approvato', value: 'approved' },
        { label: 'Rifiutato', value: 'rejected' },
      ],
    },
    {
      name: 'moderationNote',
      type: 'textarea',
      label: 'Note moderatore (interne)',
    },
  ],
  timestamps: true,
}

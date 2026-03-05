import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Amministratore', value: 'admin' },
        { label: 'Moderatore', value: 'moderator' },
      ],
      defaultValue: 'moderator',
      required: true,
      label: 'Ruolo',
    },
  ],
}

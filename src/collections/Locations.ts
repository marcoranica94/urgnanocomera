import type { CollectionConfig } from 'payload'

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome del luogo',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL',
      admin: { description: 'Es: piazza-roma, via-mazzini' },
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
        { label: 'Piazza', value: 'piazza' },
        { label: 'Via', value: 'via' },
        { label: 'Edificio storico', value: 'edificio' },
        { label: 'Campagna', value: 'campagna' },
        { label: 'Altro', value: 'altro' },
      ],
    },
    {
      name: 'coordinates',
      type: 'group',
      label: 'Coordinate GPS',
      fields: [
        { name: 'lat', type: 'number', label: 'Latitudine' },
        { name: 'lng', type: 'number', label: 'Longitudine' },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Immagine di copertina',
    },
  ],
}

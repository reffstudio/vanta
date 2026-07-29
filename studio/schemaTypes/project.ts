import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título del Proyecto',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Conciertos / Eventos Masivos', value: 'Conciertos' },
          { title: 'Sesión Personal', value: 'Personal' },
          { title: 'Pareja / Familia', value: 'Pareja/Familia' },
          { title: 'Video & Producción', value: 'Video' },
        ],
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen Principal (Tarjeta)',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galería para el Pop-up',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'description',
      title: 'Descripción / Detalles',
      type: 'text',
    }),
    defineField({
      name: 'date',
      title: 'Fecha del Proyecto',
      type: 'date',
    }),
  ],
})
import { ImageIcon, PlayIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export const mediaItem = defineType({
  name: "mediaItem",
  title: "Medio",
  type: "object",
  fields: [
    defineField({
      name: "mediaType",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Foto", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== "image",
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
    defineField({
      name: "caption",
      title: "Descripción (opcional)",
      type: "string",
    }),
  ],
  preview: {
    select: {
      mediaType: "mediaType",
      image: "image",
      caption: "caption",
    },
    prepare({ mediaType, image, caption }) {
      return {
        title: caption || (mediaType === "video" ? "Video" : "Foto"),
        subtitle: mediaType === "video" ? "Video" : "Foto",
        media: mediaType === "image" ? image : PlayIcon,
      }
    },
  },
})

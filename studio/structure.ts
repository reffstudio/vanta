import type { StructureResolver } from "sanity/structure"
import { FolderIcon, TagIcon } from "@sanity/icons"

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Proyectos")
        .icon(FolderIcon)
        .child(S.documentTypeList("project").title("Proyectos")),
      S.listItem()
        .title("Categorías")
        .icon(TagIcon)
        .child(S.documentTypeList("category").title("Categorías")),
    ])

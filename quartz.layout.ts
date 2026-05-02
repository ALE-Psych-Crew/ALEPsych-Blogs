import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "Publicaciones recientes",
        limit: 5,
        emptyMessage: "Aún no hay publicaciones. Vuelve pronto para ver novedades.",
        filter: (file) =>
          !!file.slug &&
          file.slug !== "index" &&
          !file.slug.startsWith("tags/") &&
          !file.slug.startsWith("folder/") &&
          !file.slug.startsWith("static/"),
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.PostNavigation(),
      condition: (page) => {
        const slug = page.fileData.slug
        return (
          !!slug &&
          slug !== "index" &&
          !slug.startsWith("tags/") &&
          !slug.startsWith("folder/") &&
          !slug.startsWith("static/")
        )
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      "Sitio oficial ALE Psych": "https://ale-psych-crew.github.io/ALE-Psych-Site/",
      "Repositorio del blog": "https://github.com/ALE-Psych-Crew/ALEPsych-Blogs",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.Graph({
      localGraph: {
        showTags: false,
      },
      globalGraph: {
        showTags: false,
      },
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}

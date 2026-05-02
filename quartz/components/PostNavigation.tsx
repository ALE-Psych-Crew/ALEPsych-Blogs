import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import { isFolderPath, resolveRelative, SimpleSlug } from "../util/path"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import style from "./styles/postNavigation.scss"

interface Options {
  filter: (f: QuartzPluginData) => boolean
}

const defaultOptions: Options = {
  filter: (file) =>
    !!file.slug &&
    file.slug !== "index" &&
    !isFolderPath(file.slug) &&
    !file.slug.startsWith("tags/") &&
    !file.slug.startsWith("folder/") &&
    !file.slug.startsWith("static/"),
}

export default ((userOpts?: Partial<Options>) => {
  const PostNavigation: QuartzComponent = ({
    allFiles,
    fileData,
    cfg,
    displayClass,
  }: QuartzComponentProps) => {
    if (!fileData.slug) {
      return null
    }

    const opts = { ...defaultOptions, ...userOpts }
    const posts = allFiles.filter(opts.filter).sort(byDateAndAlphabetical(cfg))
    const currentPostIndex = posts.findIndex((file) => file.slug === fileData.slug)

    if (currentPostIndex === -1) {
      return null
    }

    const olderPost = posts[currentPostIndex + 1]
    const newerPost = posts[currentPostIndex - 1]
    const defaultTitle = i18n(cfg.locale).propertyDefaults.title
    const isSpanishLocale = cfg.locale.startsWith("es")

    const labels = isSpanishLocale
      ? {
          previous: "Publicación anterior",
          returnToBlog: "Volver al blog",
          next: "Siguiente publicación",
        }
      : {
          previous: "Previous post",
          returnToBlog: "Return to blog",
          next: "Next post",
        }

    const blogSlug = "index" as SimpleSlug

    return (
      <nav class={classNames(displayClass, "post-navigation")} aria-label={labels.returnToBlog}>
        {olderPost ? (
          <a
            class="post-navigation-link previous"
            href={resolveRelative(fileData.slug, olderPost.slug!)}
          >
            <span class="post-navigation-label">{labels.previous}</span>
            <span class="post-navigation-title">
              {olderPost.frontmatter?.title ?? defaultTitle}
            </span>
          </a>
        ) : (
          <div class="post-navigation-spacer" aria-hidden="true" />
        )}

        <a class="post-navigation-link return" href={resolveRelative(fileData.slug, blogSlug)}>
          <span class="post-navigation-label">{labels.returnToBlog}</span>
        </a>

        {newerPost ? (
          <a
            class="post-navigation-link next"
            href={resolveRelative(fileData.slug, newerPost.slug!)}
          >
            <span class="post-navigation-label">{labels.next}</span>
            <span class="post-navigation-title">
              {newerPost.frontmatter?.title ?? defaultTitle}
            </span>
          </a>
        ) : (
          <div class="post-navigation-spacer" aria-hidden="true" />
        )}
      </nav>
    )
  }

  PostNavigation.css = style
  return PostNavigation
}) satisfies QuartzComponentConstructor

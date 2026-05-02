import { Date, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"
import {
  formatAuthorsLabel,
  getAuthors,
  getGitHubUsername,
  getPrimaryAuthor,
} from "../util/authors"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

function getInitial(author?: string | null): string {
  if (!author) return "?"

  const normalized = (getGitHubUsername(author) ?? author).trim().replace(/^@+/, "")
  const firstAlphaNumeric = normalized.match(/[A-Za-z0-9]/)

  return firstAlphaNumeric ? firstAlphaNumeric[0].toUpperCase() : "?"
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        segments.push(<Date date={getDate(cfg, fileData)!} locale={cfg.locale} />)
      }

      const authors = getAuthors(fileData)
      if (authors.length > 0) {
        const primaryAuthor = getPrimaryAuthor(authors)
        const githubUsername = getGitHubUsername(primaryAuthor)
        const authorLabel = formatAuthorsLabel(authors, cfg.locale)

        segments.push(
          <span class="meta-authors-with-avatar">
            <span
              class="meta-author-avatar"
              aria-hidden="true"
              style={
                githubUsername
                  ? `--author-avatar-url: url('https://github.com/${githubUsername}.png?size=40')`
                  : undefined
              }
            >
              <span class="meta-author-avatar-fallback">{getInitial(primaryAuthor)}</span>
            </span>
            <span>{authorLabel}</span>
          </span>,
        )
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor

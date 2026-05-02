import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir} class="page-title-link" aria-label={title}>
        <img
          src={`${baseDir}/static/ale-psych-dev-blog-logo.png`}
          alt={title}
          class="page-title-logo"
          loading="eager"
          decoding="async"
        />
      </a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}

.page-title-link {
  display: inline-flex;
  align-items: center;
}

.page-title-logo {
  width: clamp(12.5rem, 18vw, 16.5rem);
  height: auto;
  display: block;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor

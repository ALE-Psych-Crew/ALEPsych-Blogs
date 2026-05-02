import { QuartzPluginData } from "../plugins/vfile"

function normalizeAuthorValue(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((author) => author.trim())
      .filter((author) => author.length > 0)
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((author) => (typeof author === "string" ? author.split(",") : []))
      .map((author) => author.trim())
      .filter((author) => author.length > 0)
  }

  return []
}

export function getAuthors(fileData: QuartzPluginData): string[] {
  const frontmatter = fileData.frontmatter
  if (!frontmatter || typeof frontmatter !== "object") {
    return []
  }

  const data = frontmatter as Record<string, unknown>
  const authorNames = normalizeAuthorValue(data.author)
  const authorsNames = normalizeAuthorValue(data.authors)

  return [...new Set([...authorNames, ...authorsNames])]
}

export function formatAuthorsLabel(authors: string[], locale: string): string {
  if (authors.length === 0) {
    return ""
  }

  const prefix = locale.startsWith("es") ? "Por" : "By"
  return `${prefix} ${authors.join(", ")}`
}

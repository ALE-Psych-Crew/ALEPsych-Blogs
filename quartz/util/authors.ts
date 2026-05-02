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

export function getPrimaryAuthor(authors: string[]): string | null {
  return authors.length > 0 ? authors[0] : null
}

export function getGitHubUsername(author?: string | null): string | null {
  if (!author) return null

  const normalized = author.trim()
  if (normalized.length === 0) return null

  const githubUrlMatch = normalized.match(/github\.com\/([A-Za-z0-9-]+)\/?/i)
  if (githubUrlMatch?.[1]) {
    return githubUrlMatch[1]
  }

  const handle = normalized.replace(/^@/, "")
  if (!/^[A-Za-z0-9-]+$/.test(handle)) return null

  return handle
}

export function formatAuthorsLabel(authors: string[], locale: string): string {
  if (authors.length === 0) {
    return ""
  }

  const prefix = locale.startsWith("es") ? "Por" : "By"
  return `${prefix} ${authors.join(", ")}`
}

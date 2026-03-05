'use client'

/**
 * Renderer minimo per il contenuto Lexical di Payload.
 * Gestisce: paragrafi, heading, bold/italic, link, quote.
 * Per blocchi multimediali custom (foto, audio, video) si estende qui.
 */

interface LexicalNode {
  type: string
  tag?: string
  text?: string
  format?: number
  url?: string
  children?: LexicalNode[]
  direction?: string
  indent?: number
  version?: number
}

interface LexicalRoot {
  root: { children: LexicalNode[] }
}

function renderNode(node: LexicalNode, key: string | number): React.ReactNode {
  switch (node.type) {
    case 'paragraph':
      return (
        <p key={key} className="leading-relaxed text-foreground">
          {node.children?.map((c, i) => renderNode(c, i))}
        </p>
      )

    case 'heading': {
      const Tag = (node.tag ?? 'h2') as 'h1' | 'h2' | 'h3' | 'h4'
      const classes: Record<string, string> = {
        h2: 'font-serif text-2xl font-bold text-foreground mt-8 mb-3',
        h3: 'font-serif text-xl font-bold text-foreground mt-6 mb-2',
        h4: 'font-serif text-lg font-semibold text-foreground mt-4 mb-1',
      }
      return (
        <Tag key={key} className={classes[Tag] ?? ''}>
          {node.children?.map((c, i) => renderNode(c, i))}
        </Tag>
      )
    }

    case 'text': {
      let content: React.ReactNode = node.text ?? ''
      // format è una bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code
      const fmt = node.format ?? 0
      if (fmt & 1) content = <strong>{content}</strong>
      if (fmt & 2) content = <em>{content}</em>
      if (fmt & 16) content = <code className="rounded bg-muted px-1 py-0.5 text-sm font-mono">{content}</code>
      return <span key={key}>{content}</span>
    }

    case 'link':
      return (
        <a
          key={key}
          href={node.url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:opacity-80"
        >
          {node.children?.map((c, i) => renderNode(c, i))}
        </a>
      )

    case 'quote':
      return (
        <blockquote key={key} className="my-4 border-l-4 border-accent pl-4 italic text-muted-foreground">
          {node.children?.map((c, i) => renderNode(c, i))}
        </blockquote>
      )

    case 'list': {
      const Tag = node.tag === 'ol' ? 'ol' : 'ul'
      const listClass = Tag === 'ol'
        ? 'list-decimal pl-6 space-y-1 text-foreground'
        : 'list-disc pl-6 space-y-1 text-foreground'
      return (
        <Tag key={key} className={listClass}>
          {node.children?.map((c, i) => renderNode(c, i))}
        </Tag>
      )
    }

    case 'listitem':
      return (
        <li key={key}>
          {node.children?.map((c, i) => renderNode(c, i))}
        </li>
      )

    case 'horizontalrule':
      return <hr key={key} className="my-6 border-border" />

    default:
      // Nodo sconosciuto: renderizza solo figli se presenti
      if (node.children?.length) {
        return <span key={key}>{node.children.map((c, i) => renderNode(c, i))}</span>
      }
      return null
  }
}

export function LexicalContent({ content }: { content: unknown }) {
  if (!content) return null
  const data = content as LexicalRoot
  if (!data?.root?.children) return null

  return (
    <div className="space-y-4 text-base">
      {data.root.children.map((node, i) => renderNode(node, i))}
    </div>
  )
}

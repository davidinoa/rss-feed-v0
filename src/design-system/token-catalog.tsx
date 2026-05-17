import * as React from 'react'
import {
  type PrimitiveColorToken,
  type RadiusToken,
  type SemanticColorToken,
} from './tokens'

function readCssVariable(name: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim()
}

function useCssVariable(name: string): string {
  const [value, setValue] = React.useState(() => readCssVariable(name))
  React.useEffect(() => {
    setValue(readCssVariable(name))
  }, [name])
  return value
}

function PrimitiveSwatch({ token }: { token: PrimitiveColorToken }) {
  const value = useCssVariable(token.name)
  return (
    <div className="border-border bg-card flex items-center gap-3 rounded-md border p-3">
      <div
        aria-hidden="true"
        className="border-border size-12 shrink-0 rounded border"
        style={{ background: `var(--${token.name})` }}
      />
      <div className="flex flex-col gap-0.5 font-mono text-xs">
        <span className="text-foreground">--{token.name}</span>
        <span className="text-muted-foreground">{value || '…'}</span>
      </div>
    </div>
  )
}

export function ColorSwatchGrid({
  tokens,
}: {
  tokens: readonly PrimitiveColorToken[]
}) {
  const grouped = React.useMemo(() => {
    const acc: Record<PrimitiveColorToken['category'], PrimitiveColorToken[]> =
      {
        neutral: [],
        blue: [],
        red: [],
        green: [],
        yellow: [],
      }
    for (const token of tokens) acc[token.category].push(token)
    return acc
  }, [tokens])

  return (
    <div className="flex flex-col gap-6">
      {(Object.keys(grouped) as PrimitiveColorToken['category'][])
        .filter((category) => grouped[category].length > 0)
        .map((category) => (
          <section key={category} className="flex flex-col gap-3">
            <h3 className="text-foreground text-sm font-semibold tracking-wide uppercase">
              {category}
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[category].map((token) => (
                <PrimitiveSwatch key={token.name} token={token} />
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}

function PrimitiveCell({ name }: { name: string }) {
  const value = useCssVariable(name)
  return (
    <div className="flex items-center gap-2">
      <div
        aria-hidden="true"
        className="border-border size-6 shrink-0 rounded border"
        style={{ background: `var(--${name})` }}
      />
      <div className="flex flex-col gap-0.5 font-mono text-xs">
        <span className="text-foreground">--{name}</span>
        <span className="text-muted-foreground">{value || '…'}</span>
      </div>
    </div>
  )
}

function SemanticRow({ token }: { token: SemanticColorToken }) {
  return (
    <tr className="border-border border-b last:border-0">
      <td className="px-3 py-3 align-top">
        <code className="text-foreground font-mono text-xs">
          --{token.name}
        </code>
      </td>
      <td className="px-3 py-3 align-top">
        <PrimitiveCell name={token.primitiveLight} />
      </td>
      <td className="px-3 py-3 align-top">
        <PrimitiveCell name={token.primitiveDark} />
      </td>
      <td className="px-3 py-3 align-top">
        <div className="flex flex-col gap-1">
          {token.utilities.map((utility) => (
            <code
              key={utility}
              className="text-foreground font-mono text-xs"
            >
              {utility}
            </code>
          ))}
        </div>
      </td>
      <td className="text-muted-foreground px-3 py-3 align-top text-sm">
        {token.usage}
      </td>
    </tr>
  )
}

export function SemanticTokenTable({
  tokens,
}: {
  tokens: readonly SemanticColorToken[]
}) {
  return (
    <div className="border-border overflow-x-auto rounded-md border">
      <table className="w-full border-collapse">
        <caption className="sr-only">
          Semantic color tokens with their light and dark mode primitive
          references, Tailwind utility names, and usage guidance.
        </caption>
        <thead className="bg-muted">
          <tr>
            <th
              scope="col"
              className="text-foreground px-3 py-2 text-left text-xs font-semibold"
            >
              Token
            </th>
            <th
              scope="col"
              className="text-foreground px-3 py-2 text-left text-xs font-semibold"
            >
              Light
            </th>
            <th
              scope="col"
              className="text-foreground px-3 py-2 text-left text-xs font-semibold"
            >
              Dark
            </th>
            <th
              scope="col"
              className="text-foreground px-3 py-2 text-left text-xs font-semibold"
            >
              Tailwind utility
            </th>
            <th
              scope="col"
              className="text-foreground px-3 py-2 text-left text-xs font-semibold"
            >
              Usage
            </th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <SemanticRow key={token.name} token={token} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function RadiusCard({ token }: { token: RadiusToken }) {
  const value = useCssVariable(token.name)
  return (
    <div className="border-border bg-card flex flex-col items-center gap-3 rounded-md border p-4">
      <div
        aria-hidden="true"
        className="bg-primary size-20"
        style={{ borderRadius: `var(--${token.name})` }}
      />
      <div className="flex flex-col items-center gap-0.5 font-mono text-xs">
        <code className="text-foreground">--{token.name}</code>
        <code className="text-muted-foreground">{value || '…'}</code>
        <code className="text-foreground mt-1">{token.utility}</code>
      </div>
    </div>
  )
}

export function RadiusScale({ tokens }: { tokens: readonly RadiusToken[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {tokens.map((token) => (
        <RadiusCard key={token.name} token={token} />
      ))}
    </div>
  )
}

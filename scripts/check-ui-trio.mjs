#!/usr/bin/env node
/**
 * Enforces the UI-component trio convention.
 *
 * Every primitive in src/components/ui/ must ship as three siblings:
 *   - <name>.tsx          the component
 *   - <name>.meta.ts      machine-readable metadata (see ai-component-metadata)
 *   - <name>.stories.tsx  Storybook story (smoke render + axe a11y check)
 *
 * The script walks `src/components/ui/`, finds every `.tsx` that isn't itself
 * a story, and confirms the two siblings exist. Exits non-zero on any gap.
 *
 * Rationale: PR #61 shipped Input / Label / Toaster with .meta.ts but no
 * stories, silently skipping axe a11y coverage. Docs alone were too leaky;
 * this CI gate is the hard guard. See issue #63.
 */

import { existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const UI_DIR = join(REPO_ROOT, 'src', 'components', 'ui')

const entries = readdirSync(UI_DIR, { withFileTypes: true })

const components = entries
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith('.tsx') &&
      !entry.name.endsWith('.stories.tsx'),
  )
  .map((entry) => entry.name.replace(/\.tsx$/, ''))

const missing = []
for (const name of components) {
  const gaps = []
  if (!existsSync(join(UI_DIR, `${name}.meta.ts`))) {
    gaps.push(`${name}.meta.ts`)
  }
  if (!existsSync(join(UI_DIR, `${name}.stories.tsx`))) {
    gaps.push(`${name}.stories.tsx`)
  }
  if (gaps.length > 0) {
    missing.push({ name, gaps })
  }
}

if (missing.length === 0) {
  const noun = components.length === 1 ? 'primitive' : 'primitives'
  console.log(
    `✓ check-ui-trio: ${components.length} ${noun} in src/components/ui/, all trios present.`,
  )
  process.exit(0)
}

console.error('✗ check-ui-trio: missing trio siblings\n')
for (const { name, gaps } of missing) {
  console.error(`  src/components/ui/${name}.tsx is missing:`)
  for (const gap of gaps) {
    console.error(`    - src/components/ui/${gap}`)
  }
}
console.error('')
console.error('Every component in src/components/ui/ must ship with all three:')
console.error('  - <name>.tsx          the component')
console.error('  - <name>.meta.ts      machine-readable metadata')
console.error('  - <name>.stories.tsx  Storybook story + axe a11y check')
console.error('')
console.error(
  'See docs/design-system.md § Adding a shadcn component for the workflow.',
)
process.exit(1)

import { describe, expect, it } from 'vitest'
import { PRIMITIVE_COLOR_TOKENS, SEMANTIC_COLOR_TOKENS } from './tokens'

describe('SEMANTIC_COLOR_TOKENS', () => {
  const primitiveNames = new Set(PRIMITIVE_COLOR_TOKENS.map((p) => p.name))

  it('every primitiveLight reference exists in PRIMITIVE_COLOR_TOKENS', () => {
    for (const token of SEMANTIC_COLOR_TOKENS) {
      expect(
        primitiveNames.has(token.primitiveLight),
        `--${token.name} references unknown light-mode primitive --${token.primitiveLight}`,
      ).toBe(true)
    }
  })

  it('every primitiveDark reference exists in PRIMITIVE_COLOR_TOKENS', () => {
    for (const token of SEMANTIC_COLOR_TOKENS) {
      expect(
        primitiveNames.has(token.primitiveDark),
        `--${token.name} references unknown dark-mode primitive --${token.primitiveDark}`,
      ).toBe(true)
    }
  })
})

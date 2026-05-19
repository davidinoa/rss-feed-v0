/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import { describe, expect, test } from 'vitest'
import { api } from './_generated/api'
import schema from './schema'

const modules = import.meta.glob('./**/*.{ts,js}')

describe('subscriptions.list', () => {
  test('returns [] when not authenticated', async () => {
    const t = convexTest(schema, modules)
    const result = await t.query(api.subscriptions.list)
    expect(result).toEqual([])
  })

  test("returns only the calling user's Subscriptions, joined with Source", async () => {
    const t = convexTest(schema, modules)

    await t.run(async (ctx) => {
      const aliceSourceId = await ctx.db.insert('sources', {
        url: 'https://alice.example/feed.xml',
        title: 'Alice Source',
        subscriberCount: 1,
      })
      const bobSourceId = await ctx.db.insert('sources', {
        url: 'https://bob.example/feed.xml',
        title: 'Bob Source',
        subscriberCount: 1,
      })
      await ctx.db.insert('subscriptions', {
        userId: 'alice',
        sourceId: aliceSourceId,
        addedAt: Date.now(),
      })
      await ctx.db.insert('subscriptions', {
        userId: 'bob',
        sourceId: bobSourceId,
        addedAt: Date.now(),
      })
    })

    const asAlice = t.withIdentity({ tokenIdentifier: 'alice' })
    const aliceResult = await asAlice.query(api.subscriptions.list)
    expect(aliceResult).toHaveLength(1)
    expect(aliceResult[0].source?.title).toBe('Alice Source')

    const asBob = t.withIdentity({ tokenIdentifier: 'bob' })
    const bobResult = await asBob.query(api.subscriptions.list)
    expect(bobResult).toHaveLength(1)
    expect(bobResult[0].source?.title).toBe('Bob Source')
  })

  test('returns Subscriptions newest-first', async () => {
    const t = convexTest(schema, modules)

    await t.run(async (ctx) => {
      const sourceId = await ctx.db.insert('sources', {
        url: 'https://example.com/feed.xml',
        title: 'Example',
        subscriberCount: 2,
      })
      await ctx.db.insert('subscriptions', {
        userId: 'alice',
        sourceId,
        customTitle: 'first',
        addedAt: 1_000,
      })
      // brief wait so _creationTime differs
      await new Promise((r) => setTimeout(r, 5))
      await ctx.db.insert('subscriptions', {
        userId: 'alice',
        sourceId,
        customTitle: 'second',
        addedAt: 2_000,
      })
    })

    const asAlice = t.withIdentity({ tokenIdentifier: 'alice' })
    const subs = await asAlice.query(api.subscriptions.list)
    expect(subs).toHaveLength(2)
    expect(subs[0].customTitle).toBe('second')
    expect(subs[1].customTitle).toBe('first')
  })

  test('exposes only the fields the UI needs (customTitle, source projection)', async () => {
    const t = convexTest(schema, modules)
    await t.run(async (ctx) => {
      const sourceId = await ctx.db.insert('sources', {
        url: 'https://example.com/feed.xml',
        title: 'Example',
        subscriberCount: 1,
        description: 'should be hidden in slice 1',
      })
      await ctx.db.insert('subscriptions', {
        userId: 'alice',
        sourceId,
        customTitle: 'My pick',
        addedAt: 1,
      })
    })

    const asAlice = t.withIdentity({ tokenIdentifier: 'alice' })
    const [sub] = await asAlice.query(api.subscriptions.list)
    expect(sub.customTitle).toBe('My pick')
    expect(sub.source).toMatchObject({
      url: 'https://example.com/feed.xml',
      title: 'Example',
    })
    // description is NOT projected in slice 1 — slice 2 adds it
    expect((sub.source as Record<string, unknown>).description).toBeUndefined()
  })
})

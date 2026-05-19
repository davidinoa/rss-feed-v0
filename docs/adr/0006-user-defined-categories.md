# User-defined Categories instead of a hardcoded enum

**Category** is its own per-user table (`categories: { userId, name, slug }`)
referenced from **Subscription** by optional `categoryId`. We dropped the
scaffold's hardcoded 4-value enum (`engineering | news | design | science`).

## Considered options

- **Hardcoded enum** (scaffold default). Cheapest, but feels like a straitjacket
  for a multi-user app — readers' interests don't fit four buckets.
- **Free-text string on Subscription**. No new table, but typos fragment the
  label space ("AI" / "ai" / "Artificial Intelligence") in a way that hurts
  exactly when you have enough data to want to fix it.
- **Per-user `categories` table** (chosen). One extra table, dedup-on-create by
  `slug`. Sets up rename / merge / "move all to Uncategorized" as first-class
  operations whenever we add Category management.

## Consequences

- Subscriptions can be _Uncategorized_ (categoryId is optional); we never
  force a pick at add-time.
- A future "Category management" feature owns rename / delete / reorder. Feed
  Management only needs: list a user's categories, create one inline, assign
  Subscription → Category.

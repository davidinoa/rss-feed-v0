# Split Source and Subscription into distinct tables

We're modelling RSS/Atom feeds as two entities from day one: a **Source** (the
remote document, one row per distinct URL) and a **Subscription** (one user's
follow of a Source, with per-user custom title, category, and read state). The
fetch worker polls each Source once regardless of how many users subscribe.

## Considered options

- **Single table with denormalised source fields and `userId`** (the original
  scaffold). Simpler today, but every additional subscriber to the same URL
  duplicates the polled-document metadata, and an eventual split is a migration
  touching schema + every query + UI labels.
- **Split into Source and Subscription** (chosen). One more table and one extra
  join on read, but fetch cost stays O(distinct URLs) instead of O(users ×
  URLs), and the language stops collapsing source-level state (title,
  description, last-fetched, health) with subscription-level state (custom
  title, category, read).

## Consequences

- Fields move: `title`, `siteUrl`, `iconUrl`, `description`, and any fetch
  health (`lastFetchedAt`, `lastFetchStatus`) live on **Source**.
  `customTitle`, `category`, and read state live on **Subscription**.
- "Feed" is retired as a noun in code and UI to keep the split sharp — see
  [CONTEXT.md](../../CONTEXT.md).
- Auth model: Sources are global (readable to authenticated users, mutable
  only by the fetch worker / source-add flow). Subscriptions are
  user-scoped.

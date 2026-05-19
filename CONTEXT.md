# rss-feed-v0

A multi-user RSS/Atom reader. Users subscribe to **Sources**, organize their
**Subscriptions** into categories, and read **Articles** in a unified timeline.

## Language

**Source**:
The remote RSS or Atom document we poll, identified by its feed URL. One row per
distinct URL, shared across all users who subscribe to it. Tracks fetch state
(`lastFetchedAt`, `lastFetchStatus`, `lastFetchError`) and publishing cadence
(`lastPublishedAt`).
_Avoid_: Feed (overloaded — see Flagged ambiguities), Channel, Site.

**Source Health**:
A derived (not stored) status describing a **Source**'s current state. Three
values, computed at read time from the Source's fetch and publishing fields:
- _active_ — last fetch succeeded **and** the most recent Article is < 30 days old.
- _stale_ — last fetch succeeded **but** the most recent Article is ≥ 30 days old (the publisher has gone quiet).
- _error_ — last fetch failed.

"Stale" describes the **publisher's** cadence, not our fetcher. A broken
fetcher is _error_, not _stale_.

**Subscription**:
One user's relationship to a **Source** — their custom title, their category,
their read state. Many Subscriptions point at the same Source.
_Avoid_: Feed, Following, Bookmark.

**Article**:
A single entry published by a **Source** (RSS `<item>` / Atom `<entry>`).
Stored once per Source, shared across all Subscriptions to that Source.
_Avoid_: Item, Entry, Post.

**Category**:
A user-defined label for grouping their **Subscriptions** (e.g. "Engineering",
"Comics"). Each user owns their own set; categories are not shared between
users. A Subscription is either assigned to one Category or _Uncategorized_.
_Avoid_: Folder, Group, Tag.

## Relationships

- A **Source** has many **Subscriptions** (one per user who follows it).
- A **Source** has many **Articles**.
- A **Subscription** belongs to exactly one user and exactly one **Source**.
- A **Subscription** is optionally assigned to one **Category**.
- A **Category** belongs to exactly one user.
- A user's read state on an **Article** is per-**Subscription** (one user can mark read; others still see it unread).

## Example dialogue

> **Dev:** "When a user adds a feed URL, do we always create a new **Source**?"
> **Domain expert:** "No — if a **Source** already exists for that URL, we just create a new **Subscription** pointing at it. The fetch worker only polls each **Source** once."

> **Dev:** "If the user edits the title, where does that go?"
> **Domain expert:** "On the **Subscription**. The **Source**'s title is whatever the RSS document advertises; the **Subscription** can override it."

## Flagged ambiguities

- "Feed" was used to mean both **Source** and **Subscription** — resolved: split into two distinct terms. RSS/Atom spec uses "feed" for the source document; we avoid the word entirely in code and prose to prevent the dual meaning from creeping back. ([ADR-0005](docs/adr/0005-source-subscription-split.md))

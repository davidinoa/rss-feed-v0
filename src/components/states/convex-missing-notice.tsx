/**
 * Renders when `VITE_CONVEX_URL` isn't set — replaces any UI that would
 * otherwise call into Convex (queries, actions, mutations). Lets the route
 * remain navigable for contributors who haven't run `pnpm convex:dev` yet
 * and for CI, where no backend is provisioned.
 */
export function ConvexMissingNotice() {
  return (
    <p className="text-muted-foreground text-sm">
      Backend not configured. Run <code>pnpm convex:dev</code> to provision a
      deployment, then refresh.
    </p>
  )
}

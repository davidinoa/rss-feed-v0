# Use @clerk/react instead of @clerk/tanstack-react-start

Status: accepted — revisit when @clerk/tanstack-react-start leaves beta or we need server-side auth

The TanStack-Start-specific Clerk SDK (`@clerk/tanstack-react-start`) ships server-side `auth()`, `getAuth()`, and `clerkMiddleware` that we'd genuinely use — but it's still in beta. Pinning a solo project's auth layer to a beta SDK is too much risk for too little upside; our current routes have no server-side auth needs and the client-only flow from `@clerk/react` (v6, GA) covers what we ship today. Reconsider when (a) `@clerk/tanstack-react-start` hits GA, or (b) we need `auth()` in a route loader or server function — whichever comes first.

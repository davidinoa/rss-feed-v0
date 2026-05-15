import { Show, SignInButton, UserButton } from '@clerk/react'
import { isClerkConfigured } from './provider'

export default function HeaderUser() {
  if (!isClerkConfigured) return null
  return (
    <>
      <Show when="signed-in">
        <UserButton />
      </Show>
      <Show when="signed-out">
        <SignInButton />
      </Show>
    </>
  )
}

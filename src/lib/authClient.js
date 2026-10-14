import { supabase } from './supabase'

// Supabase maps Microsoft to the `azure` provider id.
export const PROVIDERS = { google: 'google', microsoft: 'azure' }

export function toSupabaseProvider(provider) {
  return PROVIDERS[provider] || 'google'
}

export function providerLabel(provider) {
  return provider === 'microsoft' ? 'Microsoft' : 'Google'
}

// Kick off the provider OAuth flow when Supabase is configured.
// Returns { redirected: true } when the browser is being sent to the provider,
// or { demo: true } so the caller can collect the identity with the demo form.
export async function startOAuth(provider) {
  if (!supabase) return { demo: true }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: toSupabaseProvider(provider),
    options: {
      redirectTo: typeof window !== 'undefined' ? window.location.href : undefined
    }
  })
  if (error) throw error
  return { redirected: true }
}

// Reads the current Supabase session (after the OAuth redirect) and maps it to
// the profile shape used by findOrCreateUser.
export async function fetchSessionProfile() {
  if (!supabase) return null
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  const session = data?.session
  if (!session?.user) return null
  const meta = session.user.user_metadata || {}
  const provider = session.user.app_metadata?.provider
  return {
    email: session.user.email,
    name: meta.full_name || meta.name || session.user.email?.split('@')[0],
    avatar: meta.avatar_url || meta.picture || null,
    authFrom: provider === 'azure' ? 'microsoft' : 'google'
  }
}

export async function signOutRemote() {
  if (!supabase) return
  try {
    await supabase.auth.signOut()
  } catch {
    // best effort — local session is cleared regardless
  }
}

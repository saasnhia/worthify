import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

/**
 * GET /auth/confirm
 * Handles Supabase email confirmation links.
 * Supabase sends: /auth/confirm?token_hash=xxx&type=signup
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/login?error=missing_params`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({ token_hash, type })

  if (error) {
    console.error('[auth/confirm] verifyOtp error:', error.message)
    return NextResponse.redirect(`${origin}/login?error=verification_failed`)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types/user'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (mounted) {
          setUser(data.session?.user as User || null)
        }
      } catch (error) {
        console.error('Failed to load session:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user as User || null)
        setIsLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      setUser(data.user as User)
      return data
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      setUser(data.user as User)
      return data
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const getSession = async () => {
    const { data } = await supabase.auth.getSession()
    setUser(data.session?.user as User || null)
    return data.session
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    getSession,
  }
}
'use client'
// hooks/useAuth.ts
// Manages login state, token, and user across the entire app

import { useState, useEffect, useCallback } from 'react'
import { authApi, getToken, getStoredUser, setToken, setStoredUser, removeToken } from '@/lib/api'
import type { ApiUser } from '@/lib/api'

export interface AuthState {
  user:            ApiUser | null
  isAuthenticated: boolean
  isLoading:       boolean
  isAdmin:         boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user:            null,
    isAuthenticated: false,
    isLoading:       true,
    isAdmin:         false,
  })

  // On mount — read token + user from localStorage
  useEffect(() => {
    const token = getToken()
    const user  = getStoredUser()

    if (token && user) {
      setState({
        user,
        isAuthenticated: true,
        isLoading:       false,
        isAdmin:         user.role === 'ADMIN',
      })
    } else {
      setState(s => ({ ...s, isLoading: false }))
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await authApi.login(email, password)
    setToken(token)
    setStoredUser(user)
    setState({
      user,
      isAuthenticated: true,
      isLoading:       false,
      isAdmin:         user.role === 'ADMIN',
    })
    return user
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    const { token, user } = await authApi.register(email, password)
    setToken(token)
    setStoredUser(user)
    setState({
      user,
      isAuthenticated: true,
      isLoading:       false,
      isAdmin:         user.role === 'ADMIN',
    })
    return user
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setState({ user: null, isAuthenticated: false, isLoading: false, isAdmin: false })
    window.location.href = '/login'
  }, [])

  return { ...state, login, register, logout }
}

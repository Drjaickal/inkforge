'use client'
import { useState, useEffect, useCallback } from 'react'
import { authApi, getToken, getStoredUser, setToken, setStoredUser, removeToken } from '@/lib/api'
import type { ApiUser } from '@/lib/api'

export function useAuth() {
    const [user, setUser] = useState<ApiUser | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = getToken()
        const u = getStoredUser()
        if (token && u) { setUser(u); setIsAuthenticated(true) }
        setIsLoading(false)
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        const { token, user } = await authApi.login(email, password)
        setToken(token)
        setStoredUser(user)
        setUser(user)
        setIsAuthenticated(true)
        return user
    }, [])

    const logout = useCallback(() => {
        removeToken()
        setUser(null)
        setIsAuthenticated(false)
        window.location.href = '/login'
    }, [])

    return {
        user,
        isAuthenticated,
        isLoading,
        isAdmin: user?.role === 'ADMIN',
        login,
        logout,
    }
}
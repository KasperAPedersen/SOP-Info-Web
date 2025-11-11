import { createContext, useState, useEffect } from 'react'
import api from '../services/api'
import websocket from '../services/websocket'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (token && storedUser) {
            setUser(JSON.parse(storedUser))
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            websocket.connect(token)
        }

        setLoading(false)
    }, [])

    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))

        const token = localStorage.getItem('token')
        if (token) {
            websocket.connect(token)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete api.defaults.headers.common['Authorization']
        websocket.disconnect()
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import '../styles/Login.css'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const sanitizeInput = (input) => {
        return input.trim().replace(/[<>]/g, '')
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const cleanUsername = sanitizeInput(username)
        const cleanPassword = password

        if (cleanUsername.length < 3 || cleanPassword.length < 3) {
            setError('Ugyldigt brugernavn eller adgangskode')
            setLoading(false)
            return
        }

        try {
            const response = await api.post('/user/authenticate', {
                username: cleanUsername,
                password: cleanPassword
            })

            const { token, user } = response.data
            localStorage.setItem('token', token)
            login(user)

            setPassword('')

            navigate('/dashboard')
        } catch (error) {
            setError('Login fejlede. Tjek dine oplysninger og prøv igen.')
            console.error('Login error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <input
                    type="text"
                    placeholder="Brugernavn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={50}
                    required
                />
                <input
                    type="password"
                    placeholder="Adgangskode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={100}
                    autoComplete="current-password"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logger ind...' : 'Log ind'}
                </button>
            </form>
        </div>
    )
}

export default Login

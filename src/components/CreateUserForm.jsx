import { useState } from 'react'
import api from '../services/api'
import '../styles/MessageForm.css'

function CreateUserForm() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setLoading(true)

        if (firstName.trim().length < 2) {
            setError('Fornavn skal være mindst 2 tegn')
            setLoading(false)
            return
        }

        if (lastName.trim().length < 2) {
            setError('Efternavn skal være mindst 2 tegn')
            setLoading(false)
            return
        }

        if (username.trim().length < 3) {
            setError('Brugernavn skal være mindst 3 tegn')
            setLoading(false)
            return
        }

        if (password.trim().length < 6) {
            setError('Adgangskode skal være mindst 6 tegn')
            setLoading(false)
            return
        }

        try {
            await api.post('/user/new', {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                username: username.trim(),
                password: password.trim()
            })

            setSuccess(true)
            setFirstName('')
            setLastName('')
            setUsername('')
            setPassword('')

            setTimeout(() => setSuccess(false), 3000)
        } catch (error) {
            setError('Kunne ikke oprette bruger. Prøv igen.')
            console.error('Create user error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="message-form-container">
            <form className="message-form" onSubmit={handleSubmit}>
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">Bruger oprettet!</div>}

                <div className="form-group">
                    <label htmlFor="firstName">Fornavn</label>
                    <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Indtast fornavn..."
                        maxLength={100}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Efternavn</label>
                    <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Indtast efternavn..."
                        maxLength={100}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="username">Brugernavn</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Indtast brugernavn..."
                        maxLength={100}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Adgangskode</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Indtast adgangskode..."
                        maxLength={100}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Opretter...' : 'Opret Bruger'}
                </button>
            </form>
        </div>
    )
}

export default CreateUserForm

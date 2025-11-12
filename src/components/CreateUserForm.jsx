import { useState } from 'react'
import api from '../services/api'
import '../styles/MessageForm.css'

function CreateUserForm() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setLoading(true)

        if (name.trim().length < 2) {
            setError('Navn skal være mindst 2 tegn')
            setLoading(false)
            return
        }

        if (password.trim().length < 6) {
            setError('Adgangskode skal være mindst 6 tegn')
            setLoading(false)
            return
        }

        try {
            await api.post('/user', {
                name: name.trim(),
                email: email.trim(),
                password: password.trim()
            })

            setSuccess(true)
            setName('')
            setEmail('')
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
                    <label htmlFor="name">Navn</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Indtast navn..."
                        maxLength={100}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Indtast email..."
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

import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import '../styles/MessageForm.css'

function MessageForm() {
    const { user } = useContext(AuthContext)
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setLoading(true)

        if (title.trim().length < 3) {
            setError('Titel skal være mindst 3 tegn')
            setLoading(false)
            return
        }

        if (message.trim().length < 10) {
            setError('Besked skal være mindst 10 tegn')
            setLoading(false)
            return
        }

        try {
            await api.post('/message/new', {
                sender_id: user.id,
                title: title.trim(),
                message: message.trim()
            })

            setSuccess(true)
            setTitle('')
            setMessage('')

            setTimeout(() => setSuccess(false), 3000)
        } catch (error) {
            setError('Kunne ikke sende besked. Prøv igen.')
            console.error('Message error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="message-form-container">
            <form className="message-form" onSubmit={handleSubmit}>
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">Besked sendt!</div>}

                <div className="form-group">
                    <label htmlFor="title">Titel</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Indtast titel..."
                        maxLength={100}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Besked</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Skriv din besked her..."
                        rows={8}
                        maxLength={1000}
                        required
                    />
                    <span className="char-count">{message.length}/1000</span>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Sender...' : 'Send Besked'}
                </button>
            </form>
        </div>
    )
}

export default MessageForm

import { useState, useEffect } from 'react'
import api from '../services/api'
import websocket from '../services/websocket'
import '../styles/AbsenceTable.css'

function AbsenceTable() {
    const [absences, setAbsences] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [processingId, setProcessingId] = useState(null)

    useEffect(() => {
        fetchAbsences()

        const handleAbsenceUpdate = (data) => {

            setAbsences(prev => {
                const filtered = prev.filter(a => a.userId !== data.userId)

                return [...filtered, {
                    id: data.id,
                    userId: data.userId,
                    user: data.username,
                    status: data.status,
                    reason: data.message,
                    type: data.type,
                    date: new Date().toLocaleDateString('da-DK')
                }]
            })
        }

        websocket.on('absence', handleAbsenceUpdate)

        return () => {
            websocket.off('absence', handleAbsenceUpdate)
        }
    }, [])

    const fetchAbsences = async () => {
        try {
            const response = await api.get('/absence/get/all')
            setAbsences(response.data)
        } catch (error) {
            setError('Kunne ikke hente fravær')
            console.error('Absence fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (id, status) => {
        setProcessingId(id)
        setError('')

        try {
            await api.post(`/absence/${id}/set/status`, { status })
        } catch (error) {
            setError('Kunne ikke opdatere status')
            console.error('Status update error:', error)
        } finally {
            setProcessingId(null)
        }
    }

    const getStatusBadge = (status) => {
        const badges = {
            'afventer': { class: 'status-pending', text: 'Afventer' },
            'godkendt': { class: 'status-approved', text: 'Godkendt' },
            'afvist': { class: 'status-rejected', text: 'Afvist' }
        }
        return badges[status] || badges['afventer']
    }

    const getTypeBadge = (type) => {
        const types = {
            'syg': '🤒 Sygdom',
            'andet': '📋 Andet',
        }
        return types[type] || type
    }

    if (loading) {
        return <div className="absence-loading">Henter fravær...</div>
    }

    if (error) {
        return <div className="absence-error">{error}</div>
    }

    if (absences.length === 0) {
        return <div className="absence-empty">Ingen fravær registreret</div>
    }

    return (
        <div className="absence-table-container">
            <table className="absence-table">
                <thead>
                <tr>
                    <th>Bruger</th>
                    <th>Dato</th>
                    <th>Type</th>
                    <th>Besked</th>
                    <th>Status</th>
                    <th>Handlinger</th>
                </tr>
                </thead>
                <tbody>
                {absences.map(absence => {
                    const statusBadge = getStatusBadge(absence.status)
                    const isProcessing = processingId === absence.id

                    return (
                        <tr key={absence.id}>
                            <td className="user-cell">{absence.user}</td>
                            <td>{absence.date}</td>
                            <td>
                                <span className="type-badge">
                                    {getTypeBadge(absence.type.toLowerCase())}
                                </span>
                            </td>
                            <td className="reason-cell">{absence.reason}</td>
                            <td>
                                <span className={`status-badge ${statusBadge.class}`}>
                                    {statusBadge.text}
                                </span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    {absence.status !== 'godkendt' && (
                                        <button
                                            className="btn-approve"
                                            onClick={() => handleStatusChange(absence.id, 'godkendt')}
                                            disabled={isProcessing}
                                        >
                                            ✓ Godkend
                                        </button>
                                    )}
                                    {absence.status !== 'afvist' && (
                                        <button
                                            className="btn-reject"
                                            onClick={() => handleStatusChange(absence.id, 'afvist')}
                                            disabled={isProcessing}
                                        >
                                            ✗ Afvis
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default AbsenceTable

import { useState, useEffect } from 'react'
import api from '../services/api'
import websocket from '../services/websocket'
import '../styles/AttendanceTable.css'

function AttendanceTable() {
    const [attendances, setAttendances] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchAttendances()

        const handleAttendanceUpdate = (data) => {
            if (data.type === 'attendance') {
                setAttendances(prev => {
                    const index = prev.findIndex(a => a.id === data.id)

                    if (index !== -1) {
                        const updated = [...prev]
                        updated[index] = {
                            ...updated[index],
                            status: data.status
                        }
                        return updated
                    }

                    return [...prev, {
                        id: data.id,
                        userId: data.userId,
                        user: data.username || 'Ukendt',
                        status: data.status
                    }]
                })
            }
        }

        websocket.on('attendance', handleAttendanceUpdate)

        return () => {
            websocket.off('attendance', handleAttendanceUpdate)
        }
    }, [])

    const fetchAttendances = async () => {
        try {
            const response = await api.get('/attendance/get/all')
            setAttendances(response.data)
        } catch (error) {
            setError('Kunne ikke hente fremmøde')
            console.error('Attendance fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const badges = {
            'present': { class: 'status-present', text: 'Til stede' },
            'not present': { class: 'status-absent', text: 'Fraværende' }
        }
        return badges[status] || { class: 'status-absent', text: 'Fraværende' }
    }

    if (loading) {
        return <div className="attendance-loading">Henter fremmøde...</div>
    }

    if (error) {
        return <div className="attendance-error">{error}</div>
    }

    if (attendances.length === 0) {
        return <div className="attendance-empty">Ingen fremmøde registreret</div>
    }

    return (
        <div className="attendance-table-container">
            <table className="attendance-table">
                <thead>
                <tr>
                    <th>Bruger</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {attendances.map(attendance => {
                    const statusBadge = getStatusBadge(attendance.status)

                    return (
                        <tr key={attendance.id}>
                            <td className="user-cell">{attendance.user}</td>
                            <td>
                                <span className={`status-badge ${statusBadge.class}`}>
                                    {statusBadge.text}
                                </span>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default AttendanceTable

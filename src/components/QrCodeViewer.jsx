import { useEffect, useState } from 'react'
import api from '../services/api'
import websocket from '../services/websocket'

function QrCodeViewer() {
    const [qrCode, setQrCode] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchQrCode = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await api.get('/qr/get')
            if (response.data.success && response.data.qrCode) {
                setQrCode(response.data.qrCode)
            } else {
                setError('Failed to generate QR code')
            }
        } catch {
            setError('Server error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQrCode()

        const handleAttendanceUpdate = async (data) => {
            if (data.type === 'attendence') {
                await fetchQrCode()
            }
        }

        websocket.on('attendence', handleAttendanceUpdate)
        return () => {
            websocket.off('attendence', handleAttendanceUpdate)
        }
    }, [])

    if (loading) return <div>Loading QR code...</div>
    if (error) return <div>{error}</div>
    if (!qrCode) return <div>No QR code available</div>

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Check-in QR Code</h2>
            <img src={qrCode} alt="QR kode" style={{ maxWidth: 300 }} />
        </div>
    )
}

export default QrCodeViewer

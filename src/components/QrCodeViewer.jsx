import { useEffect, useState } from 'react'
import api from '../services/api'
import websocket from '../services/websocket'
import { Loader2, RefreshCw, QrCode, Wifi, WifiOff, Clock } from 'lucide-react'
import '../styles/QrCodeViewer.css'

function QrCodeViewer() {
    const [qrCode, setQrCode] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [lastUpdated, setLastUpdated] = useState(null)

    const fetchQrCode = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await api.get('/attendence/get/qr')
            if (response.data.success && response.data.qrCode) {
                setQrCode(response.data.qrCode)
                setLastUpdated(new Date())
            } else {
                setError('Failed to generate QR code')
            }
        } catch {
            setError('Server error')
        } finally {
            setLoading(false)
        }
    }

    const refreshQrCode = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await api.get('/attendence/refresh/qr')
            if (response.data.success && response.data.qrCode) {
                setQrCode(response.data.qrCode)
                setLastUpdated(new Date())
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

        const handleQrUpdate = (data) => {
            if (data.type === 'qr') {
                setQrCode(data.qrCode)
                setLastUpdated(new Date())
            }
        }

        websocket.on('qr', handleQrUpdate)

        return () => {
            websocket.off('qr', handleQrUpdate)
            websocket.off('connect')
            websocket.off('disconnect')
        }
    }, [])

    return (
        <div className="qr-viewer">
            <div className="qr-card">
                <div className="qr-header">
                    <div className="qr-header-top">
                        <QrCode className="qr-icon" />
                        <h2>Live Check-In QR Code</h2>
                    </div>

                    <p>Scan the QR code below to check in or confirm your presence.</p>
                </div>

                <div className="qr-body">
                    {error && (
                        <div className="qr-status error">
                            <WifiOff />
                            <p>{error}</p>
                        </div>
                    )}
                    {!error && qrCode && (
                        <img src={qrCode} alt="QR Code" className="qr-image" />
                    )}
                </div>

                <div className="qr-footer">
                    <button onClick={refreshQrCode} disabled={loading} className="qr-btn">
                        <RefreshCw className={loading ? 'spin' : ''} />
                        {loading ? 'Refreshing...' : 'Refresh Code'}
                    </button>
                    <div className="qr-meta">
                        <Clock size={14} />
                        <span>
              {lastUpdated
                  ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
                  : 'Waiting for update...'}
            </span>
                    </div>
                    <div className="qr-live-indicator">
                        <div className="dot"></div> Live auto-updating enabled
                    </div>
                </div>
            </div>

            <div className="qr-info">
                <h3>How it works</h3>
                <ul>
                    <li>✅ Each QR code is unique and changes in real-time.</li>
                    <li>📡 The code refreshes automatically when attendance updates.</li>
                    <li>⚙️ Can be refreshed manually if needed.</li>
                </ul>
            </div>
        </div>
    )
}

export default QrCodeViewer

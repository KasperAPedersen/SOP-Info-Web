class WebSocketService {
    constructor() {
        this.ws = null
        this.listeners = new Map()
        this.reconnectAttempts = 0
        this.maxReconnectAttempts = 5
        this.reconnectDelay = 3000
        this.token = null
    }

    connect(token) {
        this.token = token
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsHost = import.meta.env.VITE_WS_HOST || 'localhost:3000'
        const wsUrl = `${wsProtocol}//${wsHost}`

        try {
            this.ws = new WebSocket(wsUrl)

            this.ws.onopen = () => {
                this.reconnectAttempts = 0

                this.subscribe('qr') // Always subscribe to qr

                if (token) {
                    this.subscribe('absence')
                    this.subscribe('message')
                    this.subscribe('attendence')
                }
            }

            this.ws.onmessage = (event) => {

                try {
                    const data = JSON.parse(event.data)

                    this.handleMessage(data)
                } catch (error) {
                    console.error('❌ WebSocket message parse error:', error)
                    console.error('Raw message:', event.data)
                }
            }

            this.ws.onclose = () => {
                this.attemptReconnect()
            }

            this.ws.onerror = (error) => {
                console.error('⚠️ WebSocket error:', error)
            }
        } catch (error) {
            console.error('❌ WebSocket connection failed:', error)
            this.attemptReconnect()
        }
    }

    subscribe(type) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ subscribe: type }))
        }
    }

    unsubscribe(type) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ unsubscribe: type }))
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts && this.token) {
            this.reconnectAttempts++
            setTimeout(() => this.connect(this.token), this.reconnectDelay)
        }
    }

    handleMessage(data) {
        this.listeners.forEach((handlers, channel) => {
            if (handlers && handlers.size > 0) {
                handlers.forEach(handler => handler(data))
            }
        })
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }
        this.listeners.get(event).add(callback)
    }

    off(event, callback) {
        const handlers = this.listeners.get(event)
        if (handlers) {
            handlers.delete(callback)
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
        this.listeners.clear()
        this.token = null
    }
}

export default new WebSocketService()

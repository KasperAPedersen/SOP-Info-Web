import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/Sidebar.css'

function Sidebar({ activeView, onViewChange }) {
    const { user } = useContext(AuthContext)

    if (!user?.admin) return null

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <button
                    className={`sidebar-item ${activeView === 'create-user' ? 'active' : ''}`}
                    onClick={() => onViewChange('create-user')}
                >
                    <span className="icon">👤</span>
                    <span className="label">Opret bruger</span>
                </button>
                <button
                    className={`sidebar-item ${activeView === 'messages' ? 'active' : ''}`}
                    onClick={() => onViewChange('messages')}
                >
                    <span className="icon">📧</span>
                    <span className="label">Send Besked</span>
                </button>
                <button
                    className={`sidebar-item ${activeView === 'absences' ? 'active' : ''}`}
                    onClick={() => onViewChange('absences')}
                >
                    <span className="icon">📋</span>
                    <span className="label">Se Fravær</span>
                </button>
                <button
                    className={`sidebar-item ${activeView === 'dev' ? 'active' : ''}`}
                    onClick={() => onViewChange('dev')}
                >
                    <span className="icon">⚙️</span>
                    <span className="label">Dev</span>
                </button>
            </nav>
        </aside>
    )
}

export default Sidebar

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
            </nav>
        </aside>
    )
}

export default Sidebar

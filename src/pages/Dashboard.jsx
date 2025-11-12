import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import MessageForm from '../components/MessageForm'
import AbsenceTable from '../components/AbsenceTable'
import CreateUserForm from '../components/CreateUserForm'
import '../styles/Dashboard.css'

function Dashboard() {
    const { user: _user } = useContext(AuthContext)
    const [activeView, setActiveView] = useState('absences')
    const [userInitStatus, setUserInitStatus] = useState('')
    const [messageInitStatus, setMessageInitStatus] = useState('')

    const handleUserInit = async () => {
        try {
            setUserInitStatus('Loading...')
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/init`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json()
            console.log(data);
            if (data.success) {
                setUserInitStatus('✓ Users initialized successfully')
            } else {
                setUserInitStatus('✗ Failed to initialize users')
            }
        } catch (error) {
            console.error(error)
            setUserInitStatus('✗ Error: ' + error.message)
        }
    }

    const handleMessageInit = async () => {
        try {
            setMessageInitStatus('Loading...')
            const response = await fetch(`${import.meta.env.VITE_API_URL}/message/init`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json()

            if (data.success) {
                setMessageInitStatus('✓ Messages initialized successfully')
            } else {
                setMessageInitStatus('✗ Failed to initialize messages')
            }
        } catch (error) {
            console.error(error)
            setMessageInitStatus('✗ Error: ' + error.message)
        }
    }

    const renderContent = () => {
        switch (activeView) {
            case 'messages':
                return (
                    <div className="view-content">
                        <h2>Send Besked</h2>
                        <MessageForm />
                    </div>
                )
            case 'absences':
                return (
                    <div className="view-content">
                        <h2>Fravær Oversigt</h2>
                        <AbsenceTable />
                    </div>
                )
            case 'dev':
                return (
                    <div className="view-content">
                        <h2>Developer Settings</h2>
                        <div className="dev-grid">
                            <div className="dev-card">
                                <div className="dev-card-header">
                                    <span className="dev-card-icon">👥</span>
                                    <h3>Initialize Users</h3>
                                </div>
                                <p className="dev-card-description">
                                    Create default test users in the database
                                </p>
                                <button onClick={handleUserInit} className="dev-button">
                                    Run Init
                                </button>
                                {userInitStatus && <p className="dev-status">{userInitStatus}</p>}
                            </div>

                            <div className="dev-card">
                                <div className="dev-card-header">
                                    <span className="dev-card-icon">📧</span>
                                    <h3>Initialize Messages</h3>
                                </div>
                                <p className="dev-card-description">
                                    Create default test messages in the database
                                </p>
                                <button onClick={handleMessageInit} className="dev-button">
                                    Run Init
                                </button>
                                {messageInitStatus && <p className="dev-status">{messageInitStatus}</p>}
                            </div>
                        </div>
                    </div>
                )
            case 'create-user':
                return (
                    <div className="view-content">
                        <h2>Opret bruger</h2>
                        <CreateUserForm />
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="dashboard">
            <Header />
            <div className="dashboard-layout">
                <Sidebar activeView={activeView} onViewChange={setActiveView} />
                <main className="dashboard-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    )
}

export default Dashboard

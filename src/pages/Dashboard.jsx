import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import MessageForm from '../components/MessageForm'
import AbsenceTable from '../components/AbsenceTable'
import '../styles/Dashboard.css'

function Dashboard() {
    const { user } = useContext(AuthContext)
    const [activeView, setActiveView] = useState('messages')

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

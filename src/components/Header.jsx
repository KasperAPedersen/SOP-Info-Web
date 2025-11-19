import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Header.css'

function Header() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/admin')
    }

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <h1>SOP Info</h1>
                    {user && <span className="user-role">{user.admin ? 'Admin' : 'Bruger'}</span>}
                </div>
                <div className="header-right">
                    {user && (
                        <>
                            <span className="username">Velkommen, {user.username}</span>
                            <button className="logout-btn" onClick={handleLogout}>
                                Log ud
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header

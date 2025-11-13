import '../styles/Dashboard.css'
import QrCodeViewer from "../components/QrCodeViewer.jsx";

function Qr() {
    const renderContent = () => {
        return (
            <QrCodeViewer />
        )
    }

    return (
        <div className="qr">
            {renderContent()}
        </div>
    )
}

export default Qr

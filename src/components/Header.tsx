export default function Header() {
    return (
        <header className="header">
            <div className="marvel-logo">
                <img
                    src="/marvel-logo.svg"
                    alt="Marvel"
                    className="marvel-img"
                />
            </div>
            <h1 className="header-title">MCU Timeline</h1>
            <p className="header-subtitle">
                L'ordre chronologique complet du Marvel Cinematic Universe
            </p>
        </header>
    );
}

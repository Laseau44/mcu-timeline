export default function Header({ multiverse = false }: { multiverse?: boolean }) {
    return (
        <header className="header">
            <div className="marvel-logo">
                <img
                    src="/marvel-logo.svg"
                    alt="Marvel"
                    className="marvel-img"
                />
            </div>
            <h1 className="header-title">{multiverse ? 'Marvel Timeline' : 'MCU Timeline'}</h1>
            <p className="header-subtitle">
                {multiverse ? 'Le guide de visionnage Marvel, univers par univers' : "L'ordre chronologique complet du Marvel Cinematic Universe"}
            </p>
        </header>
    );
}

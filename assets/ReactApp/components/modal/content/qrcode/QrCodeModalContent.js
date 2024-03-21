import React from "react";
import {useSelector} from "react-redux";

function QrCodeModalContent({setIsModalOpen}) {
    const darkMode = useSelector(state => state.darkMode);

    return (
        <div className="container text-center" role="dialog" data-testid="qr-code-modal">
            <h2 className="text-dark-emphasis">
                Zeskanuj poniższy kod QR w aplikacji <strong>Mediminder Alerts <i
                className="fa-solid fa-qrcode"></i></strong>
            </h2>
            <p className="lead">Miejsce na kod QR</p>
            <button
                data-testid="btn-close-modal"
                className={`btn ${darkMode ? 'btn-light' : 'btn-dark'}`}
                onClick={() => {
                    setIsModalOpen(false);
                }}
            >Zamknij <i className="fa-solid fa-close"></i>
            </button>
        </div>
    );
}

export default QrCodeModalContent;
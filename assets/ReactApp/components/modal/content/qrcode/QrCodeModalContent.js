import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RotatingLines} from "react-loader-spinner";

function QrCodeModalContent({isQrCodeRequested, setIsModalOpen}) {
    const darkMode = useSelector(state => state.darkMode);
    const [isLoading, setIsLoading] = useState(false);

    const getQrCode = async () => {
        setIsLoading(true);
        const response = (await fetch('/qr-code', {})).text();
        setIsLoading(false);
        return response;
    };

    useEffect(() => {
        if (isQrCodeRequested) {
            const qrPlacement = document.querySelector("#qr-placement");
            getQrCode()
                .then(res => qrPlacement.innerHTML = res)
                .catch(err => {
                    qrPlacement.innerHTML = '<p id="qr-error" class="text-danger">Nie udało się wygenerować kodu QR <i class="fa-regular fa-face-frown"></i></p>';
                    console.log(err);
                });
        }
    }, [isQrCodeRequested]);

    return (
        <div className="container text-center" role="dialog" data-testid="qr-code-modal">
            <h2 className="text-dark-emphasis">
                Zeskanuj poniższy kod QR w aplikacji <strong>MediMinder Alerts <i
                className="fa-solid fa-qrcode"></i></strong>
            </h2>
            <div id="qr-placement" className={`${darkMode ? 'my-3' : 'mb-2'}`}></div>
            {
                isLoading &&
               <div className="mb-3">
                   <RotatingLines
                       visible={true}
                       height="96"
                       width="96"
                       color="grey"
                       strokeColor="#78C2AD"
                       strokeWidth="5"
                       animationDuration="0.75"
                       ariaLabel="rotating-lines-loading"
                   />
               </div>
            }
            <button
                data-testid="btn-close-modal"
                className={`btn ${darkMode ? 'btn-light' : 'btn-dark'}`}
                onClick={() => {
                    setIsModalOpen(false);
                }}
            >
                Zamknij <i className="fa-solid fa-close"></i>
            </button>
        </div>
    );
}

export default QrCodeModalContent;
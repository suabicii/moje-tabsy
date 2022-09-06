import React from "react";

function StatusOkModalContent({setIsModalOpen}) {
    return (
        <div className="container text-center" role="dialog" data-testid="status-ok">
            <h2 className="text-success">Twoje nowe dane zostały tymczasowo zapisane 🙂</h2>
            <p className="mt-2">
                Aby w pełni zaktualizować swoje dane, sprawdź swoją skrzynkę
                pocztową <i className="fa-regular fa-envelope"></i>,
                <br/> gdzie znajdziesz wiadomość email z linkiem do
                potwierdzenia zmiany <i className="fa-solid fa-check"></i>
            </p>
            <p className="text-info">
                Jeśli nie możesz znaleźć tego maila w skrzynce odbiorczej <i className="fa-solid fa-inbox"></i>,
                sprawdź folder SPAM
            </p>
            <button className="btn btn-primary mt-2" onClick={() => {
                setIsModalOpen(false);
            }}>OK <i className="fa-solid fa-check"></i>
            </button>
        </div>
    );
}

export default StatusOkModalContent;
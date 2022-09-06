import React from "react";

function StatusFailModalContent({setIsModalOpen}) {
    return (
        <div className="container text-center" role="dialog" data-testid="status-failed">
            <h2 className="text-danger">Błąd! 🙁</h2>
            <p>Zmiana danych nie powiodła się <i className="fa-regular fa-face-frown-slight"></i></p>
            <small className="d-block text-danger">Błędny format danych lub błąd serwera 😠</small>
            <button className="btn btn-danger mt-2" onClick={() => {
                setIsModalOpen(false);
            }}>OK <i className="fa-solid fa-check"></i>
            </button>
        </div>
    );
}

export default StatusFailModalContent;